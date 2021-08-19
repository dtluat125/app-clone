// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
import 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyDafBxtwZKWr8jQ4mp7tFzbNsndSGWz-FA",
  authDomain: "social-page-65f4f.firebaseapp.com",
  projectId: "social-page-65f4f",
  storageBucket: "social-page-65f4f.appspot.com",
  messagingSenderId: "227253633418",
  appId: "1:227253633418:web:1d46615fb865426d084873",
  measurementId: "G-FMQYMFV2HV"
};
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const storage = firebaseApp.storage();
  const db = firebaseApp.firestore();
  const auth = firebase.auth()
  const provider = new firebase.auth.GoogleAuthProvider();

  export {auth, provider, db, storage}