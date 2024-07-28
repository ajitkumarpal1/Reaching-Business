import React, { useState } from "react";
import "./editpost.css";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useUserAuth } from "../../context/UserAuthContext";
import PostService from "../../services/post.service";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import Loading from "../loading/Loading"
import { Timestamp } from "firebase/firestore";

const Editpost = () => {
  const [preview, setPreview] = useState({ preview: "", raw: ""});
  const [data, setData] = useState({});
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);

  const handleImg = (e) => {
    if (e.target.files.length) {
      setPreview({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    console.log(newInput);
    setData({ ...data, ...newInput });
  };

  const UploadImage = async (PostID) => {
    // console.log(preview.raw.name)
    if (preview.raw === "") return;

    const imageRef = ref(storage, `PostPics/${PostID}/${preview.raw.name}`);
    //  var url = await uploadBytes(imageRef, preview.raw).then((res) => {
    //     return res;
    //  })
    //  return url.metadata.fullPath;

    uploadBytes(imageRef, preview.raw).then((url) =>
      UploadImagePath(url.metadata.fullPath, PostID)
    );
  };

  const UploadImagePath = async (url,postID) => {
    console.log(url)
    const result = await PostService.uploadImgPath(url,postID);
    console.log(result);
    setLoading(false)
    alert("added successfully")
    setData({})
    setPreview({ preview: "", raw: ""})
  };

  const handleSubmit = async () => {
    setLoading(true);
    const newPost = {
      PostCreator: user.displayName,
      PostCreatorEmail: user.email,
      PostHeading: data.heading,
      PostContent: data.content,
      PostImages: null,
      PostLikes: null,
      createdAt: Timestamp.now()
    };
    PostService.addpost(newPost).then((postID) => UploadImage(postID));
  };

  const UpdatePost = (Imagepath) => {};

  return (
    <div className="rb__post">
      <div className="rb__post-photo">
        <label htmlFor="upload-button">
          {preview.preview ? (
            <img src={preview.preview} />
          ) : (
            <IoIosAddCircleOutline size={200} cursor="pointer" />
          )}
        </label>
        <input
          type="file"
          id="upload-button"
          style={{ display: "none" }}
          onChange={handleImg}
        />
      </div>
      <div className="rb__post-desc">
        <h4>Add details</h4>
        <input
          name="heading"
          type="text"
          placeholder="Heading"
          onChange={(event) => handleInput(event)}
        />
        <textarea
          name="content"
          placeholder="Content"
          onChange={(event) => handleInput(event)}
        />
        {loading ? 
            <Loading />
            :<button onClick={handleSubmit}>Upload</button>

       }
      </div>
    </div>
  );
};

export default Editpost;
