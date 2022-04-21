import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "YPUTAPIKEY",
    authDomain: "nftwhitelistekazi.firebaseapp.com",
    projectId: "nftwhitelistekazi",
    storageBucket: "nftwhitelistekazi.appspot.com",
    messagingSenderId: "533050978935",
    appId: "1:533050978935:web:b7735e03bdf092e48f0c72"
};

firebase.initializeApp(firebaseConfig);
export default firebase;