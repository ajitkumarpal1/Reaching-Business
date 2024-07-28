import React, {useEffect, useState} from "react";
import "./posts.css";
import image from "../../assets/post3.png";
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL, listAll  } from "firebase/storage"
import { storage } from "../../firebaseConfig";
import Loading from '../loading/Loading';


const Posts = (props) => {
  const navigate = useNavigate();
  const[images, setImages] = useState(null)

  useEffect(() =>{
    getImage();
  },[])
  const getImage = () =>{
    const imagesListRef = ref(storage, `PostPics/${props.id}`);
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
            setImages(url)
        });
      });
    });
  }
 

  return (
    <>

      {/* // react-dom.development.js:86 Warning: Cannot update a component (`BrowserRouter`) while rendering a different component (`Posts`). To locate the bad setState() call inside `Posts`, follow the stack trace as described in
           // had this prob while rendering the posts component doing 
            makiing arrow funtion for navigation in OnCLick helped
           */}
     
      <div className="rb__posts" onClick={()=>navigate(`/Readpost/${props.id}`)} >
        <div className="rb__posts-container_content" >
          <div className="rb__posts-container_content-author">
            <p>BY</p> <h5>{props.author}</h5>
          </div> 
          <div className="rb__posts-container_content-title">
            <h2>{props.title}</h2>
          </div>
          <div className="rb__posts-container_content-content">
            <p>
              {props.content}
            </p>
          </div>
        </div>
        <div className="rb__posts-image">
          {/* Giving problem <img src={props.img} alt='posts-img' /> */}
          {images ? 
          
            <img src={images} alt="posts-images" />
            : <Loading />
            }
        </div>
      </div>
    </>
  );
};

export default Posts;
