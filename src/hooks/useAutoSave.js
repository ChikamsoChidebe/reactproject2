import { useEffect, useRef } from 'react';
import { saveDraft, getDraft } from '../firebase';

export const useAutoSave = (userId, type, data, delay = 1000) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!userId || !data) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveDraft(userId, type, data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [userId, type, data, delay]);
};

export const useLoadDraft = (userId, type, setData) => {
  useEffect(() => {
    if (!userId) return;

    const loadDraft = async () => {
      const draft = await getDraft(userId, type);
      if (draft && setData) {
        setData(draft);
      }
    };

    loadDraft();
  }, [userId, type, setData]);
};