import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
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

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

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
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                className="action-button delete"
                onClick={(e) => handleButtonClick(e, () => onDelete(post.id))}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;