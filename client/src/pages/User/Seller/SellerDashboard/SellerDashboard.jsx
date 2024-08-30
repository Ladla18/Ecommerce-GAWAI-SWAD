import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const [sellerDashboard, setSellerDashboard] = useState(null); // Use null initially
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ecommerce-gawai-swad.onrender.com/api/sellerdashboard",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response.data);
        setSellerDashboard(response.data); // Set the data received from the API
      } catch (err) {
        console.log(err);
        navigate("/login"); // Navigate to login on error
      }
    };

    fetchData();
  }, [navigate]);

  // Conditional rendering to ensure `sellerDashboard` and its nested properties are defined
  if (!sellerDashboard || !sellerDashboard.seller) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Welcome Seller: {sellerDashboard.seller.sellername}</h1>
      <Outlet/>
    </div>
  );
};

export default SellerDashboard;
