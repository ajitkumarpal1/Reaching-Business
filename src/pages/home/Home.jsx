import React, { useEffect, useState } from "react";
import "./home.css";
import {
  Navbar,
  Posts,
  Recentposts,
  Readpost,
  Listproducts,
  Showproduct,
  Search,
  Updateprofile,
  Chat,
  Editpost,
  Footer,
  Editproduct,
} from "../../components";

import { Routes, Route} from "react-router-dom";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import PostService from "../../services/post.service";
import { useUserAuth } from "../../context/UserAuthContext";
import UpdateProfileService from "../../services/update.service";
import ProductService from "../../services/product.service";

const Home = () => {
  const { user } = useUserAuth();
  const [profilepic, setProfilePic] = useState(null)
  const [details, setUserDetails] = useState({})
  



  useEffect(() => {
    if (user.email !== undefined) {
      getDetailHandler();
    }
    console.log(user)
  }, [user]);

  // to get Id of logged in user, using their email, Replacing ID with mail because I cannot access ID after 5 to 6 days attempt
  // maybe you could have used the the uid coming from user object instead of email itself

  const getDetailHandler = async () => {
    try {
      const response = await UpdateProfileService.getUserDetails(user.email);
      const data =  response.data()
      user.displayName = data.fullname
      setUserDetails({...details, data});
      getImage(data.profilePic)
    } catch (error) {
      console.log(error.message);
    }
  
  };

  const getImage = (pic) => {

    if(pic === null) {
       console.log("no image") 
       return 
    } ;

    const imagesListRef = ref(storage, `ProfilePics/${user.email}`);
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          user.photoURL = url;
        });
      });
    });
  };

  return (
    <div className="Main-Layout" >  
      <Navbar  profileImg={details.profilePic} name={user.displayName} />
      <div className="rb__content">
        <Routes>
          <Route path="/*" element={<HomePageContent />} />
          {/* <Route path="/Search" element={<Search  />} /> */}
          <Route path="/ProductPageContent" element={<ProductPageContent />} />
          <Route path="/Updateprofile" element={<Updateprofile />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Showproduct/:id" element={<Showproduct />} />
          <Route path="/Readpost/:id" element={<Readpost />} />
          <Route path="/Editproduct" element={<Editproduct />} />
          <Route path="/Editpost" element={<Editpost />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Home;







export const HomePageContent = () => {
  const [read, setRead] = useState(false);
  const [posts, setPosts] = useState([]);


  
  useEffect(() => {
    getAllContent();
  }, []);

  const toggleReadpost = () => {
    setRead((prevstate) => !prevstate);
  };

  const getAllContent = async () => {
    const data = await PostService.getAllPosts();
    console.log(data.docs);
    setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  

  return (
    <>
      <div className="rb__Homepage-content">
        <div className="rb__Homepage-content_cards">
          {posts.map((item, index) => {
            return (
              <Posts
                key={index}
                id={item.id}
                img={item.PostImages}
                author={item.PostCreator}
                title={item.PostHeading}
                content={item.PostContent}
              />
            );
          })}
        </div>
        <div className="">
            <Recentposts className="rb__content-recentposts-section" />
        </div>
      </div>
    </>
  );
};







export const ProductPageContent = () => {
  const [show, setShow] = useState(2);
  const [readProduct, setReadProduct] = useState(false);
  const [scroll, setScroll] = useState(2);

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // promise in useffect
    getAllProducts();
    
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await ProductService.getProducts();
      console.log(response.docs)
      setProductList(
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleReadproduct = () => {
    setReadProduct((prevstate) => !prevstate);
  };

  // .slice(0, show)

  const listOfProduct = productList.map((doc, index) => {
    return (
      <Listproducts
        key={index}
        id={doc.id}
        image={doc.ProductMainImage}
        name={doc.ProductName}
        secondaryImages={doc.ProductSecondaryImages}
        handleProductClick={toggleReadproduct}
      />
    );
  });

  const showMore = () => {
    if (show <= scroll) {
      setShow((prevstate) => prevstate + 2);
      document.getElementById("container").scrollLeft += 200;
      setScroll([(prevstate) => prevstate + 3]);
    }
  };

  return <div className="rb__products">{listOfProduct}</div>;
};
