import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3ngHhmAHUM_GPdm62-pk7oRFeGKJtZhA",
  authDomain: "secret-gallery-15f94.firebaseapp.com",
  projectId: "secret-gallery-15f94",
  storageBucket: "secret-gallery-15f94.firebasestorage.app",
  messagingSenderId: "960818015088",
  appId: "1:960818015088:web:97d5f7c4c38200a0d1bdb5"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);