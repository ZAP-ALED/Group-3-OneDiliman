import AdminModalAdd from "./AdminModalAdd";
import AdminModalEdit from "./AdminModalEdit";

interface modalProps {
  modalType: "Add" | "Edit";
  view?: string;
  userId?: string;
  userName?: string;
  orgId?: string;
  orgName?: string;
  orgDescription?: string;
  orgEmail?: string;
}
const AdminModal = ({
  modalType,
  view,
  userId,
  userName,
  orgId,
  orgName,
  orgDescription,
  orgEmail,
}: modalProps) => {
  return (
    <div
      className="modal fade"
      id={`staticBackdrop${modalType}${
        modalType === "Add" ? "" : typeof orgId === "string" ? orgId : userId
      }`}
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">
              {`${modalType} ${
                view === "organizations" || modalType === "Add"
                  ? "Organization"
                  : "User"
              }`}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          {modalType === "Edit" ? (
            <AdminModalEdit
              id={typeof orgId === "string" ? orgId : userId}
              name={typeof orgName === "string" ? orgName : userName}
              view={view}
              orgEmail={orgEmail}
              orgDescription={orgDescription}
            />
          ) : (
            <AdminModalAdd />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
