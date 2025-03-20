import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDay, 
  faClock, 
  faLocationDot,
  faUser,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { doc, getDoc, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../../FirebaseConfig';
import { Link } from 'react-router-dom';
import './NotificationDetailPopup.css';

interface Post {
  id: string;
  postOwner: string;
  postTitle: string;
  postContent: string;
  postPictures: string[];
  postTags: string[];
  postDate: string;
  postTime: string;
}

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

interface Organization {
  orgName: string;
  orgLogo: string;
}

interface NotificationDetailPopupProps {
  show: boolean;
  onHide: () => void;
  notificationType?: 'post' | 'event' | null; 
  itemId: string | null;
  orgId: string | null;
}

const NotificationDetailPopup: React.FC<NotificationDetailPopupProps> = ({
  show,
  onHide,
  notificationType,
  itemId,
  orgId
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [post, setPost] = useState<Post | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!show || !itemId || !orgId) {
        return;
      }
      
      setLoading(true);
      setError('');
      setPost(null);
      setEvent(null);
      
      try {
        const db = getFirestore(app);
        
        // Fetch organization data
        const orgDoc = await getDoc(doc(db, 'organizations', orgId));
        if (orgDoc.exists()) {
          setOrganization(orgDoc.data() as Organization);
        } else {
          console.warn('Organization document not found:', orgId);
        }
    
        // Fetch post data 
        let postFound = false;
        const postsCollection = collection(db, 'posts');
        const postQuery = query(postsCollection, where('postId', '==', itemId));
        const postQuerySnapshot = await getDocs(postQuery);
        
        if (!postQuerySnapshot.empty) {
          const postDoc = postQuerySnapshot.docs[0];
          setPost({ id: postDoc.id, ...postDoc.data() } as Post);
          postFound = true;
        } else {
          const eventsCollection = collection(db, 'events');
          const eventQuery = query(eventsCollection, where('eventId', '==', itemId));
          const eventQuerySnapshot = await getDocs(eventQuery);
          
          if (!eventQuerySnapshot.empty) {
            const eventDoc = eventQuerySnapshot.docs[0];
            console.log('Found event with eventId field');
            setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event);
            postFound = true; 
          } else {
            console.error("Content not found (ID: ${itemId})");
          }
        }
      } catch (error) {
        console.error("Error fetching details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [show, notificationType, itemId, orgId]);
  
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      size="lg"
      className="notification-detail-popup"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {organization?.orgName && (
            <div className="org-header">
              {organization.orgLogo && (
                <img 
                  src={organization.orgLogo} 
                  alt={organization.orgName} 
                  className="org-logo"
                />
              )}
              <span>{organization.orgName}</span>
            </div>
          )}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {loading ? (
          <div className="loading-container">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <p className="error-help">This may happen if the content has been deleted or is no longer available.</p>
            {orgId && (
              <Link to={`/dashboard/${orgId}`} className="btn btn-sm btn-outline-primary mt-2" onClick={onHide}>
                Go to Organization Page
              </Link>
            )}
          </div>
        ) : post ? (
          <div className="post-detail">
            <h2 className="post-title">{post.postTitle}</h2>
            
            <div className="post-meta">
              <div className="post-date">
                {formatDate(post.postDate)} at {post.postTime}
              </div>
              
              {post.postTags && post.postTags.length > 0 && (
                <div className="post-tags">
                  {post.postTags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="post-content">
              {post.postContent}
            </div>
            
            {post.postPictures && post.postPictures.length > 0 && (
              <div className="post-images">
                {post.postPictures.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`Post image ${index + 1}`} 
                    className="post-image"
                  />
                ))}
              </div>
            )}
          </div>
        ) : event ? (
          <div className="event-detail">
            <h2 className="event-title">{event.eventName}</h2>
            
            <div className="event-meta">
              <div className="event-date-time">
                <div className="event-date">
                  <FontAwesomeIcon icon={faCalendarDay} className="event-icon" />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="event-time">
                  <FontAwesomeIcon icon={faClock} className="event-icon" />
                  <span>{event.eventTime}</span>
                </div>
              </div>
              
              {event.eventLocation && (
                <div className="event-location">
                  <FontAwesomeIcon icon={faLocationDot} className="event-icon" />
                  <span>{event.eventLocation}</span>
                </div>
              )}
              
              {event.willNotify && event.willNotify.length > 0 && (
                <div className="event-attendees">
                  <FontAwesomeIcon icon={faUser} className="event-icon" />
                  <span>{event.willNotify.length} attending</span>
                </div>
              )}
            </div>
            
            {event.eventTags && event.eventTags.length > 0 && (
              <div className="event-tags">
                {event.eventTags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            )}
            
            <div className="event-description">
              {event.eventDescription}
            </div>
            
            {event.eventPictures && event.eventPictures.length > 0 && (
              <div className="event-images">
                {event.eventPictures.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`Event image ${index + 1}`} 
                    className="event-image"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-data">No details available</div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {(post || event) && orgId && (
          <Link to={`/dashboard/${orgId}`} className="btn btn-primary" onClick={onHide}>
            <FontAwesomeIcon icon={faExternalLinkAlt} className="me-2" />
            View in Organization Page
          </Link>
        )}
        <button className="btn btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationDetailPopup;