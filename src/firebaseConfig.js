import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCKTXgnoI8z4auInHmpM1I0dsg-O3t7JpM",
  authDomain: "reaching-buisness-f5eb0.firebaseapp.com",
  projectId: "reaching-buisness-f5eb0",
  storageBucket: "reaching-buisness-f5eb0.appspot.com",
  messagingSenderId: "257044876608",
  appId: "1:257044876608:web:7aad4b0c039fe633a1fea5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app)
export default app;