import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faTrash,
  faCalendarAlt,
  faClock,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import './PostCard.css'; 

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
  // isUserAnOrgAdmin: boolean;
  // onEdit: (post: Post) => void;
  // onDelete: (postId: string) => void;
}

const EventCard: React.FC<EventCardDeets> = ({ event }) => {
  const [showFullContent, setShowFullContent] = useState(false);

  
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  }

  const handleCardClick = () => {
    setShowFullContent(!showFullContent);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-content">
        <div className="date-section">
          <span>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            {formatDate(event.eventDate)}
          </span>
          <span className="time">
            <FontAwesomeIcon icon={faClock} className="ms-3 me-2" />
            {event.eventTime || 'No time'}
          </span>
          {event.eventLocation && (
            <span className="location ms-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
              {event.eventLocation}
            </span>
          )}
        </div>

        <div className="post-main-content">
          <div className="text-content">
            <h2 className="post-title">{event.eventName || 'Untitled Event'}</h2>

            <div className="content-wrapper">
              <div className={`content-text ${!showFullContent ? 'collapsed' : ''}`}>
                {event.eventDescription || 'No description available.'}
              </div>
              {!showFullContent && event.eventDescription && event.eventDescription.length > 240 && (
                <div className="content-fade" />
              )}
            </div>
          </div>

          {event.eventPictures && Array.isArray(event.eventPictures) && event.eventPictures.length > 0 && (
          <div className="post-image-container">
            {event.eventPictures.map((imageUrl, index) => (
              <img 
                key={index}
                src={imageUrl} 
                alt={`${event.eventName || 'Event'} - Image ${index + 1}`}
                className="post-image"
              />
            ))}
          </div>
        )}
        </div>

        <div className="bottom-meta">
          <div className="post-tags">
            {event.eventTags && event.eventTags.map((tag, index) => (
              <span key={index} className="type-badge">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;