import React, { useEffect, useState } from 'react'
import './listproducts.css'
import { useNavigate } from "react-router-dom";
import { ref, getDownloadURL, listAll  } from "firebase/storage"
import { storage } from "../../firebaseConfig";
import Loading from '../loading/Loading';


const Listproducts = (props) => {

  const navigate = useNavigate();
  const [images, setImages] = useState(null)
  useEffect(() =>{
    getImage()
    console.log(props.id)
  },[])

  const getImage = () =>{
    const imagesListRef = ref(storage, `ProductsPics/${props.id}/Primary`);
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
            setImages(url)
        });
      });
    });
  }
 


  return (
    <div className="rb__listproducts">
      <div className="rb__listproducts-products">
        <div className="rb__listproducts-products_cards" 
             onClick={() => {
              navigate(`/Showproduct/${props.id}`); 
              }
              }>
            {images ? 
            <img src={images} />
            : <Loading />
            }
       
          <h3>{props.name}</h3>
        </div>
      </div>
    </div>
  )
}

export default Listproducts