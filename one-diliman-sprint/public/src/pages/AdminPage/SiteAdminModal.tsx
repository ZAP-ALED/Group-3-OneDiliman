import SiteAdminModalAdd from "./SiteAdminModalAdd";
//import SiteAdminModalEdit from "./SiteAdminModalEdit";

interface modalProps {
  modalType: "Add" | "Edit";
  view?: string;
  orgId?: string;
  orgName?: string;
  orgDescription?: string;
}

const SiteAdminModal = ({ modalType, view, orgId, orgName, orgDescription }: modalProps) => {
  return (
    <div
      className="modal fade"
      id={`staticAdminBackdrop${modalType}${modalType === "Add" ? "" : orgId}`}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1
              className="modal-title fs-5"
              id="staticBackdropLabel"
            >{`${modalType} ${
              view === "organizations" ? "Organization" : "User"
            }`}</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          {modalType === "Edit" ? (
            <div>hi ^_^</div>
            //<AdminModalEdit orgId={orgId} orgDescription={orgDescription} orgName={orgName}/>
          ) : (
            <SiteAdminModalAdd />
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteAdminModal;
