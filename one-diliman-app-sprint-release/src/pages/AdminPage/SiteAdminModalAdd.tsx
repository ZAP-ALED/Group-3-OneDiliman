import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { doCreateSiteAdminWithEmailAndPassword } from "../../firebase/auth";
import "./SiteAdminModalAdd.css"

const SiteAdminModalAdd = () => {
  const [formData, setFormData] = useState({
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    adminPassword: "",
  });

  console.log(formData);

  async function handleSubmit(e: any) {
    console.log("formData.adminEmail, formData.adminPassword");
    e.preventDefault();
    const form = e.target;

    await doCreateSiteAdminWithEmailAndPassword(formData);

    alert("Admin is now authenticated");
  }

  const handleChange = (event: any) => {
    const value = event.target.value;
    const id = event.target.id;

    console.log(`id: ${id}, value: ${value}`)

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  return (
    <>
        <Form onSubmit={handleSubmit} id="org-form">
      <div className="modal-body">
            <FloatingLabel
              controlId="adminFirstName"
              label="First Name"
              className="mb-3"
            >
              <Form.Control
                placeholder="First Name"
                onChange={handleChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="adminLastName"
              label="Last Name"
              className="mb-3"
            >
              <Form.Control
                placeholder="Last Name"
                onChange={handleChange}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="adminEmail"
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
              controlId="adminPassword"
              label="Password"
              className="mb-3"
            >
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </FloatingLabel>
      </div>
      <div className="modal-footer">
        <Button className="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </Button>
        <Button className="btn btn-primary" type="submit" onClick={() => console.log(formData)}>
          Submit
        </Button>
      </div>
        </Form>
    </>
  );
};

export default SiteAdminModalAdd;
