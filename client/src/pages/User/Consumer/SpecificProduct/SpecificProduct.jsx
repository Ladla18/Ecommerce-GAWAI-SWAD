import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./SpecificProduct.css"; // Assuming you will create a CSS file for styling

const SpecificProduct = () => {
  const navigate = useNavigate();
  const { sid, pid } = useParams();
  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState([]);
  const [consumerId, setConsumerId] = useState();
  const [consumerEmail, setConsumerEmail] = useState();
  const [cartMsg, setCartMsg] = useState();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [productReview,setProductReview] = useState([])

  useEffect(() => {
    if (cartMsg) {
      const timer = setTimeout(() => {
        setCartMsg(""); // Clear the status message after 3 seconds
      }, 3000);

      // Clean up the timer when the component unmounts or status changes
      return () => clearTimeout(timer);
    }
    const token = localStorage.getItem("token");

    if (token) {
      // Decode the token to get the payload
      const decodedToken = jwtDecode(token);

      // Access the user ID or other information
      const userId = decodedToken.user._id; // Change 'id' to the actual key used in your JWT payload
      setConsumerId(userId);
      setConsumerEmail(decodedToken.user.consumeremail);
      console.log(decodedToken.user.consumeremail);
      console.log("User ID:", userId);
    } else {
      console.log("No token found in localStorage");
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-gawai-swad.onrender.com/api/specificproductdetail/${sid}/${pid}`
        );
        setProduct(response.data.product);
        setSeller(response.data.seller);
        console.log(response.data.product);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-gawai-swad.onrender.com/api/getreview/${pid}`
        );
        setProductReview(response.data)
        console.log(response.data)
      } catch (e) {
        console.log(e);
      }
    };
    fetchReview()
  }, [cartMsg]);

  const addtocart = async () => {
    try {
      const response = await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/addtocart/${consumerId}/${pid}/${sid}`,
        {
          productname: product.productName,
          productprice: product.productPrice,
          productimage: product.productImage,
          productquantity: 1,
          productid: product._id,
        }
      );
      console.log(response.data.message);
      setCartMsg(response.data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const sendEmail = async () => {
    try {
      const response2 = await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/placesingleorder/${consumerId}/${sid}`,
        product
      ); // Assuming you are sending the item data with the request
      setCartMsg(response2.data.msg);
      let response = await axios.post(
        "https://ecommerce-gawai-swad.onrender.com/api/sendemail",
        {
          email: consumerEmail,
          productname: product.productName,
          productprice: product.productPrice,
          seller: seller.sellername,
          image: product.productImage,
        }
      );

      console.log(response2.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const submitReview = async () => {
    try {
      await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/submitreview/${pid}`,
        {
          consumerId,
          rating,
          review,
        }
      );
      setReview("");
      setRating(0);
      setCartMsg("Thank You For Your Review");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container product-page position-relative">
      {cartMsg ? (
        <div
          style={{
            position: "fixed",
            top: "90vh",
            left: "45vw",
            zIndex: "99",
            transition: "all ease 1s",
          }}
        >
          <p
            className="text-bg-dark p-3 text-center rounded-2"
            style={{ boxShadow: "6px 6px 15px white" }}
          >
            {cartMsg}
          </p>
        </div>
      ) : (
        ""
      )}
      <div className="row product-container">
        <div className="col-md-6 text-center product-image-container">
          <img
            src={`${product.productImage}`}
            className="product-image"
            alt={product.productName}
          />
          <div className="button-group mt-4">
            <button className="btn btn-add-to-cart" onClick={addtocart}>
              Add to Cart
            </button>
            <button className="btn btn-buy-now" onClick={sendEmail}>
              Buy Now
            </button>
          </div>
        </div>
        <div className="col-md-6 product-details">
          <h2 className="product-name">{product.productName}</h2>
          <h4 className="product-price">₹{product.productPrice}</h4>
          <h6 className="product-category">
            Category: {product.productCategory}
          </h6>
          <h5 className="product-seller">Seller: {seller.sellername}</h5>
          <h5 className="product-seller">
            Sizes:{" "}
            {product.sizes &&
              product.sizes.map((element, index) => (
                <span key={index}> {element} </span>
              ))}
          </h5>
          <p className="product-description">
            <span className="fw-bold">Description</span> -{" "}
            {product.productDescription}
          </p>
          <div className="row">
            <div className="col-sm-12">
              <div className="rating" style={{ fontSize: "1.5rem" }}>
                <h2 className="d-inline">Rate Product </h2>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    style={{
                      cursor: "pointer",
                      color: rating >= star ? "#FFD700" : "#e4e5e9",
                      fontSize: "50px",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="form-group mt-3">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Write your review..."
                  value={review}
                  onChange={handleReviewChange}
                  style={{ borderColor: "#ced4da" }}
                ></textarea>
                <>
                  {consumerId ? (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={submitReview}
                    >
                      Submit Review
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger mt-2"
                     
                    >
                      Login Required
                    </button>
                  )}
                </>
              </div>
              <div className="row mt-5">
                <h4>Review & Reviews</h4>
                {productReview.map((pr) => (
                  <div className="col-sm-12 mt-2 border py-2" key={pr._id}>
                    <span className="bg-success text-light p-1 rounded-1">
                      {pr.rating}
                      <span className="text-warning"> &#9733;</span> &nbsp;
                      {pr.reviewText}
                    </span>
                    <p
                      className="text-secondary mt-3"
                      style={{ fontSize: "14px" }}
                    >
                      {" "}
                      {pr.consumerId.consumername} &#10004; Certified Buyer
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificProduct;
