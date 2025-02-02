import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './Dashboard.css';
import { updateUserBookmark } from "../../components/FirebaseConnection";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function OrgCard({ org, toggleStarred }) {
  const [uid, setUid] = useState("-1");

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (auth.currentUser?.isAnonymous) {

            } else {
                setUid(user.uid);
            }
        } else {
            setUid("-1");
        }
    })
  }, [uid]);

  const handleStarClick = () => {
    toggleStarred(org.orgId);
    if (uid !== "-1") {
      updateUserBookmark(uid, org.id);
    }
  };

  const orgId = org.orgId;
  const orgName = org.orgName;
  const orgBio = org.orgBio.substring(0, 200); // Limit bio to 200 characters
  const orgPicture = org.orgPictures[0] + ".jpg";
  const orgTags = org.orgTags;

  return (
    <div className="h-100">
      <div className="card org-card">
        <div className='favorites-button'>
          <button
            type="button"
            className="btn star-button"
            onClick={handleStarClick}
          >
            {org.starred ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="orange" className="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z" />
              </svg>
            )}
          </button>
        </div>
        <Link to={`/dashboard/${orgId}`} className='card-link'>
          <img src={orgPicture} className="org-img" alt="..." />
          <div className="card-body" style={{ height: '180px', overflow: 'hidden' }}> {/* Limit card body height */}
            <h5 className="card-title">{orgName} ({org.orgAcronym})</h5>
            <p className="card-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{orgBio}</p> {/* Apply ellipsis to overflowed text */}
          </div>
          <div className="card-footer" style={{ height: '75px', overflow: 'hidden' }}> {/* Limit footer height */}
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
                  <div className={className}>
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
