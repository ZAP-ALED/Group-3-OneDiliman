import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { editOrgDescription, editOrgBio, editOrgAbout, editOrgTags, editOrgPictures, editOrgLogo, fetchOrgData, updateAvailabilityOrg } from "../../components/FirebaseConnection";
import TagsInput from '../../components/TagsInput/TagsInput';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

export default function EditOrgModalContent({ handleClose }) {
  const params = useParams();

  const [orgs, setOrgs] = useState({});
  const [orgPic, setOrgPic] = useState('');
  const [updatedTags, setUpdatedTags] = useState([]);

  const [orgDesc, setOrgDesc] = useState("");
  const [orgBio, setOrgBio] = useState("");

  const [orgPicLink1, setOrgPicLink1] = useState("");
  const [orgPicLink2, setOrgPicLink2] = useState("");
  const [orgPicLink3, setOrgPicLink3] = useState("");
  const [orgLogo, setOrgLogo] = useState("");

  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (orgs && orgs.orgDescription) {
        setOrgDesc(orgs.orgDescription);
    }
  }, [orgs]);

  useEffect(() => {
    if (orgs && orgs.orgBio) {
        setOrgBio(orgs.orgBio);
    }
  }, [orgs]);

  useEffect(() => {
    if (orgs && orgs.orgLogo) {
      setOrgLogo(orgs.orgLogo);
    }
  }, [orgs]);

  useEffect(() => {
    if (orgs && orgs.orgPictures) {
        if (orgs.orgPictures.length > 0) setOrgPicLink1(orgs.orgPictures[0]);
        if (orgs.orgPictures.length > 1) setOrgPicLink2(orgs.orgPictures[1]);
        if (orgs.orgPictures.length > 2) setOrgPicLink3(orgs.orgPictures[2]);
    }
  }, [orgs]);

  useEffect(() => {
    if (orgs && orgs.openForApplications) {
      setAvailable(orgs.openForApplications === "Open");
    }
  }, [orgs]);

  // --------- promises for checking edit success --------------
  function editOrgDescriptionWithPromise(orgId, newDescription) {
    return new Promise((resolve, reject) => {
      editOrgDescription(orgId, newDescription)
        .then(() => {
          resolve('Org description has been updated.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function editOrgBioWithPromise(orgId, newBio) {
    return new Promise((resolve, reject) => {
      editOrgBio(orgId, newBio)
        .then(() => {
          resolve('Short bio has been updated.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  function editOrgAboutWithPromise(orgId, dateFounded, orgLocation, orgEmails, orgWebsite, orgFacebook, orgAffiliations) {
    return new Promise((resolve, reject) => {
      editOrgAbout(orgId, dateFounded, orgLocation, orgEmails, orgWebsite, orgFacebook, orgAffiliations)
        .then(() => {
          resolve('About info has been updated.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  function editOrgTagsWithPromise(orgId, updatedTags) {
    return new Promise((resolve, reject) => {
      editOrgTags(orgId, updatedTags)
        .then(() => {
          resolve('Org tags have been updated.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  function editOrgPicturesWithPromise(orgId, picLink1, picLink2, picLink3) {
    return new Promise((resolve, reject) => {
      editOrgPictures(orgId, picLink1, picLink2, picLink3)
        .then(() => {
          resolve('Org pictures have been updated.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }  

  function editOrgLogoWithPromise(orgId, orgLogo) {
    return new Promise((resolve, reject) => {
      editOrgLogo(orgId, orgLogo)
        .then(() => {
          resolve('Org logo has been updated.');
        })
        .catch(error => {
          reject(error);
        });
    });
  }  
  // --------------------------------------------------------
  
  // --------- functions for saving changes to database --------------
  function setCheckAvailable(id) {
    const newAvailable = !available;
    updateAvailabilityOrg(id, newAvailable);
    setAvailable(newAvailable);
    toast.success(`Successfully ${newAvailable ? 'OPENED' : 'CLOSED'} applications.`);
  }

  function handleChangeDesc() {
    editOrgDescriptionWithPromise(orgs.id, orgDesc)
      .then(message => {
        toast.success(message);
      })
      .catch(error => {
        toast.error('Failed to update org description: ' + error.message);
      });
  }

  function handleChangeBio() {
    editOrgBioWithPromise(orgs.id, orgBio)
      .then(message => {
        toast.success(message);
      })
      .catch(error => {
        toast.error('Failed to update short bio: ' + error.message);
      });
  }
  
  function handleChangeAbout() {
    editOrgAboutWithPromise(orgs.id, orgs.dateFounded, orgs.orgLocation, orgs.orgEmails, orgs.orgWebsite, orgs.orgFacebook, orgs.orgAffiliations)
      .then(message => {
        toast.success(message);
      })
      .catch(error => {
        toast.error('Failed to update about info: ' + error.message);
      });
  }
  
  // helper function for saving tags
  function handleChangeTags(tags) {
    setUpdatedTags(tags);
  }

  function handleSaveTags() {
    editOrgTagsWithPromise(orgs.id, updatedTags)
      .then(message => {
        toast.success(message);
      })
      .catch(error => {
        toast.error('Failed to update org tags: ' + error.message);
      });
  }

  function handleChangePics() {
    editOrgPicturesWithPromise(orgs.id, orgPicLink1, orgPicLink2, orgPicLink3)
      .then(message => {
        toast.success(message);
      })
      .catch(error => {
        toast.error('Failed to update org pictures: ' + error.message);
      });
  }

  function handleChangeLogo() {
    editOrgLogoWithPromise(orgs.id, orgLogo)
      .then(message => {
        toast.success(message);
      })
      .catch(error => {
        toast.error('Failed to update org logo: ' + error.message);
      });
  }
  // --------------------------------------------------------

  useEffect(() => {
    setOrgs({}); // Clear existing data before fetching new data
    fetchOrgData()
      .then(data => {
        const newData = data.map(item => ({ ...item, starred: false }));
        
        // Find the organization with the same ID as params
        const orgWithParamsId = newData.find(org => org.orgId === params.orgId);
  
        // Update state with the organization matching the ID
        if (orgWithParamsId) {
          setOrgs(orgWithParamsId);
          if (orgWithParamsId.orgPictures && orgWithParamsId.orgPictures.length > 0) {
            setOrgPic(orgWithParamsId.orgPictures[0]);
          }
        } else {
          console.log("Organization not found with the given ID");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [params.orgId]); // Dependency array including params.orgId to re-run the effect when params.orgId changes

  return (
    <div className="container-md">
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

          <div id="myCarousel" className="carousel slide mb-6 rounded-3 position-relative" data-bs-ride="carousel">
            <div className="carousel-inner carousel-edit rounded-3">
              <div className="carousel-item carousel-item-edit active">
                <div className="carousel-image rounded-3 position-relative" style={{ 
                  backgroundImage: orgPic ? `url(\"${orgPic}` + '.jpg\")' : '',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  width: '100%',
                  height: '100%'
                }}>
                  <div className="dark-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                </div>
              </div>
            </div>
          
          <button type="button" className="btn img-edit-button position-absolute top-50 start-50 translate-middle" data-bs-toggle="modal" data-bs-target="#bannerModal"> Edit Banner Images </button>
            <div className="modal fade" id="bannerModal" tabIndex="-1" aria-labelledby="bannerModalLabel" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel"> Edit Banner Images </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div className="form-floating mb-2 mt-2">
                      <input type="url" className="form-control" id="floatingBanner1" placeholder="https://example.com" value={orgPicLink1} onChange={e => setOrgPicLink1(e.target.value)} />
                      <label htmlFor="floatingBanner1"> Imgur Link 1 </label>
                    </div>
                    <div className="form-floating mb-2">
                      <input type="url" className="form-control" id="floatingBanner2" placeholder="https://example.com" value={orgPicLink2} onChange={e => setOrgPicLink2(e.target.value)}/>
                      <label htmlFor="floatingBanner2"> Imgur Link 2 </label>
                    </div>
                    <div className="form-floating mb-2">
                      <input type="url" className="form-control" id="floatingBanner3" placeholder="https://example.com" value={orgPicLink3} onChange={e => setOrgPicLink3(e.target.value)}/>
                      <label htmlFor="floatingBanner3"> Imgur Link 3 </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-dark org-options-button-secondary" data-bs-dismiss="modal"> Close </button>
                    <button type="button" className="btn btn-outline-dark org-options-button" onClick={handleChangePics}> Save Changes </button>
                  </div>
                </div>
              </div>
            </div>
        </div>

        <div className="org-header-box">
          <div className="row">
          <div className="col-md-auto">
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <img src={orgs.orgLogo + ".jpg"} className="edit-logo-img" alt="..." />
              <button className='camera-button' data-bs-toggle="modal" data-bs-target="#pfpModal"><FontAwesomeIcon icon={faCamera}/></button>
              <div className="modal fade" id="pfpModal" tabIndex="-1" aria-labelledby="pfpModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel"> Edit Logo Image </h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-floating mb-2 mt-2">
                        <input type="url" className="form-control" id="floatingBanner1" placeholder="https://example.com" value={orgLogo} onChange={e => setOrgLogo(e.target.value)} />
                        <label htmlFor="floatingBanner1"> Imgur Link </label>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-outline-dark org-options-button-secondary" data-bs-dismiss="modal"> Close </button>
                      <button type="button" className="btn btn-outline-dark org-options-button" onClick={handleChangeLogo}> Save Changes </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            <div className="col-8 org-header-text">
              <h4 className="font-inter custom-grey">{orgs.orgName} ({orgs.orgAcronym})</h4>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center" style={{ marginTop: "-45px" }}>
          <h5 className='mt-4'> Tags </h5>
          <span className="save-changes-text" style={{ cursor: 'pointer', color: '#005538', textDecoration: 'underline', marginTop: '20px' }}
          onClick={handleSaveTags}> Save Changes </span>
        </div>
        <div className="col-md px-4">
        <TagsInput onChange={handleChangeTags}  tags={orgs.orgTags}/>
        </div>

        <h5 className='mt-4'> Application Details </h5>
        <div className="col-md px-4">
          <div className="form-check form-switch">
            <input 
              className="form-check-input" 
              type="checkbox" 
              role="switch" 
              id="flexSwitchCheckChecked" 
              checked={available} 
              onChange={() => setCheckAvailable(orgs.id)} 
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
              {available ? "Applications are Open" : "Applications are Closed"}
            </label>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <h5 className='mt-4'> About </h5>
          <span className="save-changes-text" style={{ cursor: 'pointer', color: '#005538', textDecoration: 'underline', marginTop: '20px' }}
          onClick={handleChangeAbout}> Save Changes </span>
        </div>
        <div className="col-md px-4">
          <div className="form-floating mb-2 mt-3">
            <input type="date" className="form-control" id="floatingDateFounded" value={orgs.dateFounded} onChange={(e) => setOrgs({ ...orgs, dateFounded: e.target.value })} />
            <label htmlFor="floatingDateFounded"> Date Founded </label>
          </div>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" id="floatingLocation" placeholder="UP Diliman" value={orgs.orgLocation} onChange={(e) => setOrgs({ ...orgs, orgLocation: e.target.value })} />
            <label htmlFor="floatingLocation"> Org Location </label>
          </div>
          <div className="form-floating mb-2">
            <input type="email" className="form-control" id="floatingEmail" placeholder="email@example.com" value={orgs.orgEmails} onChange={(e) => setOrgs({ ...orgs, orgEmails: e.target.value })} />
            <label htmlFor="floatingEmail"> Org Email </label>
          </div>
          <div className="form-floating mb-2">
            <input type="url" className="form-control" id="floatingWebsite" placeholder="https://example.com" value={orgs.orgWebsite} onChange={(e) => setOrgs({ ...orgs, orgWebsite: e.target.value })} />
            <label htmlFor="floatingWebsite"> Org Website </label>
          </div>
          <div className="form-floating mb-2">
            <input type="url" className="form-control" id="floatingFB" placeholder="https://example.com" value={orgs.orgFacebook} onChange={(e) => setOrgs({ ...orgs, orgFacebook: e.target.value })} />
            <label htmlFor="floatingFB"> Facebook Page </label>
          </div>
          <div className="form-floating mb-4">
            <input type="text" className="form-control" id="floatingAffiliations" placeholder="https://example.com" value={orgs.orgAffiliations} onChange={(e) => setOrgs({ ...orgs, orgAffiliations: e.target.value })} />
            <label htmlFor="floatingAffiliations"> Affiliations </label>
          </div>
        </div>


        <div className="d-flex justify-content-between align-items-center">
          <h5 className='mt-4'> Description </h5>
          <span className="save-changes-text" style={{ cursor: 'pointer', color: '#005538', textDecoration: 'underline', marginTop: '20px' }}
          onClick={handleChangeDesc}> Save Changes </span>
        </div>
        <div className="col-md px-4">
        <div className="form-group">
          <textarea className="form-control" 
            placeholder="Describe your organization here!" 
            id="floatingTextarea2" style={{ height: 300 }} 
            value={orgDesc}
            onChange={e => setOrgDesc(e.target.value)}></textarea>
        </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <h5 className='mt-4'> Short Bio </h5>
          <span className="save-changes-text" style={{ cursor: 'pointer', color: '#005538', textDecoration: 'underline', marginTop: '20px' }}
          onClick={handleChangeBio}> Save Changes </span>
        </div>
        <div className="col-md px-4">
        <div className="form-group">
          <textarea className="form-control" 
            placeholder="Describe your organization here!" 
            id="floatingTextarea2" style={{ height: 100 }} 
            value={orgBio}
            onChange={e => setOrgBio(e.target.value)}></textarea>
        </div>
        </div>

    </div>
  );
}