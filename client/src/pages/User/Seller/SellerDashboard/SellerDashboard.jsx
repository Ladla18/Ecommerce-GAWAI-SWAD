import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  marginTop: "50px",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  maxWidth: "800px",
  margin: "50px auto",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#333",
};

const statStyle = {
  fontSize: "18px",
  color: "#555",
  margin: "10px 0",
};

const loaderContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

const spinnerStyle = {
  border: "8px solid rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  borderTop: "8px solid #3498db",
  width: "60px",
  height: "60px",
  animation: "spin 1.5s linear infinite",
};

const SellerDashboard = () => {
  const [sellerDashboard, setSellerDashboard] = useState(null);
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
        setSellerDashboard(response.data);
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  if (!sellerDashboard) {
    return (
      <div style={loaderContainerStyle}>
        <div style={spinnerStyle}></div>
        <p>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const { seller } = sellerDashboard;
  if (!seller) {
    return (
      <div style={loaderContainerStyle}>
        <div style={spinnerStyle}></div>
        <p>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome Seller: {seller.sellername}</h1>
      <h3 style={statStyle}>Total Products: {seller.sellerproducts.length}</h3>
      <h3 style={statStyle}>Orders Received: {seller.orders.length}</h3>
      <h3 style={statStyle}>Total Tickets Raised: {seller.tickets.length}</h3>
    </div>
  );
};

export default SellerDashboard;
