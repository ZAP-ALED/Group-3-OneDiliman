import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import './Dashboard.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { followOrganization, unfollowOrganization, isFollowingOrganization } from '../../firebase/auth';

export default function OrgCard({ org, toggleFollowed, role}) {
  const [uid, setUid] = useState("-1");
  const [isFollowed, setIsFollowed] = useState(false); // Default to false initially

  useEffect(() => {
    const auth = getAuth();

    // Check if the user is authenticated
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!auth.currentUser?.isAnonymous) {
          setUid(user.uid);

          // Check if the user is following the organization
          const following = await isFollowingOrganization(user.uid, org.orgId);
          setIsFollowed(following); // Update the state based on the backend
        }
      } else {
        setUid("-1");
      }
    });
  }, [org.orgId]);

  const handleFollowClick = async () => {
    try {
      if (isFollowed) {
        // Unfollow the organization
        await unfollowOrganization(uid, org.orgId);
        setIsFollowed(false); // Update local state
        toggleFollowed(org.orgId, false); // Notify the Sidebar
      } else {
        // Follow the organization
        await followOrganization(uid, org.orgId);
        setIsFollowed(true); // Update local state
        toggleFollowed(org.orgId, true); // Notify the Sidebar
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const orgId = org.orgId;
  const orgName = org.orgName;
  const orgBio = org.orgBio.substring(0, 200); // Limit bio to 200 characters
  const orgBanner = org?.orgLogo || '';
  const orgTags = org.orgTags;
  const orgAcro = org.orgAcronym === "" ? "" : `(${org.orgAcronym})`;

  return (
    <div className="h-100">
      <div className="card org-card">
        {/* Follow/Unfollow Icon */}
        <div className="follow-icon">
          
          {role !== "Org admin" && (
          <button
            type="button"
            className={`btn follow-button ${isFollowed ? 'followed' : 'not-followed'}`}
            onClick={handleFollowClick}
          >
            <FontAwesomeIcon
              icon={isFollowed ? solidHeart : regularHeart}
              className="heart-icon"
            />
          </button>
          )}
        </div>

        <Link to={`/dashboard/${orgId}`} className="card-link" data-testid={`org-card-${orgId}`}>
          <img src={orgBanner} className="org-img" alt="..." />
          <div className="card-body" style={{ height: '180px', overflow: 'hidden' }}>
            <h5 className="card-title">{orgName} {orgAcro}</h5>
            <p className="card-text" data-testid={`org-bio-${orgId}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{orgBio}</p>
          </div>
          <div className="card-footer" style={{ height: '75px', overflow: 'hidden' }}>
            {orgTags.map((tag, index) => {
              let className = 'org-tags';
              if (tag === 'non-sectarian') {
                className += ' org-tags-non-sectarian';
              } else if (tag === 'academic') {
                className += ' org-tags-academic';
              } else if (tag === 'socio-academic') {
                className += ' org-tags-socio-academic';
              } else if (tag === 'game-development') {
                className += ' org-tags-socio-academic';
              } else if (tag === 'computer science') {
                className += ' org-tags-computer-science';
              } else if (tag === 'non-profit') {
                className += ' org-tags-non-profit';
              } else if (tag === 'game development' || tag === 'gaming') {
                className += ' org-tags-gaming';
              } else {
                className += ' org-tags-default';
              }
              return (
                <div className={className} key={index}>
                  {tag}
                </div>
              );
            })}
          </div>
        </Link>
      </div>
    </div>
  );
}
