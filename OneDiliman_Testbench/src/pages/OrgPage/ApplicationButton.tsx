import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { updateAvailabilityOrg, updateApplicationFormUrl } from '../../components/FirebaseConnection';
import './ApplicationButton.css';

interface ApplicationButtonDeets {
  orgId: string;
  isOpen: boolean;
  formUrl: string;
  orgName: string;
  isAdmin: boolean;
}

const ApplicationButton: React.FC<ApplicationButtonDeets> = ({ 
  orgId, 
  isOpen, 
  formUrl, 
  orgName, 
  isAdmin 
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [localFormUrl, setLocalFormUrl] = useState(formUrl || '');
  const [applicationStatus, setApplicationStatus] = useState(isOpen);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleButtonClick = () => {
    if (isAdmin) {
      setShowEditModal(true);
    } else {
      if (isOpen && formUrl) {
        window.open(formUrl, '_blank');
      } else {
        setShowErrorModal(true);
      }
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateAvailabilityOrg(orgId, applicationStatus);
      
      await updateApplicationFormUrl(orgId, localFormUrl);
      
      setShowEditModal(false);
      
      alert('Application settings updated successfully!');
    } catch (error) {
      console.error('Error updating application settings:', error);
      alert('Failed to update application settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const buttonText = isAdmin 
    ? (isOpen ? "Applications Open" : "Applications Closed") 
    : "Apply Now";
  
  const buttonIcon = isAdmin 
    ? <FontAwesomeIcon icon={faPen} className="ms-2" />
    : <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2" />;

  const buttonClass = isAdmin 
    ? "btn btn-admin-application" 
    : "btn btn-apply-now";

  return (
    <div className="application-button-container">
      <button 
        className={buttonClass}
        onClick={handleButtonClick}
      >
        {buttonText}
        {buttonIcon}
      </button>

      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Application Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Application Status</label>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                id="flexSwitchCheckChecked" 
                checked={applicationStatus} 
                onChange={() => setApplicationStatus(!applicationStatus)} 
              />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                {applicationStatus ? "Applications are Open" : "Applications are Closed"}
              </label>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Application Form URL</label>
            <input 
              type="url" 
              className="form-control" 
              value={localFormUrl}
              onChange={(e) => setLocalFormUrl(e.target.value)}
            />
            <small className="form-text text-muted">
              Add the URL to your external application form.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowEditModal(false)}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal 
        show={showErrorModal} 
        onHide={() => setShowErrorModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{!formUrl ? "Application Form Unavailable" : "Applications Closed"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <div className="application-closed-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <h4 className="mt-3">Sorry!</h4>
            {!formUrl ? (
              <p>
                {orgName} has not provided an application form yet. Please contact the organization directly for more information on how to apply.
              </p>
            ) : (
              <p>
                {orgName} is not accepting applications at this time. Please check back later or contact the organization directly for more information.
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowErrorModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplicationButton;