// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCeOlWRHiwA_gvj71eHK2w1tVjxALeqzb4',
    authDomain: 'fer201mprojectimagedb.firebaseapp.com',
    projectId: 'fer201mprojectimagedb',
    storageBucket: 'fer201mprojectimagedb.appspot.com',
    messagingSenderId: '775032500562',
    appId: '1:775032500562:web:23d0fcdeba8eaa7006ca8b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
