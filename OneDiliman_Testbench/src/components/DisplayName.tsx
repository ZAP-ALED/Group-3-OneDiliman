import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../FirebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function DisplayName(){
    // displaying current user's name: https://www.youtube.com/watch?v=qWy9ylc3f9U
    // https://stackoverflow.com/questions/38352772/is-there-any-way-to-get-firebase-auth-user-uid
    // https://firebase.google.com/docs/auth/web/manage-users#get_the_currently_signed-in_user

    const [name, setName] = useState("Loading...");
    useEffect(() => {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                if (auth.currentUser?.isAnonymous) {
                    console.log("Guest")
                    setName("Guest")
                } else {
                    const uid = user.uid;
                    console.log(uid);

                    const db = getFirestore(app);
                    getDoc(doc(db, "users", uid)).then(docSnap => {
                        if (docSnap.exists()) {
                            setName(`${docSnap.data().firstName} ${docSnap.data().lastName} - ${docSnap.data().role}`)
                        }
                    });
                }
            } else {
                setName("Loading...")
            }
        })
      }, [name]);

    return <div>{name}</div>
}