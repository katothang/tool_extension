console.log("start firebase");
const firebaseConfig = {
  apiKey: "AIzaSyB7DAMYuT_ynhCeR4eDQuVs7EbWKaOKnYI",
  authDomain: "hocthi-7a94b.firebaseapp.com",
  projectId: "hocthi-7a94b",
  storageBucket: "hocthi-7a94b.appspot.com",
  messagingSenderId: "455042665776",
  appId: "1:455042665776:web:1bcade187a0937e9b70cf5",
  measurementId: "G-JHHHE9TSDK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

