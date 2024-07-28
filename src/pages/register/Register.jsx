import React from "react";
import "./register.css";
import image from "../../assets/login.png";
import { useState } from "react";

import { CgDanger } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
import UpdateProfileService from "../../services/update.service";

const Register = ({getUserId}) => {

  const navigate = useNavigate();
  const [data, setData] = useState({});
  const { signUp, user } = useUserAuth();
  const [error, setError] = useState("");

  const handleInput = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setData({ ...data, ...newInput });
  };

  const handleSubmit = async () => {
    setError("");
    const newUser = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        contact: data.contact,
        profilePic: null,
      };
      try {
        // getting doc ID affter creation of it in Firebase
        //sending it to app then to Homepage
        const   id   =  await UpdateProfileService.addUser(data.email,newUser);
        console.log(id)
        getUserId(id);
        
      } catch (error) {
        return;
        console.log(error);
        alert("Oops something went wrong");
      }

      setData("");

    try {
      await signUp(data.email, data.password);
   
      navigate("/");
    } catch (error) {
      setError(error);
      alert(error);
    }
  };

  const testList = [
    {
      id: 1,
      title: error,
      // description: 'This is an error toast component',
      backgroundColor: "#d9534f",
      icon: CgDanger,
    },
  ];

  return (
    <div className="rb__register">
      <div className="rb__register-image">
        <img src={image} />
      </div>
      <div className="rb__register-form_container">
        <h1>Register</h1>

        <input
          name="fullname"
          type="text"
          placeholder="Fullname"
          onChange={(event) => handleInput(event)}
        />
        <input
          name="email"
          type="Email"
          placeholder="Email"
          onChange={(event) => handleInput(event)}
        />
        <input
          name="contact"
          type="number"
          placeholder="Contact_no"
          onChange={(event) => handleInput(event)}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={(event) => handleInput(event)}
        />
        <div className="rb__register-form_container-button">
          <button onClick={handleSubmit}>SignUp</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
