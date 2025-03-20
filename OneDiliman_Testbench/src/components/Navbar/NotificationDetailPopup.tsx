import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
  DocumentData,
  doc,
  updateDoc,
  Timestamp,
  getDocs,
  limit,
  writeBatch
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../FirebaseConfig";
import { useNavigate } from "react-router-dom";
import NotificationDetailPopup from "./NotificationDetailPopup";
import { deleteNotification } from "../FirebaseConnection";
import "./NotificationButton.css";

interface NotificationData extends DocumentData {
  id: string;
  message: string;
  userId: string;
  timestamp: Timestamp;
  read: boolean;
  orgId?: string;
  postId?: string;
}

export default function NotificationButton() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationData | null>(null);
  
  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setNotifications([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    setIsLoading(true);

    const fetchInitialData = async () => {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId),
            limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        
        const notifArray: NotificationData[] = [];
        querySnapshot.forEach(doc => {
            notifArray.push({ id: doc.id, ...doc.data() } as NotificationData);
        });
    };
    
    fetchInitialData();

    const notifQuery = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(
      notifQuery,
      (snapshot) => {
        const notifArray: NotificationData[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as NotificationData[];
        
        notifArray.sort((a, b) => {
          const timeA = a.timestamp?.toDate?.() || new Date(0);
          const timeB = b.timestamp?.toDate?.() || new Date(0);
          return timeB.getTime() - timeA.getTime();
        });
        
        setNotifications(notifArray);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, db]);

  const handleNotificationClick = async (notification: NotificationData, event: React.MouseEvent) => {
    event.stopPropagation();
    
    console.log("Notification clicked:", notification);
    
    await updateDoc(doc(db, "notifications", notification.id), {
    read: true
    });

// console.log("Notification properties:", Object.keys(notification));
    // console.log("Notification values:", {
    // postId: notification.postId,
    // eventId: notification.eventId,
    // orgId: notification.orgId,
    // message: notification.message
    // });
      

    setSelectedNotification(notification);
    setShowPopup(true);
  };
  
  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedNotification(null);
  };

  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  const clearAllNotifications = async (event: React.MouseEvent) => {
    const batch = writeBatch(db);
    notifications.forEach((notif) => {
      const notifRef = doc(db, "notifications", notif.id);
      batch.delete(notifRef);
    });
    try {
      await batch.commit();
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications: ", error);
    }
  };

  const formatTimeAgo = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp || !timestamp.toDate) return "";

    const now = new Date();
    const notifTime = timestamp.toDate();
    const diffInMs = now.getTime() - notifTime.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) {
    return "just now";
    } else if (diffInMins < 60) {
    return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
    return notifTime.toLocaleDateString();
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const markAllAsRead = async (event: React.MouseEvent) => {
    event.stopPropagation(); 
    
    const unreadNotifications = notifications.filter(notif => !notif.read);
    console.log(`Marking ${unreadNotifications.length} notifications as read`);
    
    await Promise.all(
    unreadNotifications.map(notif => 
        updateDoc(doc(db, "notifications", notif.id), { read: true })
    )
    );
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          variant="danger"
          id="dropdown-basic"
          className="custom-dropdown-button no-dropdown-icon notification-bell-btn"
        >
          <FontAwesomeIcon icon={faBell} />
          {getUnreadCount() > 0 && (
            <span className="notification-badge">{getUnreadCount()}</span>
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu className="notification-dropdown-menu">
          <div className="notification-header">
            <h6 className="m-0">Notifications</h6>
            {getUnreadCount() > 0 && (
              <button 
                className="mark-all-read-btn" 
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button 
                className="clear-all-btn" 
                onClick={clearAllNotifications}
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {isLoading ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={(e) => handleNotificationClick(notif, e)}
                >
                  <div className="notification-content">
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-time">
                      {formatTimeAgo(notif.timestamp)}
                    </div>
                  </div>
                  <button 
                    className="delete-notification-btn" 
                    onClick={(e) => handleDeleteNotification(notif.id, e)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
  
      {selectedNotification && (
        <NotificationDetailPopup
          show={showPopup}
          onHide={handlePopupClose}
          itemId={selectedNotification.postId}
          orgId={selectedNotification.orgId}
        />
      )}
    </>
  );
}
