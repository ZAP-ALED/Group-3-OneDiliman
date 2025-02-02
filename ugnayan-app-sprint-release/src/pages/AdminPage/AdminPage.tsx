import Navbar from "../../components/Navbar/Navbar";
import "./AdminPage.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../../FirebaseConfig";
import AdminTable from "./AdminTable";
import AdminHeader from "./AdminHeader";
import Plus from "./icons/Plus";
import AdminNavigation from "./AdminNavigation";
import RingLoader from "react-spinners/RingLoader";
import AdminModal from "./AdminModal";
import SiteAdminModal from "./SiteAdminModal";

export default function AdminPage() {
  const { view } = useParams();

  const [isUserASiteAdmin, setIsUserASiteAdmin] = useState(false);
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (auth.currentUser?.isAnonymous) {
          setIsUserASiteAdmin(false);
        } else {
          const uid = user.uid;
          console.log(uid);

          const db = getFirestore(app);
          getDoc(doc(db, "users", uid)).then((docSnap) => {
            if (docSnap.exists()) {
              setIsUserASiteAdmin(docSnap.data().role === "Site Admin");
            }
          });
        }
      } else {
        setIsUserASiteAdmin(false);
      }
    });
  }, [isUserASiteAdmin]);

  return (
    <div>
      <Navbar currentPage={"dashboard"}></Navbar>
      {isUserASiteAdmin && (
        <>
          <AdminHeader />
          <div className="container">
          <div className="row justify-content-between align-items-end">
              <AdminNavigation view={view} />
              <div className="col-auto">
                <div className="btn-group" role="group" aria-label="Add buttons">
                    {(view === "site-admins") ? 
                    <button
                        type="button"
                        className="btn add-org"
                        data-bs-toggle="modal"
                        data-bs-target="#staticAdminBackdropAdd"
                        onClick={() => console.log("#staticAdminBackdropAdd")}
                    >
                        <Plus /> Add Site Administrator
                    </button> : (view === "org-admins" || view === "organizations") ?
                    <button
                        type="button"
                        className="btn add-org"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdropAdd"
                    >
                        <Plus /> Add Organization
                    </button> :
                    <div></div>
                    }
                  </div>
              </div>
          </div>

            <AdminModal modalType="Add" view={view} />
            <SiteAdminModal modalType="Add" view={view} />
            <div className="row">
              <div className="col table-container">
                <AdminTable view={view} />
              </div>
            </div>
          </div>
        </>
      )}

      {!isUserASiteAdmin && (
        <div className="sweet-loading">
          <RingLoader
            color={"#8D021F"}
            loading={true}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )}
    </div>
  );
}
