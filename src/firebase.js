// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
import 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyCmzK2LdP7LkJNXNnQBJxSTX9EOvnIsV-k",
    authDomain: "chat-app-ba041.firebaseapp.com",
    projectId: "chat-app-ba041",
    storageBucket: "chat-app-ba041.appspot.com",
    messagingSenderId: "410871016552",
    appId: "1:410871016552:web:1ef1149c5824861da5dfdd",
    measurementId: "G-BCB1RKDQ3Q"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const storage = firebaseApp.storage();
  const db = firebaseApp.firestore();
  const auth = firebase.auth()
  const provider = new firebase.auth.GoogleAuthProvider();

  export {auth, provider, db, storage}