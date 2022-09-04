import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

let firebaseConfig = {
    apiKey: "AIzaSyA_iVd544Mk7TtqUNO93xDCi7r-tgwiXII",
    authDomain: "sistema-d3c10.firebaseapp.com",
    projectId: "sistema-d3c10",
    storageBucket: "sistema-d3c10.appspot.com",
    messagingSenderId: "448716406331",
    appId: "1:448716406331:web:49ae2e6be1ef8c54e6a61e",
    measurementId: "G-MH67900S95"
};

// if (!firebase.app.length) {
//     firebase.initializeApp(firebaseConfig);
// }

firebase.initializeApp(firebaseConfig);

export default firebase;