import React, { useState } from "react";
import "./forgotpass.css";
import { Login } from "../login/Login";
import image from "../../assets/login.png";
import { useNavigate } from "react-router-dom";
// import { app } from "../../firebaseConfig";
// import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Forgotpass = () => {
  const navigate = useNavigate();
  // const auth = getAuth();

  // const [data, setData] = useState();


  // const handleInput = (event) =>{
  //   let newInput = event.target.value
  //   setData(newInput);
  
  // }

  // const handleSubmit = () => {
  //   console.log(data)
  //   sendPasswordResetEmail(auth, data)
  //   .then((response) => {
  //       console.log(response.user)
  //   })
  //   .catch((err) =>{
  //       alert(err.message)
  //   })
  // }

  
  return (
    <div className="rb__forgot">
      <div className="rb__forgot-image">
        <img src={image} />
      </div>
      <div className="rb__forgot-form_container">
        <h1>Forgot Password ?</h1>
        <input 
          type="text" 
          placeholder="Username or Email" 
          // onChange={handleInput}
          />
        <div className="rb__forgot-form_container-buttons">
          <button
            // onClick={handleSubmit}
          >
            Verify
          </button>
          <button onClick={() => navigate("/")}>Go back</button>
        </div>
        <div className="rb__forgot-forgotpass_container">
          {/* <p>Don't know your password, <a onClick={() => navigate('/Forgotpass')}>click here</a></p> */}
        </div>
      </div>
    </div>
  );
};

export default Forgotpass;
