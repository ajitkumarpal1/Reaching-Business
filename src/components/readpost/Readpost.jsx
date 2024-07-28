import React, { useEffect, useRef, useState } from "react";
import "./readpost.css";
import image from "../../assets/post3.png";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import dummy from "../../assets/blank-profile-picture-g0e62e6b69_1280.png"
import PostService from "../../services/post.service";
import { useUserAuth } from "../../context/UserAuthContext";

const Readpost = () => {
  const { user } = useUserAuth();
  const { id } = useParams();
  const [images, setImages] = useState(null);
  const [content, setContent] = useState({});
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    console.log(user);
    getPostContent();
    getImage();
 
    if(content !== undefined ) { 
      setCommentList(content.comment)
    }
    
  }, [content]);

  const getImage = () => {
    const imagesListRef = ref(storage, `PostPics/${id}`);
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImages(url);
        });
      });
    });
  };

  const getPostContent = async () => {
    PostService.getPostContent(id).then((res) => {
      console.log(res.data());
      setContent({
        title: res.data().PostHeading,
        paragraph: res.data().PostContent,
        likes: res.data().likes,
        creator: res.data().PostCreator,
        comment: res.data().PostComments,
      });
  
    });
  };




  const handleComment = async () => {
    const newComment = {
      CommenterName: user.displayName,
      CommenterEmail: user.email,
      CommenterComment: comment,
    };
    console.log(newComment);
    try {
      const promise = await PostService.uploadComment(newComment, id);
      console.log(promise);
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rb__readpost">
      <div className="rb__readpost-header">
        <div className="rb__readpost-header_container">
          <h1>{content.title}</h1>
          <p>
            People’s quest for creating websites has easily taken us to a new
            era of site development. Where, with the availability of robust page
            building tools, creating websites has become a lot more fun
            (especially for non-developers).
          </p>
          <div className="rb__readpost-header_container-author">
            <p>BY</p>
            <h4>{content.creator}</h4>
          </div>
        </div>
      </div>
      <div className="rb__readpost-content">
        <div className="rb__readpost-content_container">
          <div className="rb__readpost-content_container-post">
            <img src={images} />
            <p>{content.paragraph}</p>
            <div className="rb__readpost-content_container-post-buttons">
          
            </div>
          </div>
        </div>
      </div>
      {/* <div> 
      <span className='divider'></span>
      </div> */}
      {commentList === undefined || commentList === "" ?
        <h1>Loading Comments</h1>
        :
        <>
          {commentList.map((item) => {
        return (
          <div className="rb__showproduct-comment">
            <div className="rb__showproduct-comment_container">
              <img src={dummy} alt="" className="src" />
              <div className="rb__showproduct-comment-containe_comment">
                <h4>{item.CommenterName}</h4>
                <p>{item.CommenterComment}</p>
              </div>
            </div>
          </div>
        );
      })}
        </>
      }
    

      <div className="rb__readpost-content_author-container">
        {user.photoURL === null && <img src={dummy} />}
        {user.photoURL !== null && <img src={user.photoURL} />}
        <h4>{user.displayName}</h4>
        <div className="rb__readpost-content_author-container_comment">
          <h4>Comment</h4>
          <input
            type="text"
            placeholder="comment"
            onChange={(event) => setComment(event.target.value)}
          />
          <button onClick={handleComment}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default Readpost;
