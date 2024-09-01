import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // Direct import without destructuring
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const WishList = () => {
  const navigate = useNavigate();
  const [consumerId, setConsumerId] = useState();
  const [wishList, setWishList] = useState([]);
  const [status, setStatus] = useState();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setConsumerId(decodedToken.user._id);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    } else {
      navigate("/login"); // Redirect to login if no token
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (consumerId) {
      const fetchWishlist = async () => {
        try {
          const response = await axios.get(
            `https://ecommerce-gawai-swad.onrender.com/api/fetchwishlist/${consumerId}`
          );
          setWishList(response.data.consumer.wishlist);
          console.log(response.data.consumer.wishlist);
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        }
      };
      fetchWishlist();
    }
  }, [consumerId]);

  const deleteWishlist = async (wid) => {
    try {
      const response = await axios.delete(
        `https://ecommerce-gawai-swad.onrender.com/api/deletewishlist/${wid}`
      );
      setStatus(response.data.message);

      // Update wishlist state after deletion
      setWishList(wishList.filter((item) => item._id !== wid));
    } catch (err) {
      console.error("Failed to delete wishlist item", err);
      setStatus("Failed to delete item");
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-3">Your Wishlist</h2>

      {status && (
        <p className="bg-success text-center text-light rounded-2">{status}</p>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          marginTop: "20px",
        }}
      >
        {wishList.map((w) => (
          <div
            key={w._id} // Changed to use _id which is more appropriate
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "300px",
              margin: "10px",
              padding: "15px",
              textAlign: "center",
              backgroundColor: "#f9f9f9",
              position: "relative", // To better position the delete icon
            }}
          >
            <img
              src="delete.png"
              width="30px"
              onClick={() => deleteWishlist(w._id)}
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "-10px",
                top: "-10px",
              }}
              alt="Delete"
            />
            <div style={{ marginBottom: "10px" }}>
              <img
                src={`${w.productimage}`}
                width="100%"
                alt={w.productname}
                style={{ borderRadius: "8px", cursor: "pointer" }}
              />
            </div>
            <h4 style={{ margin: "10px 0", fontSize: "18px", color: "#333" }}>
              {w.productname}
            </h4>
            <p style={{ color: "#666", fontSize: "16px", margin: "5px 0" }}>
              Price: ${w.productprice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishList;
