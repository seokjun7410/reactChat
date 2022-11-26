// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAv8mHG_QLI1pM1hO4QdKd8fP6feFXNasc",
  authDomain: "chat-talk-49f87.firebaseapp.com",
  databaseURL: "https://chat-talk-49f87-default-rtdb.firebaseio.com",
  projectId: "chat-talk-49f87",
  storageBucket: "chat-talk-49f87.appspot.com",
  messagingSenderId: "87928302860",
  appId: "1:87928302860:web:af85a636f4d52831d6ad29",
  measurementId: "G-J0Y6DKP59B",
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//export default app;
firebase.initializeApp(firebaseConfig);
export default firebase;
