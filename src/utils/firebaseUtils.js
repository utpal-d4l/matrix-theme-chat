import { signInAnonymously, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseAuth, firebaseAuthProvider, firestoreDb } from "../appInit";

export const isUserAuthenticated = () => {
  return !!firebaseAuth.currentUser;
};

export const getUser = () => {
  const { displayName, email, uid } = firebaseAuth.currentUser || {};
  return {
    displayName: displayName || `user_${uid.substring(0, 6)}`,
    email,
    userId: uid,
  };
};

export const initiateLogin = () => {
  return signInWithPopup(firebaseAuth, firebaseAuthProvider);
};

export const initiateAnonymousLogin = () => {
  return signInAnonymously(firebaseAuth);
};

export const logout = () => {
  return signOut(firebaseAuth);
};

export const addRoom = (roomName = "") => {
  const roomsCollection = collection(firestoreDb, "rooms");
  return addDoc(roomsCollection, {
    name: roomName,
  });
};

export const findRoom = (roomId = "") => {
  const docRef = doc(firestoreDb, "rooms", roomId);
  return getDoc(docRef);
};

export const getMessageQuery = (roomId = "") => {
  return query(
    collection(firestoreDb, `rooms/${roomId}/messages`),
    orderBy("timestamp", "asc")
  );
};

export const addMessage = (
  roomId = "",
  { message = "", timestamp = 0, userId = "", userName = "" } = {}
) => {
  const messagesCollection = collection(
    firestoreDb,
    `rooms/${roomId}/messages`
  );
  return addDoc(messagesCollection, {
    message,
    timestamp,
    userId,
    userName,
  });
};
