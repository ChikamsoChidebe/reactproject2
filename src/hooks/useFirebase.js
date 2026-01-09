import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInAnon = () => signInAnonymously(auth);

  return { user, loading, signInAnon };
};

export const useFirestore = (collectionName, userId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(
      collection(db, 'users', userId, collectionName),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(items);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, userId]);

  const saveData = async (docId, data) => {
    if (!userId) return;
    await setDoc(doc(db, 'users', userId, collectionName, docId), data);
  };

  return { data, loading, saveData };
};