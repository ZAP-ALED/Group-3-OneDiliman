import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore, collection, onSnapshot, addDoc, serverTimestamp, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { followOrganization, unfollowOrganization, isFollowingOrganization, isStudent } from '../../firebase/auth';
import { app, db } from '../../FirebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faChevronLeft, faCakeCandles, faLocationDot, faEnvelope, 
  faGlobe, faHandshakeAngle, faPen, faPlus, faImage
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Navbar from '../../components/Navbar/Navbar';
import PostCard from './PostCard';
import { Organization, Post, Event } from '../../components/DatabaseEntities';
import { addPostData, addEventData, addNotification } from '../../components/FirebaseConnection';
import './OrgPage.css';
import EventCard from './EventCard';
import ApplicationButton from './ApplicationButton';



interface Post {
  id: string;
  postOwner: string;
  postTitle: string;
  postContent: string;
  postPictures: string[];
  postTags: string[];
  postDate: string;
  postTime: string;
  postLikes?: number;
  usersLiked?: string[];
}

type EditableOrgData = Partial<Organization>;

export interface Event {
  id: string;
  eventId: string;
  eventOwner: string;
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventPictures: string[];
  eventTags: string[];
  eventDate: string;
  eventTime: string;
  willNotify: string[];
}

export default function OrgPage() {
  const params = useParams();
  const [isUserAnOrgAdmin, setIsUserAnOrgAdmin] = useState(false);
  const [uid, setUid] = useState("");
  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState<EditableOrgData>({
    orgDescription: '',
    orgWebsite: '',
    orgFacebook: '',
    orgBio: '',
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<Partial<Post>>({ 
    postTitle: '', 
    postContent: '', 
    postPictures: [],
    postTags: [],
    postDate: '',
    postTime: '',
    postLikes: 0,
    usersLiked: [],
  });
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    eventName: '',
    eventDescription: '',
    eventLocation: '',
    eventPictures: [],
    eventDate: '',
    eventTime: '',
    eventTags: [],
    willNotify: []
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [isFollowing, setIsFollowing] = useState<boolean>(false); //new for following
  const [isStudentUser, setIsStudentUser] = useState<boolean>(false);

  // Sprint 4 - Loading Indicator Variables
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [sortCriteria, setSortCriteria] = useState<'alphabet' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sprint 4 - Loading Indicator
  useEffect(() => {
    const auth = getAuth();
    let postColl: () => void;
    let eventsColl: () => void;

    const deletePastEvents = async (events: Event[]) => {
      const now = new Date();
      const pastEvents = events.filter(event => new Date(event.eventDate + ' ' + event.eventTime) < now);
      await Promise.all(pastEvents.map(event => deleteDoc(doc(db, 'events', event.id))));
    };
  
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('No user logged in');
        setError('No user logged in');
        setLoading(false);
        return;
      }
  
      setUid(user.uid);
  
      try {
        const orgDoc = await getDoc(doc(getFirestore(app), 'organizations', params.orgId!));
        console.log(orgDoc);
        const data = orgDoc.data();
  
        if (!orgDoc.exists()) {
          setError('Organization not found');
          setLoading(false);
          return;
        }
  
        const isAdmin = orgDoc.exists() && user.uid === data?.orgId;
        setIsUserAnOrgAdmin(isAdmin);
  
        const followingStatus = await isFollowingOrganization(user.uid, params.orgId!);
        setIsFollowing(followingStatus);
  
        const studentStatus = await isStudent(user.uid);
        setIsStudentUser(studentStatus);
  
        setOrgData(data as Organization);
        
        // console.log('Admin check:', {
        //   userEmail: user.uid,
        //   orgConnectedEmail: data.orgEmail,
        //   isAdmin
        // });
              
        const typedData: Organization = {
          orgName: data.orgName || '',
          orgCollege: data.orgCollege || '',
          followerCount: data.followerCount || 0, // new added for followers
          orgAcronym: data.orgAcronym || '',
          orgDescription: data.orgDescription || '',
          orgEmails: Array.isArray(data.orgEmails) ? data.orgEmails : [],
          orgWebsite: data.orgWebsite || '',
          orgFacebook: data.orgFacebook || '',
          orgLocation: data.orgLocation || '',
          orgBio: data.orgBio || '',
          orgLogo: data.orgLogo || '',
          orgBanner: data.orgBanner || '',
          orgPictures: Array.isArray(data.orgPictures) ? data.orgPictures : [],
          orgTags: Array.isArray(data.orgTags) ? data.orgTags : [],
          orgScope: data.orgScope || '',
          orgAffiliations: Array.isArray(data.orgAffiliations) ? data.orgAffiliations : [],
          dateFounded: data.dateFounded || '',
          openForApplications: Boolean(data.openForApplications),
          members: data.members || {},
          applicants: data.applicants || {},
          aspiringApplicants: data.aspiringApplicants || {},
          orgConnectedEmail: data.orgConnectedEmail || '' ,
          applicationFormUrl: data.applicationFormUrl || '',
        };
        
        // might use in the next sprints
        setOrgData(typedData);
        setEditableData({
          // orgName: typedData.orgName,
          // orgCollege: typedData.orgCollege,
          // orgAcronym: typedData.orgAcronym,
          orgDescription: typedData.orgDescription,
          // orgEmails: typedData.orgEmails,
          orgWebsite: typedData.orgWebsite,
          orgFacebook: typedData.orgFacebook,
          // orgLocation: typedData.orgLocation,
          orgBio: typedData.orgBio,
          // orgScope: typedData.orgScope,
          // orgAffiliations: typedData.orgAffiliations,
          // dateFounded: typedData.dateFounded,
          openForApplications: typedData.openForApplications
        });

  
        setLoading(false);
  
        postColl = onSnapshot(
          collection(db, 'posts'),
          (snapshot) => {
            const postsData = snapshot.docs
              .filter(doc => doc.data().postOwner === params.orgId)
              .map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  postId: doc.id,
                  postOwner: data.postOwner || '',
                  postTitle: data.postTitle || '',
                  postContent: data.postContent || '',
                  postPictures: data.postPictures || [],
                  postTags: data.postTags || [],
                  postDate: data.postDate || '',
                  postTime: data.postTime || ''
                };
              });
  
            setPosts(postsData);
            setLoadingPosts(false);
          }
        );
  
        eventsColl = onSnapshot(
          collection(db, 'events'),
          async (snapshot) => {
            const eventsData = snapshot.docs
              .filter(doc => doc.data().eventOwner === params.orgId)
              .map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  eventId: doc.id,
                  eventOwner: data.eventOwner || '',
                  eventName: data.eventName || '',
                  eventDescription: data.eventDescription || '',
                  eventLocation: data.eventLocation || '',
                  eventPictures: data.eventPictures || [],
                  eventTags: data.eventTags || [],
                  eventDate: data.eventDate || '',
                  eventTime: data.eventTime || '',
                  willNotify: data.willNotify || []
                };
              });

            await deletePastEvents(eventsData);
  
            setEvents(eventsData.filter(event => new Date(event.eventDate + ' ' + event.eventTime) >= new Date()).sort((a, b) =>
              new Date(b.eventDate + ' ' + b.eventTime).getTime() -
              new Date(a.eventDate + ' ' + a.eventTime).getTime()
            ));
            setLoadingEvents(false);
          }
        );
  
      } catch (err) {
        console.error('Error:', err);
        setError('Error loading data');
        setLoading(false);
      }
    });
  
    return () => {
      unsubscribe();
      if (postColl) postColl();
      if (eventsColl) eventsColl();
    };
  }, [params.orgId]);

  const sortPosts = (posts: Post[]) => {
    return posts.sort((a, b) => {
      if (sortCriteria === 'alphabet') {
        const titleA = a.postTitle.toLowerCase();
        const titleB = b.postTitle.toLowerCase();
        if (titleA < titleB) return sortOrder === 'asc' ? -1 : 1;
        if (titleA > titleB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else {
        // Converting the time into a number
        const timeA = a.postTime.split(':').reduce((acc, time, index) => acc + parseInt(time) * Math.pow(60, 2 - index), 0);
        const timeB = b.postTime.split(':').reduce((acc, time, index) => acc + parseInt(time) * Math.pow(60, 2 - index), 0);

        const dateA = (new Date(`${a.postDate}`).getTime());
        const dateB = (new Date(`${b.postDate}`).getTime());
        
        // Displaying all the data (For DEBUGGING)
        //const msg = `Date A: ${dateA}, Date B: ${dateB}, Time A: ${timeA}, Time B: ${timeB}; FinalA:  ${dateA + timeA}; FinalB: ${dateB + timeB}`;
        //alert(msg)

        // Combining the date and time into a single number and making them smaller
        const finalA = (dateA/100) + (timeA/100);
        const finalB = (dateB/100) + (timeB/100);

        //alert(sortOrder === 'asc' ? dateA - dateB : dateB - dateA)
        return sortOrder === 'asc' ? finalA - finalB : finalB - finalA;
      }
    });
  };

  // Sort Events Based on the day and time it will happen
  const sortEvents = (events: Event[]) => {
    return events.sort((a, b) => {
        // Converting the time into a number
        const timeA = a.eventTime.split(':').reduce((acc, time, index) => acc + parseInt(time) * Math.pow(60, 2 - index), 0);
        const timeB = b.eventTime.split(':').reduce((acc, time, index) => acc + parseInt(time) * Math.pow(60, 2 - index), 0);

        const dateA = (new Date(`${a.eventDate}`).getTime());
        const dateB = (new Date(`${b.eventDate}`).getTime());
        
        // Displaying all the data (For DEBUGGING)
        //const msg = `Date A: ${dateA}, Date B: ${dateB}, Time A: ${timeA}, Time B: ${timeB}; FinalA:  ${dateA + timeA}; FinalB: ${dateB + timeB}`;
        //alert(msg)

        // Combining the date and time into a single number and making them smaller
        const finalA = (dateA/100) + (timeA/100);
        const finalB = (dateB/100) + (timeB/100);

        //alert(sortOrder === 'asc' ? dateA - dateB : dateB - dateA)
        return sortOrder === 'asc' ? finalA - finalB : finalB - finalA;
    });
  };

  // useEffect(() => {
  //   const auth = getAuth();
  //   let postColl: () => void;
  //   let eventsColl: () => void;

  
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (!user) {
  //       console.log('No user logged in');
  //       setError('No user logged in');
  //       setLoading(false);
  //       return;
  //     }
  
  //     // console.log('Current user:', {
  //     //   uid: user.uid,
  //     //   email: user.email,
  //     //   emailVerified: user.emailVerified
  //     // });
  
  //     setUid(user.uid);

  //     try {        
  //       const orgDoc = await getDoc(doc(getFirestore(app), 'organizations', params.orgId!));
  //       console.log(orgDoc);
  //       const data = orgDoc.data();

        
  //       console.log('Raw organization data:', data);
        
  //       if (!orgDoc.exists()) {
  //         setError('Organization not found');
  //         setLoading(false);
  //         return;
  //       }
        
  //       const isAdmin = orgDoc.exists() && user.uid === data?.orgId;
  //       setIsUserAnOrgAdmin(isAdmin);

  //       const followingStatus = await isFollowingOrganization(user.uid, params.orgId!);
  //       setIsFollowing(followingStatus);

  //       const studentStatus = await isStudent(user.uid);
  //       setIsStudentUser(studentStatus);

  //       setOrgData(data as Organization);
        
  //       // console.log('Admin check:', {
  //       //   userEmail: user.uid,
  //       //   orgConnectedEmail: data.orgEmail,
  //       //   isAdmin
  //       // });
              
  //       const typedData: Organization = {
  //         orgName: data.orgName || '',
  //         orgCollege: data.orgCollege || '',
  //         followerCount: data.followerCount || 0, // new added for followers
  //         orgAcronym: data.orgAcronym || '',
  //         orgDescription: data.orgDescription || '',
  //         orgEmails: Array.isArray(data.orgEmails) ? data.orgEmails : [],
  //         orgWebsite: data.orgWebsite || '',
  //         orgFacebook: data.orgFacebook || '',
  //         orgLocation: data.orgLocation || '',
  //         orgBio: data.orgBio || '',
  //         orgLogo: data.orgLogo || '',
  //         orgBanner: data.orgBanner || '',
  //         orgPictures: Array.isArray(data.orgPictures) ? data.orgPictures : [],
  //         orgTags: Array.isArray(data.orgTags) ? data.orgTags : [],
  //         orgScope: data.orgScope || '',
  //         orgAffiliations: Array.isArray(data.orgAffiliations) ? data.orgAffiliations : [],
  //         dateFounded: data.dateFounded || '',
  //         openForApplications: Boolean(data.openForApplications),
  //         members: data.members || {},
  //         applicants: data.applicants || {},
  //         aspiringApplicants: data.aspiringApplicants || {},
  //         orgConnectedEmail: data.orgConnectedEmail || '' 
  //       };
        
  //       // might use in the next sprints
  //       setOrgData(typedData);
  //       setEditableData({
  //         // orgName: typedData.orgName,
  //         // orgCollege: typedData.orgCollege,
  //         // orgAcronym: typedData.orgAcronym,
  //         orgDescription: typedData.orgDescription,
  //         // orgEmails: typedData.orgEmails,
  //         orgWebsite: typedData.orgWebsite,
  //         orgFacebook: typedData.orgFacebook,
  //         // orgLocation: typedData.orgLocation,
  //         orgBio: typedData.orgBio,
  //         // orgScope: typedData.orgScope,
  //         // orgAffiliations: typedData.orgAffiliations,
  //         // dateFounded: typedData.dateFounded,
  //         // openForApplications: typedData.openForApplications
  //       });

  //       postColl = onSnapshot(
  //         collection(db, 'posts'),
  //         (snapshot) => {
  //           const postsData = snapshot.docs
  //             .filter(doc => doc.data().postOwner === params.orgId) 
  //             .map(doc => {
  //               const data = doc.data();
  //               return {
  //                 id: doc.id,
  //                 postId: doc.id, 
  //                 postOwner: data.postOwner || '',
  //                 postTitle: data.postTitle || '',
  //                 postContent: data.postContent || '',
  //                 postPictures: data.postPictures || [],
  //                 postTags: data.postTags || [],
  //                 postDate: data.postDate || '',
  //                 postTime: data.postTime || ''
  //               };
  //             });

  //           setPosts(postsData.sort((a, b) => 
  //             new Date(b.postDate + ' ' + b.postTime).getTime() - 
  //             new Date(a.postDate + ' ' + a.postTime).getTime()
  //           ));
  //         }
  //       );

  //      eventsColl = onSnapshot(
  //         collection(db, 'events'),
  //         (snapshot) => {
  //           const eventsData = snapshot.docs
  //             .filter(doc => doc.data().eventOwner === params.orgId) 
  //             .map(doc => {
  //               const data = doc.data();
  //               return {
  //                 id: doc.id,
  //                 eventId: doc.id,
  //                 eventOwner: data.eventOwner || '',
  //                 eventName: data.eventName || '',
  //                 eventDescription: data.eventDescription || '',
  //                 eventLocation: data.eventLocation || '',
  //                 eventPictures: data.eventPictures || [],
  //                 eventTags: data.eventTags || [],
  //                 eventDate: data.eventDate || '',
  //                 eventTime: data.eventTime || '',
  //                 willNotify: data.willNotify || []
  //               };
  //             });

  //           setEvents(eventsData.sort((a, b) => 
  //             new Date(b.eventDate + ' ' + b.eventTime).getTime() - 
  //             new Date(a.eventDate + ' ' + a.eventTime).getTime()
  //           ));
  //         }
  //       );

  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error:', err);
  //       setError('Error loading data');
  //       setLoading(false);
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //     if (postColl) postColl();
  //     if (eventsColl) eventsColl();
  //   };
  // }, [params.orgId]);

  const handleFollow = async () => {
    try {
      await followOrganization(uid, params.orgId!);
      setIsFollowing(true); // Update the UI state
      // Optionally, increment the follower count in the UI
      setOrgData(prev => ({
        ...prev!,
        followerCount: (prev?.followerCount || 0) + 1,
      }));
    } catch (error) {
      console.error('Error following organization:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowOrganization(uid, params.orgId!);
      setIsFollowing(false); // Update the UI state
      // Optionally, decrement the follower count in the UI
      setOrgData(prev => ({
        ...prev!,
        followerCount: (prev?.followerCount || 0) - 1,
      }));
    } catch (error) {
      console.error('Error unfollowing organization:', error);
    }
  };
  // Create a new post
  const handleCreatePost = async () => {
    if (!newPost.postTitle || !newPost.postContent) {
      alert('Title and content are required');
      return;
    }
  
    const postId = doc(collection(db, 'posts')).id;
    const postDate = new Date().toISOString().split('T')[0];
    const postTime = new Date().toLocaleTimeString();
  
    await addPostData(
      params.orgId!,
      postId,
      newPost.postTitle,
      newPost.postContent,
      newPost.postPictures || [],
      postDate,
      postTime,
      newPost.postTags || []
    );
  
    // Notify followers - Sprint 4
    const orgDoc = await getDoc(doc(db, 'organizations', params.orgId!));
    const followers = orgDoc.data()?.followers || [];
    await Promise.all(followers.map(async (followerId: string) => {
      await addNotification(followerId, `New Post from ${orgData?.orgName}: ${newPost.postTitle}`, params.orgId!, postId);
    }));
  
    setShowPostModal(false);
    setNewPost({
      postTitle: '',
      postContent: '',
      postPictures: [],
      postTags: [],
      postDate: '',
      postTime: ''
    });
  };

  const handleEditPost = async (post: Post) => {
    try {
      const postDoc = doc(db, 'posts', post.id);
      await updateDoc(postDoc, {
        postTitle: post.postTitle,
        postContent: post.postContent,
        postTags: post.postTags,
        postPictures: post.postPictures,
      });
      alert('Post updated successfully!');
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post: ' + (error as Error).message);
    }
  };

  // Prints the post id to the console (Returns Promise<void>)
  const handleDeletePost = async (postId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
  
    try {
      const postDoc = doc(db, 'posts', postId);
      const postSnapshot = await getDoc(postDoc);
  
      if (postSnapshot.exists()) {
        const postData = postSnapshot.data();
        const postImg = postData?.postImg;
  
        if (postImg) {
          const storageRef = storage().refFromURL(postImg);
          const imageRef = storage().ref(storageRef.fullPath);
  
          await imageRef.delete();
          console.log(`${postImg} has been deleted successfully.`);
        }
  
        await deleteDoc(postDoc);
        console.log('Post deleted successfully.');
      } else {
        console.log('Post not found.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleImageUpload = async (file: File, type: 'banner' | 'logo') => {
    if (!file) return;
    setIsUploading(true);
    
    try {
      const base64 = await convertToBase64(file);
      
      const orgRef = doc(db, 'organizations', params.orgId!);
      const updateData = type === 'banner' ? { orgBanner: base64 } : { orgLogo: base64 };

      await updateDoc(orgRef, updateData);
      
      const updatedDoc = await getDoc(orgRef);
      setOrgData(updatedDoc.data() as Organization);
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdateOrgInfo = async () => {
  };

  const handleCreateEvent = async () => {
    const eventId = doc(collection(db, 'events')).id;

    if (!newEvent.eventName || !newEvent.eventDescription || !newEvent.eventDate || !newEvent.eventTime) {
      alert('Event name, description, date, and time are required');
      return;
    }
    //Event Date is in the past
    if (new Date(newEvent.eventDate + ' ' + newEvent.eventTime) < new Date()) {
      alert('Event date and time must be in the future');
      return;
    }
    
  
    await addEventData(
      params.orgId!,
      eventId,
      newEvent.eventName,
      newEvent.eventDescription,
      newEvent.eventLocation,
      newEvent.eventPictures || [],
      newEvent.eventDate,
      newEvent.eventTime,
      newEvent.eventTags || []
    );
  
    // Notify followers - Sprint 4
    const orgDoc = await getDoc(doc(db, 'organizations', params.orgId!));
    const followers = orgDoc.data()?.followers || [];
    await Promise.all(followers.map(async (followerId: string) => {
      await addNotification(followerId, `New Event from ${orgData?.orgName}: ${newEvent.eventName}`, params.orgId!, eventId);
    }));
  
    setShowEventModal(false);
    setNewEvent({
      eventName: '',
      eventDescription: '',
      eventLocation:'',
      eventPictures: [],
      eventDate: '',
      eventTime: '',
      eventTags: [],
    });
  };

  const handleDeleteEvent = async (eventId: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
  
    try {
      const eventDoc = doc(db, 'events', eventId);
      await deleteDoc(eventDoc);
      console.log('Event deleted successfully.');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event: ' + (error as Error).message);
    }
  };

  // Edit event
  const handleEditEvent = async (event: Event) => {
    try {
      const eventDoc = doc(db, 'events', event.id);
      await updateDoc(eventDoc, {
        eventName: event.eventName,
        eventDescription: event.eventDescription,
        eventLocation: event.eventLocation,
        eventPictures: event.eventPictures,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        eventTags: event.eventTags,
      });
      alert('Event updated successfully!');
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event: ' + (error as Error).message);
    }
  };



  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="org-page-container">
      <Navbar currentPage="dashboard" />
  
      <div className="container mt-4">
        <div className="org-hero-card">
          <div className="org-cover-image" style={{ 
            backgroundImage: orgData?.orgBanner ? `url(${orgData.orgBanner})` : 'none'
          }}>
            <div className="org-header">
              {isUserAnOrgAdmin && (
                <div className="edit-banner-overlay">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'banner')}
                    id="banner-upload"
                    hidden
                  />
                  <label htmlFor="banner-upload" className="btn btn-light">
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    {isUploading ? 'Uploading...' : 'Change Banner'}
                  </label>
                </div>
              )}
            </div>
          </div>
  
          <div className="org-info-section">
            <div className="org-logo-container">
              <img 
                src={orgData?.orgLogo || ''} 
                className="org-logo"
              />
              {isUserAnOrgAdmin && (
                <div className="edit-logo-overlay">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'logo')}
                    id="logo-upload"
                    hidden
                  />
                  <label htmlFor="logo-upload" className="btn btn-light btn-sm">
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    {isUploading ? 'Uploading...' : 'Change Logo'}
                  </label>
                </div>
              )}
            </div>
              
            {/* Org header */}
            <div className="org-info">
              <div className="org-header">
                <div className="org-title">
                  <h1>{orgData?.orgName}</h1>
                  <h2>{orgData?.orgCollege}</h2>
                </div>
                {/* Followers */}
                <div className="info-item">
                      <FontAwesomeIcon icon={faUser} className="icon" />
                      Followers 
                      <span data-testid ="follower-count">{orgData?.followerCount}</span>
                        <div className="org-title">
                        {isStudentUser && (
                          isFollowing ? (
                            <button className="btn btn-danger me-2" onClick={handleUnfollow} data-testid="unfollow-button">
                              Unfollow
                            </button>
                          ) : (
                            <button className="btn btn-primary me-2" onClick={handleFollow} data-testid="follow-button">
                              Follow
                            </button>
                          )
                        )}
                      </div>
                </div>
                
                
                {isUserAnOrgAdmin && (
                  <div className="org-actions">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <FontAwesomeIcon icon={faPen} className="me-2" />
                      Edit Organization
                    </button>
                  </div>
                )}
                
              </div>
  
              {orgData?.orgTags && (
                <div className="org-tags-wrapper">
                  {orgData.orgTags.map((tag, index) => (
                    <span key={index} className="org-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <ApplicationButton
                orgId={params.orgId!}
                isOpen={Boolean(orgData?.openForApplications)}
                formUrl={orgData?.applicationFormUrl || ""}
                orgName={orgData?.orgName || ""}
                isAdmin={isUserAnOrgAdmin}
              />
            
            </div>
          </div>
        </div>
        

        {/* org details */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                {isEditing ? (
                  <div className="edit-form">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={editableData.orgDescription}
                        onChange={(e) => setEditableData({
                          ...editableData,
                          orgDescription: e.target.value
                        })}
                        rows={4}
                      />
                    </div>
                    {/* <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editableData.orgEmails}
                        onChange={(e) => setEditableData({
                          ...editableData,
                          orgEmails: e.target.value
                        })}
                      />
                    </div> */}
                    <div className="mb-3">
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        value={editableData.orgWebsite}
                        onChange={(e) => setEditableData({
                          ...editableData,
                          orgWebsite: e.target.value
                        })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Facebook</label>
                      <input
                        type="url"
                        className="form-control"
                        value={editableData.orgFacebook}
                        onChange={(e) => setEditableData({
                          ...editableData,
                          orgFacebook: e.target.value
                        })}
                      />
                    </div>
                    <div className="mt-3">
                      <button 
                        className="btn btn-primary me-2"
                        onClick={handleUpdateOrgInfo}
                      >
                        Save Changes
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                  {/* icos */}
                    <div className="info-item">
                      <FontAwesomeIcon icon={faEnvelope} className="icon" />
                      <span>{orgData?.orgConnectedEmail}</span>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faGlobe} className="icon" />
                      <a href={orgData?.orgWebsite} target="_blank" rel="noopener noreferrer">
                        Website
                      </a>
                    </div>
                    <div className="info-item">
                      <FontAwesomeIcon icon={faFacebook} className="icon" />
                      <a href={orgData?.orgFacebook} target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
              
          {/* tab */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => k && setActiveTab(k)}
                  className="mb-0"
                >
                  <Tab eventKey="about" title="About">
                    <div className="p-4">
                      <h4>About the Organization</h4>
                      <p>{orgData?.orgDescription}</p>
                    </div>
                  </Tab>
                  <Tab eventKey="posts" title="Posts" data-testid="posts-tab">
                    <div className="p-4">
                      {isUserAnOrgAdmin && (
                        <button 
                          className="btn btn-primary mb-4"
                          onClick={() => setShowPostModal(true)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-2"/>
                          Create New Post
                        </button>
                      )}
                      <div className="d-flex justify-content-end mb-3">
                        <label className="me-2">Sort:</label>
                        <select 
                          className="form-select me-2" 
                          value={sortCriteria} 
                          onChange={(e) => setSortCriteria(e.target.value as 'alphabet' | 'date')}
                        >
                          <option value="date">Date Created</option>
                          <option value="alphabet">Alphabetically</option>
                        </select>
                        <select 
                          className="form-select" 
                          value={sortOrder} 
                          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        >
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>
                      </div>
                      {loadingPosts ? (
                        <div className="loading-container">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      ) : posts.length === 0 ? (
                        <div className="text-center p-4">
                          <p className="text-muted">No posts yet</p>
                        </div>
                      ) : (
                        <div className="posts-list">
                          {sortPosts(posts).map(post => (
                            <PostCard
                              key={post.id}
                              post={post}
                              isUserAnOrgAdmin={isUserAnOrgAdmin}
                              onEdit={setEditingPost}
                              onDelete={handleDeletePost}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Tab>
                  
                  {/* events */}
                  <Tab eventKey="events" title="Events" data-testid="events-tab">
                    <div className="p-4">
                      {isUserAnOrgAdmin && (
                        <button 
                          className="btn btn-primary mb-4"
                          onClick={() => setShowEventModal(true)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-2"/>
                          Create New Event
                        </button>
                      )}
                      <div className="d-flex justify-content-end mb-3">
                        <label className="me-2">Sort:</label>
                        <select 
                          className="form-select" 
                          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                        >
                          
                          <option value="asc">Ascending</option>
                          <option value="desc">Descending</option>
                        </select>
                      </div>
                      {events.length === 0 ? (
                        <div className="empty-events">
                          <p className="text-muted">No upcoming events</p>
                        </div>
                      ) : (
                        <div className="events-list">
                          {sortEvents(events).map(event => (
                            <EventCard
                              key={event.id}
                              event={event}
                              isUserAnOrgAdmin={isUserAnOrgAdmin}
                              onEdit={setEditingEvent}
                              onDelete={handleDeleteEvent}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
                    
        {/* post */}
        <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input 
                type="text" 
                className="form-control"
                value={newPost.postTitle}
                onChange={(e) => setNewPost({...newPost, postTitle: e.target.value})}
                placeholder='Title'
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea 
                className="form-control"
                rows={5}
                value={newPost.postContent}
                onChange={(e) => setNewPost({...newPost, postContent: e.target.value})}
                placeholder='Content'
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tags (comma separated)</label>
              <input 
                type="text" 
                className="form-control"
                value={newPost.postTags?.join(', ')}
                onChange={(e) => setNewPost({
                  ...newPost, 
                  postTags: e.target.value.split(',').map(tag => tag.trim())
                })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label d-block">Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    Promise.all(
                      Array.from(e.target.files).map(file => convertToBase64(file))
                    ).then(base64Images => {
                      setNewPost(prev => ({
                        ...prev,
                        postPictures: [...(prev.postPictures || []), ...base64Images]
                      }));
                    });
                  }
                }}
                className="d-none"
                id="post-image-upload"
              />
              <label htmlFor="post-image-upload" className="btn btn-outline-secondary">
                <FontAwesomeIcon icon={faImage} className="me-2" />
                {isUploading ? 'Uploading...' : 'Add Images'}
              </label>
              {newPost.postPictures && newPost.postPictures.length > 0 && (
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {newPost.postPictures.map((img, index) => (
                    <div key={index} className="position-relative">
                      <img 
                        src={img} 
                        alt={`Upload preview ${index + 1}`} 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <button 
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => setNewPost({
                          ...newPost,
                          postPictures: newPost.postPictures?.filter((_, i) => i !== index)
                        })}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowPostModal(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleCreatePost}
              data-testid="create-post-button"
            >
              Create Post
            </button>
          </Modal.Footer>
        </Modal>

        {/* edit post */}
        <Modal 
          show={editingPost !== null} 
          onHide={() => setEditingPost(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingPost && (
              <>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingPost.postTitle}
                    data-testid="edit-post-title"
                    onChange={(e) => setEditingPost({
                      ...editingPost,
                      postTitle: e.target.value
                    })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={editingPost.postContent}
                    data-testid="edit-post-content"
                    onChange={(e) => setEditingPost({
                      ...editingPost,
                      postContent: e.target.value
                    })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingPost.postTags.join(', ')}
                    onChange={(e) => setEditingPost({
                      ...editingPost,
                      postTags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label d-block">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Promise.all(
                          Array.from(e.target.files).map(file => convertToBase64(file))
                        ).then(base64Images => {
                          setEditingPost(prev => ({
                            ...prev!,
                            postPictures: [...(prev!.postPictures || []), ...base64Images]
                          }));
                        });
                      }
                    }}
                    className="d-none"
                    id="edit-post-image-upload"
                  />
                  <label htmlFor="edit-post-image-upload" className="btn btn-outline-secondary">
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    {isUploading ? 'Uploading...' : 'Add Images'}
                  </label>
                  {editingPost.postPictures && editingPost.postPictures.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {editingPost.postPictures.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img 
                            src={img} 
                            alt={`Upload preview ${index + 1}`} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <button 
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => setEditingPost(prev => ({
                              ...prev!,
                              postPictures: prev!.postPictures.filter((_, i) => i !== index)
                            }))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button 
              className="btn btn-secondary"
              onClick={() => setEditingPost(null)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => editingPost && handleEditPost(editingPost)}
              data-testid="save-changes-post"
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
        
        {/* event modal */}
        <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input 
              type="text" 
              className="form-control"
              value={newEvent.eventName}
              onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
              placeholder="Name"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea 
              className="form-control"
              rows={5}
              value={newEvent.eventDescription}
              onChange={(e) => setNewEvent({...newEvent, eventDescription: e.target.value})}
              placeholder="Describe your event..."
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input 
              type="text" 
              className="form-control"
              value={newEvent.eventLocation}
              onChange={(e) => setNewEvent({...newEvent, eventLocation: e.target.value})}
              placeholder="Event location"
            />
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Date</label>
              <input 
                type="date" 
                className="form-control"
                value={newEvent.eventDate}
                onChange={(e) => setNewEvent({...newEvent, eventDate: e.target.value})}
                data-testid="input-date"
              />
            </div>
            <div className="col">
              <label className="form-label">Time</label>
              <input 
                type="time" 
                className="form-control"
                value={newEvent.eventTime}
                onChange={(e) => setNewEvent({...newEvent, eventTime: e.target.value})}
                data-testid="input-time"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Tags (comma separated)</label>
            <input 
              type="text" 
              className="form-control"
              value={newEvent.eventTags?.join(', ')}
              onChange={(e) => setNewEvent({
                ...newEvent, 
                eventTags: e.target.value.split(',').map(tag => tag.trim())
              })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label d-block">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  Promise.all(
                    Array.from(e.target.files).map(file => convertToBase64(file))
                  ).then(base64Images => {
                    setNewEvent(prev => ({
                      ...prev,
                      eventPictures: [...(prev.eventPictures || []), ...base64Images]
                    }));
                  });
                }
              }}
              className="d-none"
              id="event-image-upload"
            />
            <label htmlFor="event-image-upload" className="btn btn-outline-secondary">
              <FontAwesomeIcon icon={faImage} className="me-2" />
              {isUploading ? 'Uploading...' : 'Add Images'}
            </label>
            {newEvent.eventPictures && newEvent.eventPictures.length > 0 && (
              <div className="mt-2 d-flex flex-wrap gap-2">
                {newEvent.eventPictures.map((img, index) => (
                  <div key={index} className="position-relative">
                    <img 
                      src={img} 
                      alt={`Upload preview ${index + 1}`} 
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <button 
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      onClick={() => setNewEvent({
                        ...newEvent,
                        eventPictures: newEvent.eventPictures?.filter((_, i) => i !== index)
                      })}
                    >
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowEventModal(false)}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleCreateEvent}
            data-testid="create-event-button"
          >
            Create Event
          </button>
        </Modal.Footer>
      </Modal>

        {/* edit event modal */}
        <Modal 
          show={editingEvent !== null} 
          onHide={() => setEditingEvent(null)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingEvent && (
              <>
                <div className="mb-3">
                  <label className="form-label">Event Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingEvent.eventName}
                    data-testid="edit-event-name"
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      eventName: e.target.value
                    })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    value={editingEvent.eventDescription}
                    data-testid="edit-description"
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      eventDescription: e.target.value
                    })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingEvent.eventLocation}
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      eventLocation: e.target.value
                    })}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editingEvent.eventDate}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        eventDate: e.target.value
                      })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={editingEvent.eventTime}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        eventTime: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingEvent.eventTags.join(', ')}
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      eventTags: e.target.value.split(',').map(tag => tag.trim())
                    })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label d-block">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        Promise.all(
                          Array.from(e.target.files).map(file => convertToBase64(file))
                        ).then(base64Images => {
                          setEditingEvent(prev => ({
                            ...prev!,
                            eventPictures: [...(prev!.eventPictures || []), ...base64Images]
                          }));
                        });
                      }
                    }}
                    className="d-none"
                    id="edit-event-image-upload"
                  />
                  <label htmlFor="edit-event-image-upload" className="btn btn-outline-secondary">
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    {isUploading ? 'Uploading...' : 'Add Images'}
                  </label>
                  {editingEvent.eventPictures && editingEvent.eventPictures.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {editingEvent.eventPictures.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img 
                            src={img} 
                            alt={`Upload preview ${index + 1}`} 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <button 
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => setEditingEvent(prev => ({
                              ...prev!,
                              eventPictures: prev!.eventPictures.filter((_, i) => i !== index)
                            }))}
                          >
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button 
              className="btn btn-secondary"
              onClick={() => setEditingEvent(null)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => editingEvent && handleEditEvent(editingEvent)}
              data-testid="save-changes-event"
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
