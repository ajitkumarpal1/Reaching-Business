import React,{useState, useEffect} from 'react'
import './recentposts.css'
import PostService from "../../services/post.service";
import { useNavigate } from 'react-router-dom';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit
} from "firebase/firestore";
import { db } from "../../firebaseConfig";



const Recentposts = () => {
  const [recent, setRecent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRecentContent();
    console.log(recent)
  }, []);

  const getRecentContent =  async() =>{
    const q = query(
      collection(db, "post"),
      orderBy("createdAt"),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setRecent(messages);
    });
  
    return () => unsubscribe;
    // const data = await PostService.getRecentPosts();
    // console.log(data.docs)
    // setRecent(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

  }



  return (
    <div className='rb__recentpost'>
      <h2>Recentposts</h2>
      <div className='rb__recentpost-list'>
        <div className='rb__recentpost-list_post'>
          {recent.map((item, index) =>{
            return(
              <div className='rb__recentpost-list_post-child' key={item.id} onClick={() => navigate(`/Readpost/${item.id}`)}>
               <h4>By {item.PostCreator}</h4>
              <h3>{item.PostHeading}</h3>
              </ div > 
            )
          })}
        
        </div>
      </div>
    </div>
  )
}

export default Recentposts