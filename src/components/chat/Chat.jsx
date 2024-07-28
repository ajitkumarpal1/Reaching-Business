import React from "react";
import "./chat.css";
import { IoMdSend, IoMdAddCircle, IoMdArrowDropdown } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  serverTimestamp,
  addDoc,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useUserAuth } from "../../context/UserAuthContext";
import "./chat.css";
import dummy from "../../assets/blank-profile-picture-g0e62e6b69_1280.png";
import Loading from "../loading/Loading";

const Chat = () => {
  const [show, setShow] = useState(false);
  const [showfollowers, setShowfollowers] = useState(false);
  const [messages, setMessages] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [memberIn, setMemberIn] = useState([]);
  const [selectGroup, setSelectGroup] = useState(null);
  const [add, setAdded] = useState([]);
  const [groupName, setGroupName] = useState(null);
  const [updateGroupChat, setUpdateGroupChat]  = useState(false);
  const { user } = useUserAuth();
  
  const scroll = useRef();


  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limit(50)
    );  
   const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
  
    return () => unsubscribe; 
  }, []);

  useEffect(() =>{
    getGroups();
  },[user])
  
  useEffect(() =>{
    if(selectGroup !== null) { 
      loadGroupChat();
    }
  },[selectGroup])





  const getUsers = async () => {
    const userRef = collection(db, "users");
    const response = await getDocs(userRef);
    setGroupList(response.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const loadGroupChat = async () =>{
    console.log(selectGroup)
    const docRef = doc(db, "group", selectGroup);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data().messages)
    setMessages(docSnap.data().messages)
    setUpdateGroupChat(true)
  }

  const getGroups = async () => {
    setShow((prevstate) => !prevstate);
    const queryToRetreiveFromField = query(
      collection(db, "group"),
      where("admin", "==", user.email)
    );
    const querySnapshot1 = await getDocs(queryToRetreiveFromField);
    querySnapshot1.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setMemberIn((prevState) => [...prevState, doc.id])
    });

    const queryToRetreiveFromArray = query(
      collection(db, "group"),
      where("members", "array-contains", user.email)
    );
    const querySnapshot2 = await getDocs(queryToRetreiveFromArray);
    querySnapshot2.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setMemberIn((prevState) => [...prevState, doc.id])
    });
  };

  const makeGroup = async () => {
    if (groupName == null || groupName == " ") {
      return alert("enter valid group name");
    }
    const GroupRef = collection(db, "group");
    const Message = {
      text: "Hello guys",
      name: user.displayName,
      avatar: user.photoURL,
      createdAt: Timestamp.now(),
      email: user.email,
    };
    const response = await setDoc(doc(GroupRef, groupName), {
      admin: user.email,
      members: add,
      messages: arrayUnion(Message),
    });
    console.log("group made", response);
    alert("Group is Live")
  };

  return (
    <div className="rb__chat">
      <div className="rb__chat-section">
 
        <div className="rb__chat-header">
         
          <IoMdAddCircle
            size={55}
            cursor="pointer"
            onClick={() => {
              setShowfollowers((prevstate) => !prevstate);
              getUsers();
            }}
          />
          {showfollowers && (
            <>
              <div className="rb__chat-header-group-1">
                <input
                  type="text"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <button onClick={makeGroup}>Make a Group</button>
                <div>
                  {groupList
                    .filter((users) => users.fullname !== user.displayName)
                    .map((users, index) => {
                      return (
                        <div style={{display:"flex", borderBottom:"2px solid hotpink" }}>
                               <h4 key={index}>
                          {users.fullname}
                          <button
                            onClick={() =>
                              setAdded((prevState) => [...prevState, users.id])
                            }
                            style={{ marginLeft:"1rem", alignItems:"center"}}
                          >
                            {" "}
                            Add in Group
                          </button>
                        </h4>
                          </div>
                   
                      );
                    })}
                </div>
              </div>
            </>
          )}
           <h3 style={{margin:"auto", fontSize:"30px", fontWeight:"500"}}>{selectGroup === null ? "GlobalChat" : selectGroup}</h3>
          <div className="">
            <IoMdArrowDropdown size={55} cursor="pointer" onClick={() => setShow((prevState) => !prevState)}/>
            {show && (
              <>
                <div className="rb__chat-header-group-2">
                   {memberIn?.map((group, index) =>{
                    return(
                      <button key={index} onClick={() => { setSelectGroup(group) }} >{group}</button>
                    )
                   })}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="rb__chat-body">
          <div className="rb_chat-body_content">
            {!updateGroupChat && 
                messages?.map((message) => (
                  <Message key={message.id} message={message} />
                ))
            }{updateGroupChat &&
              messages?.map((message) => (
                <GroupChatting  key={message.id} message={message} selectedGroup={selectGroup} />
              ))
            }
          </div>
          <span ref={scroll}></span>
          <SendMessage scroll={scroll} changedGroup={selectGroup}/>
        </div>
      </div>
    </div>
  );
};

export default Chat;

export const SendMessage = ({ scroll, changedGroup }) => {
  const [message, setMessage] = useState("");
  const { user } = useUserAuth();
  const [load, setLoad] = useState(false);
  const { email, displayName, photoURL } = user;

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }    
    if(changedGroup != null){
      const groupRef = doc(db, "group", changedGroup);
        const res =  await updateDoc(groupRef, {
          messages:  arrayUnion({
            text: message,
            name: displayName,
            avatar: photoURL,
            createdAt: Timestamp.now(),
            email
          })
        })
        setMessage("");
        scroll.current.scrollIntoView({ behavior: "smooth" });
        return;
    }
    await addDoc(collection(db, "messages"), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: Timestamp.now(),
      email,
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="rb_chat-body_input-box">
     
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          placeholder="type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={(event) => sendMessage(event)}>
          <IoMdSend size={40} />
        </button>
      </div>
    </>
  );
};

export const Message = ({ message }) => {
  const { user } = useUserAuth();
  
  return (
    <> 
      <div
      key={message.id}
        className={`rb_chat-body_content-chatboxes ${
          message.email === user.email ? "right" : ""
        }`}
      >
        <img
          className="chat-bubble__left"
          src={message.avatar === null ? dummy : message.avatar}
          alt="user avatar"
        />
        <div className="chat-bubble__right">
          <p className="user-name">{message.name}</p>
          <p className="user-message">{message.text}</p>
        </div>
      </div>
    </>
  );
};

export const GroupChatting = ({ message ,selectedGroup }) => {
  const { user } = useUserAuth();

  
  return (
    <> 
      <div
        key={message.id}
          className={`rb_chat-body_content-chatboxes ${
            message.email === user.email ? "right" : ""
          }`}
        >
          <img
            className="chat-bubble__left"
            src={message.avatar === null ? dummy : message.avatar}
            alt="user avatar"
          />
          <div className="chat-bubble__right">
            <p className="user-name">{message.name}</p>
            <p className="user-message">{message.text}</p>
          </div>
        </div>

    </>
  );
};

