import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faTrash,
  faCalendarDay,
  faClock,
  faLocationDot,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import './EventCard.css'; 
import Modal from 'react-bootstrap/Modal';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, or } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { addNotification } from '../../components/FirebaseConnection';
import { collection, addDoc } from 'firebase/firestore';

interface Event {
  id: string;
  eventId: string;
  eventOwner: string;
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventPictures: string[];
  eventTags: string[];
  eventDate: string;
  eventTime: string;
  willNotify: string[];
}

interface EventCardDeets {
  event: Event;
  isUserAnOrgAdmin: boolean;
  onEdit: (event: Event) => void;
  onDelete: (eventID: string) => void;
}

const EventCard: React.FC<EventCardDeets> = ({ event, isUserAnOrgAdmin, onEdit, onDelete }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [isGoing, setIsGoing] = useState(false); // State to track if the user is going to the event
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCardClick = () => {
    setShowFullContent(!showFullContent);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    console.log('image', imageUrl); 
    e.stopPropagation();
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  //Toggable Going button
  const handleToggleGoing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const eventDocRef = doc(db, 'events', event.id);
      if (isGoing) {
        await updateDoc(eventDocRef, {
          willNotify: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(eventDocRef, {
          willNotify: arrayUnion(user.uid)
        });
      }
      setIsGoing(!isGoing);
    }
  };

  // Sends out a message to users who are going to the event when the event is coming up soon
  const checkForTimeBeforeEvent = async (eventTime: number) => {
    // Tuple Time intervals to notify users before the event. Format: (time, message)
    const notifyTimes: [number, string][] = [
      [5 * 24 * 60 * 60 * 1000, '5 days'],
      [3 * 24 * 60 * 60 * 1000, '3 days'],
      [24 * 60 * 60 * 1000, '1 day'],
      [3 * 60 * 60 * 1000, '3 hours'],
      [1 * 60 * 60 * 1000, '1 hour'],
    ];
  
    const now = new Date().getTime();
    const timeDiff = eventTime - now;
  
    for (let notifTimeIndex = 0; notifTimeIndex < notifyTimes.length; notifTimeIndex++) {
      const [notifyTime, _] = notifyTimes[notifTimeIndex];
      if (Math.abs(timeDiff - notifyTime) <= 500) { // Check if within 1 second range
        
        // Wait for 1 second before sending the notification request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return notifyTimes[notifTimeIndex];
      }
    }
  
    return null;
  };

  useEffect(() => {
    const notifyUsers = async () => {
      const eventDate = new Date(event.eventDate + ' ' + event.eventTime).getTime();
      const notifyTime = await checkForTimeBeforeEvent(eventDate);
  
      if (notifyTime) {
        for (const userId of event.willNotify) {
          try {
            await addNotification(
              userId,
              `Reminder: The event "${event.eventName}" is coming up in ${notifyTime[1]}!`,
              event.eventOwner,
              event.id
            );
            console.log(`Notification created for user ${userId}`);
          } catch (error) {
            console.error('Error creating notification: ', error);
          }
        }
      }
    };
  
    const intervalId = setInterval(notifyUsers, 1000); // Check every second
  
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [event]);

  return (
    <div className="event-card" onClick={handleCardClick}>
      <div className="event-content">
        <div className="event-title">{event.eventName || 'Untitled Event'}</div>
        {isUserAnOrgAdmin && (
          <div className="admin-actions">
            <button
              className="admin-action-button"
              onClick={(e) => handleButtonClick(e, () => onEdit(event))}
              data-testid="edit-event-button"
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button
              className="admin-action-button delete"
              onClick={(e) => handleButtonClick(e, () => onDelete(event.id))}
              data-testid="delete-event-button"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      </div>
      
      {event.eventPictures && event.eventPictures.length > 0 && (
        <div className="event-image-container">
          <img 
            src={event.eventPictures[0]} 
            alt={event.eventName || 'Event'}
            className="event-banner-image"
            onClick={(e) => handleImageClick(e, event.eventPictures[0])}
          />   
        </div>
      )}
      
      <div className="event-main-content">
        <div className="text-content">
          <div className={`content-text ${!showFullContent ? 'collapsed' : ''}`}>
            {event.eventDescription || 'No description available.'}
          </div>
          {!showFullContent && event.eventDescription && event.eventDescription.length > 120 && (
            <div className="content-fade" />
          )}
        </div>
        
        <div className="event-meta">
          <div className="event-date-time">
            <div className="event-date">
              <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <div className="event-time">
              <FontAwesomeIcon icon={faClock} className="event-icon" />
              <span>{event.eventTime || 'No time'}</span>
            </div>
          </div>
          
          {event.eventLocation && (
            <div className="event-location">
              <FontAwesomeIcon icon={faLocationDot} className="event-icon" />
              <span>{event.eventLocation}</span>
            </div>
          )}
        </div>
        
        {event.eventTags && event.eventTags.length > 0 && (
          <div className="event-tags">
            {event.eventTags.map((tag, index) => (
              <span key={index} className="type-badge">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="event-actions">
          <button 
            className={`event-action-button ${isGoing ? 'going' : ''}`} 
            onClick={handleToggleGoing}
          >
            <span className={`badge-icon ${isGoing ? 'going' : ''}`}>
              {isGoing && <FontAwesomeIcon icon={faCheck} />}
            </span>
            <span>{isGoing ? 'Going' : 'Not Going'}</span>
          </button>
        </div>
      </div>

      <Modal 
        show={showImageModal} 
        onHide={() => setShowImageModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          <img 
            src={selectedImage} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80vh', 
              objectFit: 'contain',
              margin: '0 auto'
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EventCard;
