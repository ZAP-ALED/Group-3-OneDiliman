import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faTrash,
  faCalendarDay,
  faClock,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import './EventCard.css'; 
import Modal from 'react-bootstrap/Modal';

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
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
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

  return (
    <div className="event-card" onClick={handleCardClick}>
      <div className="event-content">
        <div className="event-title">{event.eventName || 'Untitled Event'}</div>
        {isUserAnOrgAdmin && (
          <div className="admin-actions">
            <button
              className="admin-action-button"
              onClick={(e) => handleButtonClick(e, () => onEdit(event))}
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
          <button className="event-action-button" onClick={(e) => e.stopPropagation()}>
            <div className="question-mark">?</div>
            <span>Going</span>
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