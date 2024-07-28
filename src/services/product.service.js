import { db } from "../firebaseConfig";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  arrayUnion
} from "firebase/firestore";

const productCollectionRef = collection(db, "product")


class ProductService {



  addProduct = async (newProduct) => {
    const docRef = await addDoc(collection(db, "product"), newProduct).then((res) => {
      return res;
    })
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  }

  updateProdDetail = (id, updatedBook) => {
      const docRef = doc(db, "product", id)
      console.log(updatedBook)
      return updateDoc(docRef, updatedBook)
  };

  uploadComment = async (updatedBook, id) => {
    const postRef = doc(db, "product", id);
    return updateDoc(postRef, {
        ProductComments:  arrayUnion(updatedBook)
    })
  }

  addRating = (id,data) =>{
    const ratingCollectionRef = collection(db, "ratings")
    return addDoc(ratingCollectionRef,{
      productID: id,
      data
    })
  }
  
  getProducts = () => {
    return getDocs(productCollectionRef);
  };

  getDetail = (id) => {
    const bookDoc = doc(productCollectionRef, id);
    return getDoc(bookDoc);
  };

}

export default new ProductService();