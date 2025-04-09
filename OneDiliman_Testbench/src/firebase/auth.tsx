// Authentication Process: https://www.youtube.com/watch?v=WpIDez53SK4

import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, sendEmailVerification, getAuth, updateProfile } from "firebase/auth";
import { app, auth } from "../FirebaseConfig";
import { addDoc, collection, doc, getFirestore, setDoc, updateDoc, getDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";
import { addNotification } from "../components/FirebaseConnection";


const getCurrentUserId = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return user.uid; // Returns the current user's ID
  } else {
    console.error("No user is currently signed in.");
    return null; // No user is signed in
  }
};

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
                isVerified: false,
                followedOrgs: [],
                likedPosts: [],
            });

            await sendEmailVerification(cred.user);
            console.log("Email sent");

    }).catch((error) => {
        console.error("Error signing up: ", error);
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

/* old signIn
export const doSignInWithEmailAndPassword = (formData: any) => {
    return signInWithEmailAndPassword(auth, formData.email, formData.password)
}; */

export const doSignInWithEmailAndPassword = async (formData: any) => {
    const auth = getAuth();
    const db = getFirestore();

    try {
        // Step 1: Authenticate user via Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        console.log("User signed in:", user);

        // Step 2: Check if user exists in Firestore (users collection first)
        let userRef = doc(db, "users", user.uid);
        let userSnapshot = await getDoc(userRef);
        let collectionType = "users"; // Default to users

        if (!userSnapshot.exists()) {
            // Step 3: If not found in users, check organizations collection
            userRef = doc(db, "organizations", user.uid);
            userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                collectionType = "organizations";
            }
        }

        // Step 4: If user exists, update verification status is also student
        if (userSnapshot.exists() && user.emailVerified) {
          const studentStatus = await isStudent(user.uid);
          if (studentStatus) {
              await setDoc(userRef, { isVerified: true }, { merge: true });
              console.log(`Student user verified, updated Firestore in ${collectionType} collection.`);
          } else {
              console.log("User email is verified, but account is not a student. Firestore not updated.");
          }
      } else {
          console.log("User is not verified, no update to Firestore.");
      }
      

        return { user, collectionType };
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};




export const doSignInAsGuest = () => {
    return signInAnonymously(auth);
};

export const doSignOut = () => {
    return auth.signOut();
}

export const doCreateOrgWithEmailAndPassword = async (formData: any) => {
    console.log("Inside doCreateOrgWithEmailAndPassword", formData);

    return createUserWithEmailAndPassword(auth, formData.orgConnectedEmail, formData.orgPassword).then(async (cred: any) =>  {
        console.log("User created successfully:", cred.user.uid);

        const db = getFirestore(app);
        const orgRef = doc(db, "organizations", cred.user.uid);
        const orgId = orgRef.id; //store the id to display the org
        
        try {
            console.log("awaiting setdoc");
            await setDoc(orgRef, {
                    orgConnectedEmail: formData.orgConnectedEmail,
                    //orgId: formData.orgName.replace(/\s/g, '_'), // https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
                    orgId: orgId,
                    orgLogo: formData.orgLogo || "",
                    orgName: formData.orgName,
                    orgAcronym: formData.orgAcronym || "No acryonym",
                    //orgPictures: formData.orgPictures !== "" ? formData.orgPictures.toString().split(",") : ["https://imgur.com/E6u04LW"],
                    orgPictures: formData.orgPictures || ["https://imgur.com/E6u04LW"],
                    orgBio: formData.orgBio || "No bio",
                    // orgTags: formData.orgTags !== "" ? formData.orgTags.split(",").toString().split(",") : [],
                    //orgTags: formData.orgTags !== "" ? formData.orgTags.toString().split(",").toString().split(",") : [],
                    orgTags: formData.orgTags || ["Tag1: Will be expanded on", "Tag2: in a future sprint"],


                    dateFounded: formData.dateFounded || "2025",
                    orgCollege: formData.orgLocation,
                    //orgAffiliations: formData.orgAffiliations !== "" ? formData.orgAffiliations.toString().split(",") : [],
                    orgAffiliations: formData.orgAffiliations || [],
                    //orgEmails: formData.orgEmails !== "" ? formData.orgEmails.toString().split(",") : [],
                    orgEmails: formData.orgEmails || "email@up.edu.ph",
                    orgFacebook: formData.orgFacebook || "facebook.com",
                    orgWebsite: formData.orgWebsite || "google.com",
                    orgDescription: formData.orgDescription || "No description",
                    orgScope: formData.orgScope,
                    openForApplications: formData.openForApplications || true,
                    members: {},
                    applicants: {},
                    aspiringApplicants: {},
                    isVerified: false,
                    followerCount: 0,
                    followers: [],

                });
            
                console.log("Successfully wrote organization data to Firestore");
 
                try {
                    await sendEmailVerification(cred.user);
                    console.log("Verfication e-mail sent");
                }
                catch (error) {
                    console.log("Error sending verification e-mail");
                } 

            const userRef = doc(db, "organization-admins", cred.user.uid);
            await setDoc(userRef, {
                orgName: formData.orgName,
                orgConnectedEmail: formData.orgConnectedEmail
            });

            console.log("Successfully wrote admin data to Firestore");
        }
        catch (error){
            console.error("Error writing to Firestore:", error);
        }
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
        postLikes: 0,
        usersLiked: [],       
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

export const followOrganization = async (userId: string, orgId: string) => {
    const db = getFirestore(app);

    try {
      // Reference to the user and organization documents
      const userRef = doc(db, 'users', userId);
      const orgRef = doc(db, 'organizations', orgId);
  
      // Update the user's followedOrgs array
      await updateDoc(userRef, {
        followedOrgs: arrayUnion(orgId), // Add the orgId to the array
      });
  
      // Increment the organization's follower count
      await updateDoc(orgRef, {
        followers: arrayUnion(userId),
        followerCount: increment(1), // Increment by 1
      });
  
      console.log('User successfully followed the organization!');
    } catch (error) {
      console.error('Error following organization:', error);
    }
  };

  export const unfollowOrganization = async (userId: string, orgId: string) => {
    const db = getFirestore(app);
    try {
      // Reference to the user and organization documents
      const userRef = doc(db, 'users', userId);
      const orgRef = doc(db, 'organizations', orgId);
  
      // Update the user's followedOrgs array
      await updateDoc(userRef, {
        followedOrgs: arrayRemove(orgId), // Remove the orgId from the array
      });
  
      // Decrement the organization's follower count
      await updateDoc(orgRef, {
        followers: arrayRemove(userId),
        followerCount: increment(-1), // Decrement by 1
      });
  
      console.log('User successfully unfollowed the organization!');
    } catch (error) {
      console.error('Error unfollowing organization:', error);
    }
  };

  export const isFollowingOrganization = async (userId: string, orgId: string): Promise<boolean> => {
    const db = getFirestore(app);
    try {
      // Reference to the user document
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Check if the orgId is in the user's followedOrgs array
        return userData.followedOrgs && userData.followedOrgs.includes(orgId);
      } else {
        console.error('User document does not exist');
        return false;
      }
    } catch (error) {
      console.error('Error checking if user is following organization:', error);
      return false;
    }
  };

  export const isStudent = async (userId: string): Promise<boolean> => {
    const db = getFirestore(app);
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Check if the user has a studentId field and it has a value
        return !!userData.studentId; // Returns true if studentId exists and is not empty
      } else {
        console.error('User document does not exist');
        return false;
      }
    } catch (error) {
      console.error('Error checking if user is a student:', error);
      return false;
    }
  };

  export const likePost = async (userId: string, postId: string) => {
    const db = getFirestore(app);
  
    try {
      const userRef = doc(db, 'users', userId);
      const postRef = doc(db, 'posts', postId);
  
      // Add user ID to the post's usersLiked array and increment like count
      await updateDoc(postRef, {
        usersLiked: arrayUnion(userId),
        postLikes: increment(1),
      });
  
      // Add post ID to the user's likedPosts array
      await updateDoc(userRef, {
        likedPosts: arrayUnion(postId),
      });
  
      // Fetch the post data to get the post owner and title
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();
      if (!postData) {
        console.error('Post document does not exist');
        return;
      }
  
      const postOwnerId = postData.postOwner;
  
      // Fetch the user's first and last name
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      if (!userData) {
        console.error('User document does not exist');
        return;
      }
  
      const firstName = userData.firstName || 'Someone';
      const lastName = userData.lastName || '';
  
      // Send notification to the post owner
      await addNotification(
        postOwnerId,
        `${firstName} ${lastName} liked your post: ${postData.postTitle}`,
        userId,
        postId
      );
  
      console.log('User successfully liked the post and notification sent!');
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  export const unlikePost = async (userId: string, postId: string) => {
    const db = getFirestore(app);
  
    try {
      const userRef = doc(db, 'users', userId);
      const postRef = doc(db, 'posts', postId);
  
      await updateDoc(postRef, {
        usersLiked: arrayRemove(userId),
        postLikes: increment(-1)
      });
  
      await updateDoc(userRef, {
        likedPosts: arrayRemove(postId)
      });
  
      console.log('User successfully unliked the post!');
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  export const hasLikedPost = async (userId: string, postId: string): Promise<boolean> => {
    const db = getFirestore(app);
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Send notification to the post owner
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
          const postData = postDoc.data();
          const postOwnerId = postData.postOwner;
          const notificationRef = doc(collection(db, 'notifications'));
          // await addDoc(notificationRef, {
          //   userId: postOwnerId,
          //   timestamp: new Date(),
          //   read: false,
          //   postId: postId,
          //   type: 'like',
          //   message: `${userId} liked your post: ${postData.postTitle}`,
          // });
        } else {
          console.error('Post document does not exist');
        }

        return userData.likedPosts && userData.likedPosts.includes(postId);

      } else {
        console.error('User document does not exist');
        return false;
      }
    } catch (error) {
      console.error('Error checking if user liked post:', error);
      return false;
    }
  };

  export const resendVerificationEmail = async (): Promise<void> => {
    const auth = getAuth();
    const user = auth.currentUser;
 
    if (!user) {
      throw new Error("No user is currently logged in.");
    }
 
    if (user.emailVerified) {
      throw new Error("User is already verified.");
    }
 
    try {
      await sendEmailVerification(user);
      console.log("Verification email sent.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  };
