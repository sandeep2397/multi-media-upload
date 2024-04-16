// firebase.js
import firebase from 'firebase/app';
import 'firebase/auth'; // Import any Firebase services you'll be using (e.g., authentication, Firestore, storage, etc.)

const firebaseConfig = {
  // Your Firebase configuration object
  apiKey: 'AIzaSyAjhuUBLlpY_ZqRWFGocUiMDsec0Q2Y6dI',
  authDomain: 'imageupload-b10f6.firebaseapp.com',
  projectId: 'imageupload-b10f6',
  storageBucket: 'imageupload-b10f6.appspot.com',
  messagingSenderId: '980822436348',
  appId: '1:980822436348:web:e2935e4dfe677db80eaa79',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
