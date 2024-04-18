// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAjhuUBLlpY_ZqRWFGocUiMDsec0Q2Y6dI',
  authDomain: 'imageupload-b10f6.firebaseapp.com',
  projectId: 'imageupload-b10f6',
  storageBucket: 'imageupload-b10f6.appspot.com',
  messagingSenderId: '980822436348',
  appId: '1:980822436348:web:e2935e4dfe677db80eaa79',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
