// Authentication Process: https://www.youtube.com/watch?v=WpIDez53SK4

import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword } from "firebase/auth";
import { app, auth } from "../FirebaseConfig";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";

// adding custom data in profile: https://www.youtube.com/watch?v=qWy9ylc3f9U
export const doCreateUserWithEmailAndPassword = async (formData: any) => {
    return createUserWithEmailAndPassword(auth, formData.email, formData.password).then(async (cred: any) =>  {
        const db = getFirestore(app);
        const userRef = doc(db, "users", cred.user.uid);

        await setDoc(userRef, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                studentId: formData.studentNo,
                role: "User",
                course: formData.course,
                email: formData.email,
                appliedOrgs: {},
                aspiringAppliedOrgs: {},
                memberOrgs: {},
                orgBookmarks: {},
            });
    });
};

export const doCreateSiteAdminWithEmailAndPassword = async (formData: any) => {
    return createUserWithEmailAndPassword(auth, formData.adminEmail, formData.adminPassword).then(async (cred: any) =>  {
        const db = getFirestore(app);
        const userRef = doc(db, "users", cred.user.uid);

        await setDoc(userRef, {
                firstName: formData.adminFirstName,
                lastName: formData.adminLastName,
                role: "Site Admin",
                email: formData.adminEmail
            });
    });
};

export const doSignInWithEmailAndPassword = (formData: any) => {
    return signInWithEmailAndPassword(auth, formData.email, formData.password)
};

export const doSignInAsGuest = () => {
    return signInAnonymously(auth);
};

export const doSignOut = () => {
    return auth.signOut();
}

export const doCreateOrgWithEmailAndPassword = async (formData: any) => {
    return createUserWithEmailAndPassword(auth, formData.orgConnectedEmail, formData.orgPassword).then(async (cred: any) =>  {
        const db = getFirestore(app);
        const orgRef = doc(db, "organizations", cred.user.uid);

        await setDoc(orgRef, {
                orgConnectedEmail: formData.orgConnectedEmail,
                orgId: formData.orgName.replace(/\s/g, '_'), // https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
                orgLogo: formData.orgLogo,
                orgName: formData.orgName,
                orgAcronym: formData.orgAcronym,
                orgPictures: formData.orgPictures !== "" ? formData.orgPictures.toString().split(",") : ["https://imgur.com/E6u04LW"],
                orgBio: formData.orgBio,
                // orgTags: formData.orgTags !== "" ? formData.orgTags.split(",").toString().split(",") : [],
                orgTags: formData.orgTags !== "" ? formData.orgTags.toString().split(",").toString().split(",") : [],


                dateFounded: formData.dateFounded,
                orgLocation: formData.orgLocation,
                orgAffiliations: formData.orgAffiliations !== "" ? formData.orgAffiliations.toString().split(",") : [],
                orgEmails: formData.orgEmails !== "" ? formData.orgEmails.toString().split(",") : [],
                orgFacebook: formData.orgFacebook,
                orgWebsite: formData.orgWebsite,
                orgDescription: formData.orgDescription,
                orgScope: formData.orgScope,
                openForApplications: formData.openForApplications,
                members: {},
                applicants: {},
                aspiringApplicants: {},
            });

        const userRef = doc(db, "organization-admins", cred.user.uid);
        await setDoc(userRef, {
            orgName: formData.orgName,
            orgConnectedEmail: formData.orgConnectedEmail
        });
    });
}

 /* Create Post */ 
export const doCreatePost = async (formData: any) => {
    const db = getFirestore(app);
    const postRef = doc(collection(db, "posts"));

    await setDoc(postRef, {
        postId: formData.postId,                  // ID of the post
        postOwner: formData.postOwner,            // Owner of the post
        postTitle: formData.postTitle,          // Title of the post
        postContent: formData.postContent,      // Content of the post in text
        postPictures: formData.postPictures !== "" ? formData.postPictures.toString().split(",") : ["https://imgur.com/E6u04LW"],     // Content of the post in image
        postTags: formData.postTags !== "" ? formData.postTags.toString().split(",").toString().split(",") : [],    // What is the post about
        postDate: formData.postDate,            // Date the post is created
        postTime: formData.postTime,            // Time the post is created       
    });
}

 /* Delete post */ 
 /* Note: To delete, the current organization must be the same as the post owner */
export const doDeletePost = async (postId: string) => {
    const db = getFirestore(app);
    const postRef = doc(db, "posts", postId);

    /* Check if current organization is the owner */


    await setDoc(postRef, {
        postTitle: "Deleted Post",
        postContent: "This post has been deleted.",
        postPictures: ["https://imgur.com/E6u04LW"]
    });
}
