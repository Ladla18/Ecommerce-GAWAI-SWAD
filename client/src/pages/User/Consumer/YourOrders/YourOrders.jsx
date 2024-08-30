import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // Correct import without curly braces
import { useNavigate } from "react-router-dom";

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [consumerId, setConsumerId] = useState(null);
  const [singleOrders, setSingleOrders] = useState([]);
  document.title = "Your Orders";
const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.user._id;
        setConsumerId(userId);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!consumerId) return;
      try {
        const response = await fetch(
          `http://localhost:3000/api/yourorders/${consumerId}`
        );
        const data = await response.json();
        const sortedOrders = (data.orders || []).sort(
          (a, b) => new Date(b.orderdate) - new Date(a.orderdate)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [consumerId]);

  useEffect(() => {
    const fetchSingleOrders = async () => {
      if (!consumerId) return;
      try {
        const response = await fetch(
          `http://localhost:3000/api/singleorders/${consumerId}`
        );
        const data = await response.json();
        const sortedSingleOrders = (data.orders || []).sort(
          (a, b) => new Date(b.orderdate) - new Date(a.orderdate)
        );
        setSingleOrders(sortedSingleOrders);
      } catch (error) {
        console.error("Failed to fetch single orders:", error);
      }
    };

    fetchSingleOrders();
  }, [consumerId]);

  const tableHeaderStyle = {
    backgroundColor: "#f4f4f4",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
    textAlign: "left",
  };

  const tableCellStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  };

  const orderCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "20px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const headerStyle = {
    textAlign: "center",
    margin: "20px 0",
    fontWeight: "bold",
    fontSize: "28px",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "20px",
  };

  const sectionStyle = {
    flex: "1",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }
  });

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <h2 style={headerStyle}>Your Orders</h2>

      <div style={containerStyle}>
        <div style={sectionStyle}>
          <h3 style={{ textAlign: "center" }}>Cart Orders</h3>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id}>
                {order.orderproduct.length > 0 ? (
                  <div style={orderCardStyle}>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "15px",
                        textAlign: "center",
                      }}
                    >
                      Order ID: {order.orderid}
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        color: "#666",
                        marginBottom: "15px",
                        textAlign: "center",
                      }}
                    >
                      Order Date: {order.orderdate}
                    </div>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginBottom: "15px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Product</th>
                          <th style={tableHeaderStyle}>Quantity</th>
                          <th style={tableHeaderStyle}>Price</th>
                          <th style={tableHeaderStyle}>Total</th>
                          <th style={tableHeaderStyle}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderproduct.map((product) => (
                          <tr key={product._id}>
                            <td style={tableCellStyle}>
                              <img
                                src={`http://localhost:3000/${product.productimage}`}
                                alt={product.productname}
                                style={{
                                  width: "60px",
                                  borderRadius: "4px",
                                  marginRight: "10px",
                                }}
                              />
                              {product.productname}
                            </td>
                            <td style={tableCellStyle}>
                              {product.productquantity}
                            </td>
                            <td style={tableCellStyle}>
                              ₹{product.productprice}
                            </td>
                            <td style={tableCellStyle}>
                              ₹{product.productprice * product.productquantity}
                            </td>
                            <td style={{ ...tableCellStyle, color: "#007BFF" }}>
                              {order.orderstatus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))
          ) : (
            <div>No orders found</div>
          )}
        </div>

        <div style={sectionStyle}>
          <h3 style={{ textAlign: "center" }}>Direct Orders</h3>
          {singleOrders.length > 0 ? (
            singleOrders.map((so) => (
              <div key={so._id}>
                {so.singleorder.length > 0 ? (
                  <div style={orderCardStyle}>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "15px",
                        textAlign: "center",
                      }}
                    >
                      Order ID: {so.orderid} 
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        color: "#666",
                        marginBottom: "15px",
                        textAlign: "center",
                      }}
                    >
                      Order Date: {so.orderdate}
                    </div>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginBottom: "15px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Product</th>
                          <th style={tableHeaderStyle}>Quantity</th>
                          <th style={tableHeaderStyle}>Price</th>
                          <th style={tableHeaderStyle}>Total</th>
                          <th style={tableHeaderStyle}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {so.singleorder.map((sp) => (
                          <tr key={sp._id}>
                            <td style={tableCellStyle}>
                              <img
                                src={`http://localhost:3000/${sp.productImage}`}
                                alt={sp.productName}
                                style={{
                                  width: "60px",
                                  borderRadius: "4px",
                                  marginRight: "10px",
                                }}
                              />
                              {sp.productName}
                            </td>
                            <td style={tableCellStyle}>1</td>
                            <td style={tableCellStyle}>₹{sp.productPrice}</td>
                            <td style={tableCellStyle}>₹{sp.productPrice}</td>
                            <td style={{ ...tableCellStyle, color: "#007BFF" }}>
                              {so.orderstatus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))
          ) : (
            <div>No single orders found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourOrders;
