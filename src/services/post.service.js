import { db } from "../firebaseConfig";

import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    doc,
    setDoc,
    query, orderBy, startAt, limit,
    arrayUnion
} from "firebase/firestore";




class PostService {



    addpost = async (newpost) => {
        const docRef = await addDoc(collection(db, "post"), newpost).then((res) => {
            return res;
        })
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    }

    uploadImgPath = async (updatedBook, id) => {
        const postRef = doc(db, "post", id);
        console.log(updatedBook)
        await updateDoc(postRef, {
            PostImages: updatedBook
        });
    }

    uploadComment = async (updatedBook, id) => {
        const postRef = doc(db, "post", id);
        return updateDoc(postRef, {
            PostComments:  arrayUnion(updatedBook)
        })
    }

    getPostContent = (id) => {
        const docRef = doc(db, "post", id);
        return getDoc(docRef);
    }

    getAllPosts = () => {
        return getDocs(collection(db, "post"));
    };

    getRecentPosts = () => {
        const postsRef = collection(db, "post");
        const first = query(postsRef, orderBy("PostHeading"), startAt(1), limit(10));
        return getDocs(first);
    };

}

export default new PostService();