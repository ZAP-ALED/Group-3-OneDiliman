import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import checkmark from './checkmark.png';
import { updateUserAspiringApplication } from '../../components/FirebaseConnection';

export default function OrgApplicationModal({ org, setHasUserApplied,handleCloseApplication, orgId, uid }) {


const [showAppForm, setShowAppForm] = useState(false);
const [showAppConfirmation, setShowAppConfirmation] = useState(false);


const handleshowAppForm = () => {
    setShowAppForm(true);
}
const handleshowAppConfirmation = () => {
    handlecloseAppForm();
    setShowAppConfirmation(true);
}

const handlecloseAppForm = () => setShowAppForm(false);
const handlecloseAppConfirmation = () => {
  updateUserAspiringApplication(uid, orgId);
  // setHasUserApplied(true);
  handleCloseApplication();
}

  return (
    <>
        <div className='application-text'> 
            To tag you as an <div style={{color: '#8D0202', display:'inline'}}>Aspiring Applicant </div> for {org.orgAcronym}, your name, UP Mail, and Student Number will be shared with {org.orgAcronym}. 
        </div>
        <button type="button" className="btn btn-accept" onClick={handleshowAppForm}>Accept</button>
        <button type="button" className="btn btn-reject" onClick={handleCloseApplication}>Reject</button>


        
      <Modal
        show={showAppForm}
        onHide={handlecloseAppForm}
        centered
        style={{ marginLeft: '-8px' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='application-text'> 
            Please make sure to answer the form/s below before proceeding as requirements for application in this org. <br></br><br></br>
            Applicants’ Orientation Registration: <a href='https://bit.ly/GDSCApplication2324A'> https://bit.ly/GDSCApplication2324A</a> <br></br><br></br>
            Application Confirmation Form 2324A: <a href='https://bit.ly/GDSCApplication2324A'> https://bit.ly/GDSCApplication2324A </a>
            </div>
            <button type="button" className="btn btn-answered" onClick={handleshowAppConfirmation}>I have answered the forms.</button>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAppConfirmation}
        onHide={handlecloseAppConfirmation}
        centered
        style={{ marginLeft: '-8px' }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <img className='checkmark' src={checkmark} />
            <br></br>
            <div className='application-text'> 
                We’ve let {org.orgAcronym} know you want to apply!
                Please wait till after October 12, 2024 for them to confirm your application.
            </div>
            <button type="button" className="btn btn-back-to-org" onClick={handlecloseAppConfirmation}>Back to Org Page.</button>
        </Modal.Body>
      </Modal>
    </>
  )
}
