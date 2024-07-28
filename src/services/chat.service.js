import { db } from "../firebaseConfig";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  limit
} from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';





class ChatService {

    addMessage = async (message) =>{
      const result = await addDoc(collection(db, "messages"), {message});
      return result
    }

}

export default new ChatService();