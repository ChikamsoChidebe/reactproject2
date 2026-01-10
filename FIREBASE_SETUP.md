# Firebase Setup Instructions

## 1. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it "love-eagles-planner"
4. Enable Google Analytics (optional)

## 2. Setup Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select your preferred location

## 3. Setup Authentication
1. Go to "Authentication" in Firebase Console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" authentication
5. Add your authorized domains

## 4. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>)
4. Register your app as "Love Eagles Planner"
5. Copy the firebaseConfig object

## 5. Update Configuration
Replace the placeholder values in `src/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 6. Test the Integration
1. Run `npm run dev`
2. Click "Start Using App" 
3. Add some tasks/goals
4. Check Firebase Console to see data syncing

## Features Now Available:
✅ Google authentication
✅ Real-time data sync
✅ Cloud storage for tasks, goals, assignments
✅ Auto-save drafts while typing
✅ Quiz generator with scoring
✅ Streak tracking
✅ Shared workspace
✅ Cross-device access

## Next Steps:
- Add user profiles
- Implement collaborative features
- Add offline support
- Deploy to Firebase Hosting