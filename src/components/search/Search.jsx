import React, { useEffect, useRef, useState } from "react";
import "./search.css";
import image from "../../assets/post3.png";
import image2 from "../../assets/post4.png";
import Navbar from "../navbar/Navbar";
import { collection } from "firebase/firestore";


const Search = () => {

    const [searchCollection, setSearchCollection] = useState("");
    const [searchText, setSearchText] = useState("")
    const setText = useRef();  
    const setCollection = useRef();
    

    // const search = async () =>{
    //       console.log(setText.current.value)
    //       console.log(searchCollection)
    //       try {
    //         const res = await Searchservice.getUserDetails(searchCollection,setText.current.value);
    //         console.log(res)
    //       } catch (error) {
    //         console.log(error)
    //       }
    // }

    

  return (
    <div className="rb__search">
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <input type="text"  ref={setText} placeholder="Type to Search" onChange={(e) => setSearchText(e.target.value)} />
        <div class="dropdown">
          <button>Select What to Search</button>
          
          <div class="dropdown-content">
            {/* <button onClick={() => {setSearchCollection("users");  search()  }}  >Users</button>
            <button onClick={() => {setSearchCollection("product");  search()  }}  >Product</button>
            <button onClick={() =>{setSearchCollection("post");  search()  }}  >Post</button> */}

          </div>
        </div>
      </div>
      <div className="rb__search-list">
        <div className="rb_search-list_childs">
          <img src={image} />
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
            laborum optio debitis possimus. Iure error, excepturi similique iste
            vero nihil provident atque? Sit, sed nesciunt?
          </h2>
        </div>
        <div className="rb_search-list_childs">
          <img src={image2} />
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
            laborum optio debitis possimus. Iure error, excepturi similique iste
            vero nihil provident atque? Sit, sed nesciunt?
          </h2>
        </div>
        <div className="rb_search-list_childs">
          <img src={image} />
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
            laborum optio debitis possimus. Iure error, excepturi similique iste
            vero nihil provident atque? Sit, sed nesciunt?
          </h2>
        </div>
        <div className="rb_search-list_childs">
          <img src={image} />
          <h2>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium
            laborum optio debitis possimus. Iure error, excepturi similique iste
            vero nihil provident atque? Sit, sed nesciunt?
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Search;
