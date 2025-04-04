import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faTrash,
  faThumbsUp
} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import './PostCard.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { likePost, unlikePost, isStudent, hasLikedPost } from '../../firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


interface Post {
  id: string;
  postOwner: string;
  postTitle: string;
  postContent: string;
  postPictures: string[];
  postTags: string[];
  postDate: string;
  postTime: string;
  postLikes?: number;
  usersLiked?: string[];
}

interface PostCardDeets {
  post: Post;
  isUserAnOrgAdmin: boolean;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardDeets> = ({ post, isUserAnOrgAdmin, onEdit, onDelete }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [showFullContent, setShowFullContent] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(post.postLikes ?? 0);
  const [isStudentUser, setIsStudentUser] = useState<boolean | null>(null);


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


  //for user likes, changes the button
  useEffect(() => {
    if (!user || !post) return;
  
    const checkLikedStatus = async () => {
      const liked = await hasLikedPost(user.uid, post.id);
      setLiked(liked);
    };
  
    checkLikedStatus();
  }, [user, post]);

  //for post like number, changes number
  useEffect(() => {
    const fetchLikeCount = async () => {
      const db = getFirestore();
      const postRef = doc(db, 'posts', post.id);
      const postSnap = await getDoc(postRef);
  
      if (postSnap.exists()) {
        const data = postSnap.data();
        setLikeCount(data.postLikes ?? 0);
      }
    };
  
    fetchLikeCount();
  }, [post.id]);
  
  //for isStudent
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const result = await isStudent(user.uid);
        setIsStudentUser(result);
      }
    };
    checkUserRole();
  }, [user]);
  

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
          <div className="control-left">
            {post.postTags && post.postTags.length > 0 && (
              <div className="post-tags">
                {post.postTags.map((tag, index) => (
                  <span key={index} className="type-badge">{tag}</span>
                ))}
              </div>
            )}
            
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

          <div className="control-right">
            
            {/* Like Button */}
            {isStudentUser ? (
              // Student view: Like button + like count
              <div className="like-section d-flex align-items-center gap-2">
                <span>{likeCount} like{likeCount === 1 ? '' : 's'}</span>
                <button
                  className={`btn btn-sm ${liked ? 'btn-danger' : 'btn-outline-primary'}`}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (!user) return;

                    if (liked) {
                      await unlikePost(user.uid, post.id);
                      setLiked(false);
                      setLikeCount(prev => prev - 1);
                    } else {
                      await likePost(user.uid, post.id);
                      setLiked(true);
                      setLikeCount(prev => prev + 1);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                </button>
              </div>
            ) : (
              // Non-student view: just the count
              <div className="like-section d-flex align-items-center gap-2">
                <span>{likeCount} like{likeCount === 1 ? '' : 's'}</span>
              </div>
            )}
          </div>
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