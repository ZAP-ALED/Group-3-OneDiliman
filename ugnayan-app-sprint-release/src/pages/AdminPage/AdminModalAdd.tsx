import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { doCreateOrgWithEmailAndPassword } from "../../firebase/auth";
import toast, { Toaster } from 'react-hot-toast';
import "./AdminModalAdd.css"

const AdminModalAdd = () => {
  const [error, setError] = useState({
    orgName: false,
    orgConnectedEmail: false,
    orgPassword: false,
    orgLogo: false,
    orgAcronym: false,
    orgPictures: false,
    orgBio: false,
    orgTags: false,
    dateFounded: false,
    orgLocation: false,
    orgAffiliations: false,
    orgEmails: false,
    orgFacebook: false,
    orgWebsite: false,
    orgDescription: false,
    orgScope: false,
    openForApplications: false,
  });
  const [showErrorText, setShowErrorText] = useState({
    orgName: false,
    orgConnectedEmail: false,
    orgPassword: false,
    orgLogo: false,
    orgAcronym: false,
    orgPictures: false,
    orgBio: false,
    orgTags: false,
    dateFounded: false,
    orgLocation: false,
    orgAffiliations: false,
    orgEmails: false,
    orgFacebook: false,
    orgWebsite: false,
    orgDescription: false,
    orgScope: false,
    openForApplications: false,
  });
  const [formData, setFormData] = useState({
    orgName: "",
    orgConnectedEmail: "",
    orgPassword: "",
    orgLogo: "",
    orgAcronym: "",
    orgPictures: [],
    orgBio: "",
    orgTags: [],
    dateFounded: "",
    orgLocation: "",
    orgAffiliations: [],
    orgEmails: [],
    orgFacebook: "",
    orgWebsite: "",
    orgDescription: "",
    orgScope: "",
    openForApplications: false,
  });

  // --------- promises for checking edit success --------------

  function createOrgWithPromise(formData) {
    return new Promise((resolve, reject) => {
      doCreateOrgWithEmailAndPassword(formData)
        .then(() => {
          resolve('Organization is now authenticated.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // --------- functions for saving changes to database --------------

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    createOrgWithPromise(formData)
      .then(message => {
        toast.success(message);
      })
      .catch(error => {
        toast.error('Failed to authenticate organization: ' + error.message);
      });
  }

  const handleChange = (event: any) => {
    const value = event.target.value;
    const id = event.target.id;

    console.log(`ID: ${id}; Value: ${value}`);

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  // -----------------------

  return (
    <>
      <div className="modal-body">
        <Toaster
          toastOptions={{
            success: {
              style: {
                border: '1px solid #005538',
                color: '#005538',
              },
              iconTheme: {
                primary: '#005538',
                secondary: '#FFFAEE',
              },
            },
          }}
        />

        <Form onSubmit={handleSubmit} id="org-form">
          <div className="add-modal-body">
            <div>
              <FloatingLabel
                controlId="orgConnectedEmail"
                label="Email address"
                className="mb-3"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgPassword"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgName"
                label="Organization Name"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Organization Name"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgLogo"
                label="Organization Logo"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Organization Logo (imgur link)"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgAcronym"
                label="Organization Acronym"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Organization Acronym"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgPictures"
                label="Organization Picture"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Organization Picture (imgur link, separate by comma)"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgBio"
                label="Organization Bio"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Insert bio here"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgTags"
                label="Organization Tags"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Insert tags here separated by comma"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="dateFounded"
                label="Organization Date Founded"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Organization Date Founded"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgLocation"
                label="Organization Location"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Organization Location"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgAffiliations"
                label="Organization Affiliations"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Insert org affiliations, separated by comma"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgEmails"
                label="Organization Emails"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Insert org emails, separated by comma"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgFacebook"
                label="Organization Facebook"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Insert org facebook link"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgWebsite"
                label="Organization Website"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Insert org website"
                  onChange={handleChange}
                />
              </FloatingLabel>

              <FloatingLabel
                controlId="orgScope"
                label="Organization Scope"
                className="mb-3"
              >
                <Form.Control
                  placeholder="Insert org scope"
                  onChange={handleChange}
                />
              </FloatingLabel>
            </div>
            <div>
              <FloatingLabel
                controlId="orgDescription"
                className="mb-3 add-modal-description"
                label="Description"
              >
                <Form.Control
                  placeholder="Description"
                  onChange={handleChange}
                  style={{ height: "50vh" }}
                />
              </FloatingLabel>
            </div>
          </div>
        </Form>
      </div>
      <div className="modal-footer">
        <Button className="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </Button>
        <Button form="org-form" className="btn btn-primary" type="submit"  data-bs-dismiss="modal">
          Submit
        </Button>
      </div>
    </>
  );
};

export default AdminModalAdd;
