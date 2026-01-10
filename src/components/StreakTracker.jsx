import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const StreakTracker = ({ user }) => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastLoginDate: null,
    totalLogins: 0,
    tasksCompleted: 0,
    totalTimeSpent: 0
  });

  useEffect(() => {
    if (user) {
      loadStreakData();
      updateDailyLogin();
    }
  }, [user]);

  const loadStreakData = async () => {
    if (!user) return;
    
    const docRef = doc(db, 'streaks', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setStreakData(docSnap.data());
    } else {
      // Initialize streak data
      const initialData = {
        currentStreak: 1,
        longestStreak: 1,
        lastLoginDate: new Date().toDateString(),
        totalLogins: 1,
        tasksCompleted: 0,
        totalTimeSpent: 0
      };
      await setDoc(docRef, initialData);
      setStreakData(initialData);
    }
  };

  const updateDailyLogin = async () => {
    if (!user) return;
    
    const today = new Date().toDateString();
    const docRef = doc(db, 'streaks', user.uid);
    
    if (streakData.lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      let newCurrentStreak;
      if (streakData.lastLoginDate === yesterdayStr) {
        // Consecutive day
        newCurrentStreak = streakData.currentStreak + 1;
      } else {
        // Streak broken
        newCurrentStreak = 1;
      }
      
      const updatedData = {
        ...streakData,
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(streakData.longestStreak, newCurrentStreak),
        lastLoginDate: today,
        totalLogins: streakData.totalLogins + 1
      };
      
      await updateDoc(docRef, updatedData);
      setStreakData(updatedData);
    }
  };

  const updateTaskCompleted = async () => {
    if (!user) return;
    
    const updatedData = {
      ...streakData,
      tasksCompleted: streakData.tasksCompleted + 1
    };
    
    await updateDoc(doc(db, 'streaks', user.uid), updatedData);
    setStreakData(updatedData);
  };

  const updateTimeSpent = async (minutes) => {
    if (!user) return;
    
    const updatedData = {
      ...streakData,
      totalTimeSpent: streakData.totalTimeSpent + minutes
    };
    
    await updateDoc(doc(db, 'streaks', user.uid), updatedData);
    setStreakData(updatedData);
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">🔥 Your Streak</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{streakData.currentStreak}</div>
          <div className="text-sm opacity-80">Current Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{streakData.longestStreak}</div>
          <div className="text-sm opacity-80">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{streakData.tasksCompleted}</div>
          <div className="text-sm opacity-80">Tasks Done</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{Math.floor(streakData.totalTimeSpent / 60)}h</div>
          <div className="text-sm opacity-80">Time Spent</div>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;