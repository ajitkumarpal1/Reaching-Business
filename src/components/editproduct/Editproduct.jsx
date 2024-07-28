import React, { useState, useEffect } from "react";
import "./editproduct.css";
import { useUserAuth } from "../../context/UserAuthContext";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import { v4 } from "uuid";
import ProductService from "../../services/product.service";
import Loading from "../loading/Loading";
import { Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Editproduct = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(false);
  const [loadDetailsCont, setLoadDetailsCont] = useState(false);
  const [productid, setProductid] = useState(null);

  const handleProductDetails = (event) => {
    let newInput = { [event.target.name]: event.target.value };
    setData({ ...data, ...newInput });
  };

  const UploadDetails = async () => {
    setLoading(true);
    const newProduct = {
      ProductOwner: user.displayName,
      ProductName: data.product_name,
      ProductsDetails: data.product_details,
      ProductPrice: data.product_price,
      ProductMrp: data.product_mrp,
      ProductQuantity: data.product_quantity,
      createdAt: Timestamp.now()
    };
    console.log(newProduct);
    const id = await ProductService.addProduct(newProduct).then((res) => {
      return res;
    });
    setProductid(id);
    console.log(productid);
    setLoadDetailsCont(true);
  };

  return (
    <div className="rb__product">
      {loadDetailsCont ? (
        <ProductPhotos productID={productid} />
      ) : (
        <>
          <div className="rb__product-heading">
            <h2>Add Product Details</h2>
          </div>
          <div className="rb__product-desc">
            <div className="rb__product-desc_name">
              <h4>Product Name</h4>
              <input
                type="text"
                name="product_name"
                placeholder="Name"
                onChange={(event) => handleProductDetails(event)}
              />
            </div>
            <div className="rb__product-desc_details">
              <h4>Product Details</h4>
              <textarea
                type="text"
                name="product_details"
                placeholder="Details"
                onChange={(event) => handleProductDetails(event)}
              />
            </div>
            <div className="rb__product-desc_pricing">
              <h4>Product Price</h4>
              <input
                type="text"
                name="product_price"
                placeholder="Price"
                onChange={(event) => handleProductDetails(event)}
              />
              <input
                type="text"
                name="product_mrp"
                placeholder="MRP"
                onChange={(event) => handleProductDetails(event)}
              />
            </div>
            <div className="rb__product-desc_quantity">
              <h4>Product Quantity</h4>
              <input
                type="number"
                name="product_quantity"
                placeholder="10"
                onChange={(event) => handleProductDetails(event)}
              />
            </div>
          </div>
          <div className="rb__product-upload">
            {loading ? (
              <Loading />
            ) : (
              <button onClick={UploadDetails}>Upload</button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Editproduct;





export const ProductPhotos = (props) => {
  const { user } = useUserAuth();
  const [mainImage, setMainImage] = useState(null);
  const [imagesUpload, setImagesUpload] = useState([]);
  const [imagesURLs, setImagesURLs] = useState([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data , setData] =  useState({});
 

  useEffect(() =>{
      console.log(props.productID)
      console.log(imagesURLs)
      console.log(mainImageUrl)
      if(mainImageUrl !== undefined && (imagesURLs.length >= 2)){
        const response = ProductService.updateProdDetail(props.productID, {
          PrimaryImage: mainImageUrl,
          SecondaryImages: imagesURLs
        })
        console.log(response)
        setLoading(false)
        navigate(`/Showproduct/${props.productID}`)
      }
  },[mainImageUrl, imagesURLs])


  const UploadMainImage =  async() =>{
    const imageRef = ref(
      storage,
      `ProductsPics/${props.productID}/Primary/${mainImage.name + v4()}`
    );
    const url = await uploadBytes(imageRef, mainImage).then((res)=> {
        return res.metadata.fullPath;
    })
    setMainImageUrl(url)
  } 

  // For multiple image upload
  const handleImages = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["Id"] = Math.random();
      setImagesUpload((prevState) => [...prevState, newImage]);
    }
  };

  const UploadSecondaryImage = () =>{
    imagesUpload.map((image) => {
          const imageRef = ref(
            storage,
            `ProductsPics/${props.productID}/Secondary/${image.name + v4()}`
          );
          // Important
          uploadBytes(imageRef, image)
              .then((res) => { setImagesURLs((prevState) => [...prevState, res.metadata.fullPath]) });
    });    
  }

  const handleSubmit = async() => {
      setLoading(true)
      UploadMainImage();
      UploadSecondaryImage();
      
  }



  // will divide this component into 2  1st For uploading photos and then uploading description
  return (
    <>
      <div className="rb__product-heading">
        <h2>Add Product Photos</h2>
      </div>
      <div className="rb__product-container">
        <div className="rb__product-photos">
          <h4>Main Image</h4>
          <input
            type="file"
            id="myFile"
            name="filename"
            onChange={(event) => {
              setMainImage(event.target.files[0]);
            }}
          />
          <div className="rb__product-photos_other">
            <h4>Other Images</h4>
            <input
              type="file"
              id="myFile"
              name="-secondary-image1"
              onChange={handleImages}
            />
            <input
              type="file"
              id="myFile"
              name="secondary-image2"
              onChange={handleImages}
            />
            <input
              type="file"
              id="myFile"
              name="secondary-image3"
              onChange={handleImages}
            />
            <input
              type="file"
              id="myFile"
              name="secondary-image4"
              onChange={handleImages}
            />
          </div>
        </div>
      </div>
      <div className="rb__product-upload">
        {loading ? <Loading /> : <button onClick={handleSubmit}>Upload</button>}
      </div>
    </>
  );
};
