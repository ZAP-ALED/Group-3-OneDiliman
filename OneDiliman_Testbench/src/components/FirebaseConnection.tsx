import React, { useState } from "react";
import "../FirebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  getFirestore,
  doc,
  deleteDoc,
  updateDoc,
  FieldValue,
  getDoc,
  setDoc,
  
} from "firebase/firestore";
import firebase from "firebase/compat/app";

/*
Used for setting connection to Firebase
https://www.youtube.com/watch?v=-lAlGo5nRms
https://www.youtube.com/watch?v=2yNyiW_41H8
*/

export async function fetchUserData() {
  try {
    const db = getFirestore();
    const colRef = collection(db, "users");
    const users: any[] = [];
    const snapshot = await getDocs(colRef);

    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });

    return users;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}

export async function fetchOrgAccountData() {
  try {
    const db = getFirestore();
    const colRef = collection(db, "organizations-test");
    const users: any[] = [];
    const snapshot = await getDocs(colRef);

    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });

    return users;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}

export async function fetchUserBookmarks(id: string) {
  try {
    const db = getFirestore();
    const userDoc = doc(db, "users", id);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.orgBookmarks;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}

export async function addUserData(
  firstName: string,
  middleName: string,
  lastName: string,
  studentId: string
) {
  const db = getFirestore();

  const docRef = await addDoc(collection(db, "users"), {
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    studentId: studentId,
  });

  alert("User has been added to database");
}

export async function fetchOrgData() {
  try {
    const db = getFirestore();
    const colRef = collection(db, "organizations");
    const users: any[] = [];
    const snapshot = await getDocs(colRef);

    snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });

    return users;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}

export async function addOrgData(
  orgConnectedEmail: string,
  orgId: string,
  orgLogo: string,
  orgName: string,
  orgAcronym: string,
  orgPictures: string[],
  orgBio: string,
  orgTags: string[],
  dateFounded: string,
  orgLocation: string,
  orgAffiliations: string[],
  orgEmails: string[],
  orgWebsite: string,
  orgFacebook: string,
  orgDescription: string,
  orgScope: string,
  openForApplications: string
) {
  const db = getFirestore();

  const docRef = await addDoc(collection(db, "organizations"), {
    orgConnectedEmail: orgConnectedEmail,
    orgId: orgId,
    orgLogo: orgLogo,
    orgName: orgName,
    orgAcronym: orgAcronym,
    orgPictures: orgPictures,
    orgBio: orgBio,
    orgTags: orgTags,
    dateFounded: dateFounded,
    orgLocation: orgLocation,
    orgAffiliations: orgAffiliations,
    orgEmails: orgEmails,
    orgFacebook: orgFacebook,
    orgWebsite: orgWebsite,
    orgDescription: orgDescription,
    orgScope: orgScope,
    openForApplications: openForApplications,
  });

  // alert("Organization has been added to database");
}

export async function deleteOrg(
  id: string,
  orgName: string,
  orgDescription: string
) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await deleteDoc(orgDoc);

  const docRef = await addDoc(collection(db, "archived-orgs"), {
    orgName: orgName,
    orgDescription: orgDescription,
  });

  // alert("Organization has been archived"); TOAST DONE
}

export async function editOrgDescription(id: string, description: string) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await updateDoc(orgDoc, { orgDescription: description });
}

export async function editOrgBio(id: string, bio: string) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await updateDoc(orgDoc, { orgBio: bio });
}

export async function editOrgTags(id: string, tags: string[]) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await updateDoc(orgDoc, { orgTags: tags });
}

export async function editOrgAbout(
  id: string,
  founded: Date,
  location: string,
  email: string,
  website: string,
  facebook: string,
  affiliations: string
) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await updateDoc(orgDoc, {
    dateFounded: founded,
    orgLocation: location,
    orgEmails: email,
    orgWebsite: website,
    orgFacebook: facebook,
    orgAffiliations: affiliations,
  });
}

export async function editOrgPictures(id: string, pic1: string, pic2: string, pic3: string) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await updateDoc(orgDoc, { orgPictures: [pic1, pic2, pic3] });
}

export async function editOrgLogo(id: string, logo: string) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await updateDoc(orgDoc, { orgLogo: logo });
}

export async function updateAvailabilityOrg(id: string, open: boolean) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);

  await updateDoc(orgDoc, { openForApplications: open ? "Open" : "Closed" });
}

export async function editOrgDetailsAdmin(
  id: string,
  name: string,
  description: string
) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations", id);
  await updateDoc(orgDoc, { orgName: name });
  await updateDoc(orgDoc, { orgDescription: description });

  // alert("Organization description has been updated"); TOAST DONE
}

export async function editOrgAdminDetailsAdmin(
  id: string,
  name: string,
  email: string
) {
  const db = getFirestore();
  const orgDoc = doc(db, "organizations-test", id);
  await updateDoc(orgDoc, { orgName: name });
  await updateDoc(orgDoc, { orgConnectedEmail: email });

  // alert("Organization description has been updated"); TOAST DONE
}

