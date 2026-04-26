import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';

export type NotificationType = 'streak' | 'lab' | 'employability' | 'inactivity' | 'system';

export interface AppNotification {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: any;
}

/**
 * Adds a new notification to the user's collection
 */
export const addNotification = async (uid: string, type: NotificationType, title: string, message: string) => {
  if (!db || !uid) return;
  try {
    const notificationsRef = collection(db, 'users', uid, 'notifications');
    await addDoc(notificationsRef, {
      type,
      title,
      message,
      read: false,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to add notification:', err);
  }
};

/**
 * Marks all notifications as read for a user
 */
export const markAllAsRead = async (uid: string) => {
  if (!db || !uid) return;
  try {
    const notificationsRef = collection(db, 'users', uid, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));
    const snap = await getDocs(q);
    
    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach((d) => {
      batch.update(d.ref, { read: true });
    });
    await batch.commit();
  } catch (err) {
    console.warn('Failed to mark notifications as read:', err);
  }
};
