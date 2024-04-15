import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { configStore } from './redux/store';
import reportWebVitals from './reportWebVitals';

// Import the functions you need from the SDKs you need
// import firebase from 'firebase/app';
// import 'firebase/storage';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyAjhuUBLlpY_ZqRWFGocUiMDsec0Q2Y6dI',
//   authDomain: 'imageupload-b10f6.firebaseapp.com',
//   projectId: 'imageupload-b10f6',
//   storageBucket: 'imageupload-b10f6.appspot.com',
//   messagingSenderId: '980822436348',
//   appId: '1:980822436348:web:e2935e4dfe677db80eaa79',
// };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // export const mediaDb = getStorage(app);
// firebase.initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={configStore({})}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
