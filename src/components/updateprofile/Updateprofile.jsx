import React, { useEffect, useRef, useState } from "react";
import "./updateprofile.css";
import dummy from "../../assets/blank-profile-picture-g0e62e6b69_1280.png";
import UpdateProfileService from "../../services/update.service";
import { useUserAuth } from "../../context/UserAuthContext";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";
import Loading from "../loading/Loading";
import { storage } from "../../firebaseConfig";

const Updateprofile = () => {
  const [data, setData] = useState();
  const [loading, setloading] = useState(true);
  const [preview, setPreview] = useState({ preview: "", raw: "" });
  const uploading = useRef(null);

  const { user } = useUserAuth();

  useEffect(() => {
    getUserDetails();
  }, [user]);

  useEffect(() => {
    if (data === undefined) setloading(true);
    else setloading(false);
    console.log(data);
  }, [data]);

  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setData({ ...data, ...newInput });
  };

  const handleImg = (e) => {
    if (e.target.files.length) {
      setPreview({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleUploadImage = () => {
    console.log(preview.raw);
    if(preview.raw === "") {
      alert("please add valid image") 
    return;}
    const storageRef = ref(storage, "ProfilePics/" + preview.raw.name);
    const uploadTask = uploadBytesResumable(storageRef, preview.raw, preview.raw.type);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploading.current.value = progress;
        console.log("Upload is " + progress + "% done");

      },
      (error) => {

        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;
          case "storage/unknown":
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
          console.log("File available at", downloadURL);
          const res = await UpdateProfileService.updateUser(user.email, {
            profilePic: downloadURL
          })
          console.log(res);
        });
      }
    );
  };

  const handleUploadUserDetail = async () => {
    try {
      var input = await UpdateProfileService.updateUser(user.email, data);
      console.log(input);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await UpdateProfileService.getUserDetails(user.email);
      setData({ ...data, ...res.data() });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rb__updateprofile">
      {loading && <Loading />}
      {!loading && (
        <>
          <div className="rb__updateprofile-bio">
            <label htmlFor="upload-button">
              {data.profilePic === null ? (
                preview.preview === "" ? (
                  <img src={dummy} alt="Image" />
                ) : (
                  <img src={preview.preview} alt="userImage" />
                )
              ) : preview.preview === "" ? (
                <img src={data.profilePic} alt="UserImage" />
              ) : (
                <img src={preview.preview} alt="userImage" />
              )}
            </label>
            <input
              type="file"
              id="upload-button"
              style={{ display: "none" }}
              onChange={handleImg}
            />
            <div className="rb__updateprofile-bio_container">
              <h3>{data.fullname}</h3>
              <h4>
                {data.comp_name === null ? "Company Name" : data.comp_name}
              </h4>
              <h4>{data.userType}</h4>
              <button onClick={handleUploadImage}> Upload Image</button>
            </div>
          </div>
          <div className="rb__updateprofile-container">
            <h4>Full Name</h4>
            <input
              type="text"
              name="fullname"
              placeholder={data.fullname}
              onChange={(event) => handleInput(event)}
            />
            <h4>Company Name</h4>
            <input
              type="text"
              name="comp_name"
              placeholder={data.company || "Company_Name"}
              onChange={(event) => handleInput(event)}
            />
            <h4>Email</h4>
            <input type="text" name="email" placeholder={data.email} />
            <h4>Contact No</h4>
            <input
              type="text"
              name="contact"
              placeholder={data.contact}
              onChange={(event) => handleInput(event)}
            />
            <h4>Address</h4>
            <input
              type="text"
              name="address"
              placeholder="Name"
              onChange={(event) => handleInput(event)}
            />
            =<h4>City</h4>
            <input type="text" placeholder="City" />
            <h4>State</h4>
            <input type="text" placeholder="State" />
            <h4>Country</h4>
            <input
              type="text"
              name="country"
              placeholder="Country"
              onChange={(event) => handleInput(event)}
            />
          </div>
        </>
      )}
      <button onClick={handleUploadUserDetail}> Update</button>
    </div>
  );
};

export default Updateprofile;