export async function editNameAdmin(id: string, name: string) {
  const splitName = name.split(", ");
  const db = getFirestore();
  const orgDoc = doc(db, "users", id);
  await updateDoc(orgDoc, { firstName: splitName[1] });
  await updateDoc(orgDoc, { lastName: splitName[0] });
}

export async function updateRoles(id: string, role: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", id);

  await updateDoc(userDoc, { role: role });

  // alert("User role has been updated"); TOAST DONE
}

// allows re-setting to true and creating to a new one: https://stackoverflow.com/questions/71769424/how-to-create-a-document-if-the-document-doesnt-exist-or-else-dont-do-anything
export async function updateUserBookmark(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    let isStarred = false;
    if (docSnap.data().orgBookmarks[orgId]) {
      isStarred = true;
    }

    await updateDoc(userDoc, { [`orgBookmarks.${orgId}`]: !isStarred });
  } else {
    await setDoc(userDoc, { [`orgBookmarks.${orgId}`]: true });
  }

  alert("User bookmarks has been updated");
}

export async function deleteUserBookmark(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);

  await updateDoc(userDoc, { [`orgBookmarks.${orgId}`]: false });
  alert("User bookmarks has been updated");
}

export async function addUserApplication(userId: string, orgId: string) {
  const db = getFirestore(); 

  const userDoc = doc(db, "users", userId);

  await setDoc(userDoc, { [`orgsApplied.${orgId}`]: true });

  const orgDoc = doc(db, "organizations", orgId);
  await setDoc(orgDoc, { [`appliedUsers.${userId}`]: true });

  alert("User application has been processed");
}

export async function fetchOrgMembers(orgId: string) {
  try {
    const db = getFirestore();
    const docRef = doc(db, "organizations", orgId);
    let fetchData: any;
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();  
      fetchData = data.members;
    }
    console.log(fetchData);
    
    const users = Object.keys(fetchData);
    const userBool = Object.values(fetchData);
    const userDocRef: any[] = users.map((userId) => doc(db, "users", userId));
    const members: any[] = [];
    let i = 0;
    for (const ref of userDocRef){
      const userDocSnap = await getDoc(ref);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        (userData as any).orgStatus = userBool[i];
        (userData as any).id = userDocSnap.id;
        if ((userData as any).memberOrgs[orgId]) {
          members.push(userData);
        }
      }
      i = i + 1;
    }
    console.log(members);

    return members;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}

export async function fetchOrgApplicants(orgId: string) {
  try {
    const db = getFirestore();
    const docRef = doc(db, "organizations", orgId);
    let fetchData: any;
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();  
      fetchData = data.applicants;
    }
    console.log(fetchData);
    
    const users = Object.keys(fetchData);
    const userBool = Object.values(fetchData);
    const userDocRef: any[] = users.map((userId) => doc(db, "users", userId));
    const applicants: any[] = [];
    let i = 0;
    for (const ref of userDocRef){
      const userDocSnap = await getDoc(ref);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        (userData as any).orgStatus = userBool[i];
        (userData as any).id = userDocSnap.id;
        if ((userData as any).appliedOrgs[orgId]) {
          applicants.push(userData);
        }
      }
      i = i + 1;
    }
    console.log(applicants);

    return applicants;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}

export async function fetchOrgAspiringApplicants(orgId: string) {
  try {
    const db = getFirestore();
    const docRef = doc(db, "organizations", orgId);
    let fetchData: any;
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();  
      fetchData = data.aspiringApplicants;
    }
    console.log(fetchData);
    
    const users = Object.keys(fetchData);
    const userBool = Object.values(fetchData);
    const userDocRef: any[] = users.map((userId) => doc(db, "users", userId));
    const aspiringApplicants: any[] = [];
    let i = 0;
    for (const ref of userDocRef){
      const userDocSnap = await getDoc(ref);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        (userData as any).orgStatus = userBool[i];
        (userData as any).id = userDocSnap.id;
        if ((userData as any).aspiringAppliedOrgs[orgId]) {
          aspiringApplicants.push(userData);
        }
      }
      i = i + 1;
    }
    console.log(aspiringApplicants);

    return aspiringApplicants;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    throw err; // Rethrow the error to be handled elsewhere if needed
  }
}

export async function updateUserMembership(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    let isAMember = false;
    if (docSnap.data().memberOrgs[orgId]) {
      isAMember = true;
    }

    await updateDoc(userDoc, { [`memberOrgs.${orgId}`]: !isAMember });
  } else {
    await setDoc(userDoc, { [`memberOrgs.${orgId}`]: true });
  }

  alert("User's membership has been edited");
}

export async function updateUserApplication(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    let isAMember = false;
    if (docSnap.data().appliedOrgs[orgId]) {
      isAMember = true;
    }

    await updateDoc(userDoc, { [`appliedOrgs.${orgId}`]: !isAMember });
  } else {
    await setDoc(userDoc, { [`appliedOrgs.${orgId}`]: true });
  }

  alert("User's application has been edited");
}

