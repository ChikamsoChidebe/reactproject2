import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBbO0dAcWXXyv6gJ52ChS9lVIs8tStcZcQ",
  authDomain: "love-eagles-planner-67d3e.firebaseapp.com",
  projectId: "love-eagles-planner-67d3e",
  storageBucket: "love-eagles-planner-67d3e.firebasestorage.app",
  messagingSenderId: "248624976270",
  appId: "1:248624976270:web:9a1b1a7ac28515689cd4df",
  measurementId: "G-XD8LER9NKN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

let signInInProgress = false;

export const signInWithGoogle = async () => {
  if (signInInProgress) return;
  signInInProgress = true;
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    if (error.code !== 'auth/cancelled-popup-request') {
      console.error('Sign in error:', error);
    }
    throw error;
  } finally {
    signInInProgress = false;
  }
};
export const logout = () => signOut(auth);

// Auto-save draft functionality
export const saveDraft = async (userId, type, data) => {
  if (!userId) return;
  await setDoc(doc(db, 'drafts', `${userId}_${type}`), {
    ...data,
    updatedAt: new Date(),
    userId
  });
};

export const getDraft = async (userId, type) => {
  if (!userId) return null;
  const docRef = doc(db, 'drafts', `${userId}_${type}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

// Shared workspace functions
export const saveSharedData = async (type, data, userId) => {
  await addDoc(collection(db, 'shared', type, 'items'), {
    ...data,
    createdBy: userId,
    createdAt: new Date(),
    sharedWith: ['uche_nora', 'chikamso_chidebe'] // Replace with actual user IDs
  });
};

export const getUserData = async (userId, collection) => {
  const q = query(
    collection(db, collection),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
};