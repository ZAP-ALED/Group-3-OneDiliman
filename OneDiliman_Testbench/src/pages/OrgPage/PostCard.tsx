import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import './PostCard.css';

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

interface PostCardDeets {
  post: Post;
  isUserAnOrgAdmin: boolean;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardDeets> = ({ post, isUserAnOrgAdmin, onEdit, onDelete }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const handleCardClick = () => {
    setShowFullContent(!showFullContent);
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };


  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-content">
        <div className="date-section">
          <span>{post.postDate} </span>
          <span className="time">{post.postTime}</span>
        </div>

        <div className="post-main-content">
          <div className="text-content">
            <h2 className="post-title">{post.postTitle}</h2>

            <div className="content-wrapper">
              <div className={`content-text ${!showFullContent ? 'collapsed' : ''}`}>
                {post.postContent}
              </div>
              {!showFullContent && post.postContent.length > 240 && (
                <div className="content-fade" />
              )}
            </div>
          </div>

          {post.postPictures && post.postPictures.length > 0 && (
            <div className="post-image-container">
              {post.postPictures.map((imageUrl, index) => (
                <img 
                  key={index}
                  src={imageUrl} 
                  alt={`${post.postTitle} - Image ${index + 1}`}
                  className="post-image"
                  onClick={(e) => handleImageClick(e, imageUrl)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bottom-meta">
          <div className="post-tags">
            {post.postTags.map((tag, index) => (
              <span key={index} className="type-badge">{tag}</span>
            ))}
          </div>

          {isUserAnOrgAdmin && (
            <div className="action-buttons">
              <button
                className="action-button"
                onClick={(e) => handleButtonClick(e, () => onEdit(post))}
                data-testid="edit-post-button"
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                className="action-button delete"
                onClick={(e) => handleButtonClick(e, () => onDelete(post.id))}
                data-testid="delete-post-button"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}
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

export default PostCard;