export async function updateUserAspiringApplication(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    let isAMember = false;
    if (docSnap.data().aspiringAppliedOrgs[orgId]) {
      isAMember = true;
    }

    await updateDoc(userDoc, { [`aspiringAppliedOrgs.${orgId}`]: !isAMember });
  } else {
    await setDoc(userDoc, { [`aspiringAppliedOrgs.${orgId}`]: true });
  }
  
  const orgDoc = doc(db, "organizations", orgId);
  const orgSnap = await getDoc(orgDoc);

  if (orgSnap.exists()) {
    let isAMember = false;
    if (orgSnap.data().aspiringApplicants[userId]) {
      isAMember = true;
    }

    await updateDoc(orgDoc, { [`aspiringApplicants.${userId}`]: !isAMember });
  } else {
    await setDoc(orgDoc, { [`aspiringApplicants.${userId}`]: true });
  }

  alert("User's aspiring application has been edited");
}

export async function fetchUserAspiringApplication(userId: string, orgId: string) {
  const db = getFirestore();
  console.log(userId);
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);
  console.log("Fetching...")

  if (docSnap.exists()) {
    console.log(`hi: ${docSnap.data().aspiringAppliedOrgs[orgId]}`)
    if (docSnap.data().aspiringAppliedOrgs[orgId]) {
      return true;
    }
  }
  return false;
}

export async function promoteAspiringToApplicant(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    let isAnApplicant = false;
    if (docSnap.data().aspiringAppliedOrgs[orgId]) {
      isAnApplicant = true;
    }

    if (isAnApplicant) {
      await updateDoc(userDoc, { [`aspiringAppliedOrgs.${orgId}`]: false });
      await updateDoc(userDoc, { [`appliedOrgs.${orgId}`]: true });
    }
  }
  
  const orgDoc = doc(db, "organizations", orgId);
  const orgSnap = await getDoc(orgDoc);

  if (orgSnap.exists()) {
    let isAnApplicant = false;
    if (orgSnap.data().aspiringApplicants[userId]) {
      isAnApplicant = true;
    }

    if (isAnApplicant) {
      await updateDoc(orgDoc, { [`aspiringApplicants.${userId}`]: false });
      await updateDoc(orgDoc, { [`applicants.${userId}`]: true });
    }
  }

  alert("User is now a member");
}

export async function promoteApplicantToMember(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    let isAnApplicant = false;
    if (docSnap.data().appliedOrgs[orgId]) {
      isAnApplicant = true;
    }

    if (isAnApplicant) {
      await updateDoc(userDoc, { [`appliedOrgs.${orgId}`]: false });
      await updateDoc(userDoc, { [`memberOrgs.${orgId}`]: true });
    }
  }
  
  const orgDoc = doc(db, "organizations", orgId);
  const orgSnap = await getDoc(orgDoc);

  if (orgSnap.exists()) {
    let isAnApplicant = false;
    if (orgSnap.data().applicants[userId]) {
      isAnApplicant = true;
    }

    if (isAnApplicant) {
      await updateDoc(orgDoc, { [`applicants.${userId}`]: false });
      await updateDoc(orgDoc, { [`members.${userId}`]: true });
    }
  }

  alert("User is now a member");
}

export async function kickMember(userId: string, orgId: string) {
  const db = getFirestore();
  const userDoc = doc(db, "users", userId);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    let isAMember = false;
    if (docSnap.data().memberOrgs[orgId]) {
      isAMember = true;
    }

    if (isAMember) {
      await updateDoc(userDoc, { [`memberOrgs.${orgId}`]: false });
    }
  }
  
  const orgDoc = doc(db, "organizations", orgId);
  const orgSnap = await getDoc(orgDoc);

  if (orgSnap.exists()) {
    let isAMember = false;
    if (orgSnap.data().members[userId]) {
      isAMember = true;
    }

    if (isAMember) {
      await updateDoc(orgDoc, { [`members.${userId}`]: false });
    }
  }

  alert("User is now removed");
}

// Post Functions

// View Post function (Coming Soon)
export async function fetchPostData() {}

// Add Post to database
export async function addPostData(
  postOwner: string,
  postId: string,
  postTitle: string,
  postContent: string,
  postPictures: string[],
  postDate: string,
  postTime: string,
  postTags: string[],

) {
  const db = getFirestore();

  const docRef = await addDoc(collection(db, "posts"), {
    postOwner: postOwner,
    postId: postId,
    postTitle: postTitle,
    postContent: postContent,
    postDate: postDate,
    postTime: postTime,
    postTags: postTags,
    postPictures: postPictures

  });

  // alert("Post has been added to database");
}

// Edit Post in database (Coming Soon)
export async function editPostData() {}

// Delete Post from database
// Note that a post can only be delete if the organization is the owner of the post
export async function deletePost(
  id: string,
  postTitle: string,
  postContent: string

) {
  const db = getFirestore();
  const postDoc = doc(db, "posts", id);
  await deleteDoc(postDoc);

  const docRef = await addDoc(collection(db, "archived-posts"), {
    postTitle: postTitle,
    postContent: postContent,
  });

  // alert("Post has been archived");
}
