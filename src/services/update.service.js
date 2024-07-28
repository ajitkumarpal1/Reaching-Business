import { db } from "../firebaseConfig";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  setDoc
} from "firebase/firestore";

const userCollectionRef = collection(db, "users")


class UpdateProfileService {


  // addUser = (newUser) => {
  //   return addDoc(userCollectionRef, newUser)
  // }

  addUser = (Id,newUser) => {
    return setDoc(doc(userCollectionRef, Id), newUser);
  }

  updateUser = (id, updatedBook) => {
    const bookDoc = doc(db, "users", id);
    return updateDoc(bookDoc, updatedBook);
  };

  getAllUsers = () => {
    return getDocs(userCollectionRef);
  };

  getUserDetails = (id) => {
    const bookDoc = doc(userCollectionRef, id);
    return getDoc(bookDoc);
  };


}

export default new UpdateProfileService();