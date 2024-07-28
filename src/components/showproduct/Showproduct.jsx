import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./showproduct.css";
import { MdOutlineStar, MdOutlineStarOutline, MdClose } from "react-icons/md";
import {
  query,
  collection,
  onSnapshot,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import Loading from "../loading/Loading";
import { useState } from "react";
import dummy from "../../assets/blank-profile-picture-g0e62e6b69_1280.png";
import ProductService from "../../services/product.service";
import { useUserAuth } from "../../context/UserAuthContext";

const Showproduct = (props) => {
  const { user } = useUserAuth();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [comment, setComment] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [rating, setRating]= useState(null)
  const [totalRating, setTotalRating] = useState();
  const [users, setUsers] = useState();


  useEffect(() => {
    getProductDetail();
    getImage();
    if(data !== undefined ) { 
      setCommentList(data.ProductComments)
    }
  }, [data]);

  useEffect(() =>{
    if( rating !== null) addRating();
  },[rating])

  useEffect(() =>{
    getRating();
    getAllUsers();
  },[id])

  const getRating = () =>{
    const ratingRef = collection(db, "ratings");
    const q = query(ratingRef, where("productID", "==", id));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages)
      setTotalRating(messages.length)
    });
  
    return () => unsubscribe; 
  }

  const getAllUsers = async() =>{
    const userRef = collection(db, "users");
    const res = await getDocs(userRef);
    console.log(res.docs )
    setUsers(res.docs.length)
  }

  const handleRatingChange = e =>{
    setRating(e.target.value)
  }

  const addRating = async() =>{
    try {
      const data = {
        ratedBy: user.email,
        Rating: rating
      }
      const res = await ProductService.addRating(id,data);
      console.log(res);
    } catch (error) {
      console.log(error)
    }
  }

  const getProductDetail = async () => {
    try {
      const response = await ProductService.getDetail(id);
      setData(response.data());
    } catch (error) {
      console.log(error);
    }
  };


  const getImage = () => {
    const imagesListRef = ref(storage, `ProductsPics/${id}/Primary`);
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImage(url);
        });
      });
    });
  };

  const getOtherImages = () => {
    const imagesListRef = ref(storage, `ProductsPics/${id}/Secondary`);
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImages((images) => [...images, url]);
        });
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
      const promise = await ProductService.uploadComment(newComment, id);
      console.log(promise);
      setComment('')
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="rb__showproduct">
      {load && (
        <>
          <div className="rb__showproduct-popup scale-up-center">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                width: "fit-content",
              }}
            >
              <MdClose
                cursor="pointer"
                size={40}
                onClick={() => setLoad(false)}
              />
            </div>
            {images.map((item, index) => {
              return <img key={index} src={item} />;
            })}
          </div>
        </>
      )}

      <div className="rb__showproduct-card">
        <img src={image} />

        <div className="rb__showproduct-card_content">
          <h3>{data.ProductName}</h3>
          <p>{data.ProductsDetails}</p>
          <div className="rate">
            <input type="radio" id="star5" name="rate" value="5"  checked={rating === "5"} onChange={handleRatingChange}  />
            <label htmlFor="star5" title="text"></label>
            <input type="radio" id="star4" name="rate" value="4"  checked={rating === "4"}  onChange={handleRatingChange} />
            <label htmlFor="star4" title="text"></label>
            <input type="radio" id="star3" name="rate" value="3" checked={rating === "3"}  onChange={handleRatingChange}  />
            <label htmlFor="star3" title="text"></label>
            <input type="radio" id="star2" name="rate" value="2" checked={rating === "2"}   onChange={handleRatingChange} />
            <label htmlFor="star2" title="text"></label>
            <input type="radio" id="star1" name ="rate" value="1"  checked={rating === "1"} onChange={handleRatingChange}  />
            <label htmlFor="star1" title="text"></label>
          </div>
          <h3>Ratings: {(totalRating/users) * 100}%</h3>
          <button
            onClick={() => {
              setLoad(true);
              getOtherImages();
            }}
          >
            More Images
          </button>
        </div>
      </div>
      <div className="rb__showproduct-comment">
        {commentList === "" || commentList === undefined ? (
          <Loading />
        ) : (
          <>
            {commentList.map((item, index) => {
              return (
                <div className="rb__showproduct-comment_container" key={index}> 
                  <img src={dummy} alt="" className="src" />
                  <div className="rb__showproduct-comment-containe_comment">
                    <h4>{item.CommenterName}</h4>
                    <p>{item.CommenterComment}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}

       { !commentList && <h3>No Comment</h3>}
        <div className="rb__showproduct-comment_box">
        {user.photoURL === null && <img src={dummy} alt="userImage" />}
        {user.photoURL !== null && <img src={user.photoURL} alt="Image" />}
        <h4>{user.displayName}</h4>
          <input
            type="text"
            placeholder="comment"
            onChange={(event) => setComment(event.target.value)}
            className='"rb__showproduct-comment_box-input'
          />
          {loading ? (
            <Loading />
          ) : (
            <button onClick={handleComment}>Post</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Showproduct;
