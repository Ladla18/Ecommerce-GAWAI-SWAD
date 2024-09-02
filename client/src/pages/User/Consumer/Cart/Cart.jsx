import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./Cart.css";
const Cart = () => {
  const [consumerId, setConsumerId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItem, setTotalItem] = useState(0);
  const [status, setStatus] = useState("");
  const [consumerEmail,setConsumerEmail] = useState()
  const [statusName, setStatusName] = useState("");
  const navigate = useNavigate();
  document.title = "Cart";
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Decode the token to get the payload
      const decodedToken = jwtDecode(token);

      // Access the user ID or other information
      const userId = decodedToken.user._id; // Change 'user._id' to the actual key used in your JWT payload
      setConsumerId(userId);
      setConsumerEmail(decodedToken.user.consumeremail)
      console.log("User ID:", userId);
    }
  }, []); // This effect runs once to set the consumerId

  useEffect(() => {
    if (consumerId) {
      const fetchCartDetails = async () => {
        try {
          const response = await axios.get(
            `https://ecommerce-gawai-swad.onrender.com/api/getcartitem/${consumerId}`
          );
          const filteredItems = response.data.filter((item) => !item.isOrdered);
          setCartItems(filteredItems);
          console.log(response.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchCartDetails();
    }
  }, [consumerId]); // This effect depends on consumerId
  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.productprice * item.productquantity,
      0
    );
    setTotalPrice(total);
    setTotalItem(cartItems.length);
  }, [cartItems]);

  console.log(cartItems);

  const increaseQuantity = async (id, currentQuantity) => {
    const newQuantity = currentQuantity + 1;
    try {
      await axios.post(`https://ecommerce-gawai-swad.onrender.com/api/updatequantity/${id}`, {
        updatedQauntity: newQuantity,
      });

      setCartItems(
        cartItems.map((item) =>
          item._id === id ? { ...item, productquantity: newQuantity } : item
        )
      );
      const total = cartItems.reduce(
        (acc, item) =>
          acc +
          (item._id === id
            ? item.productprice * newQuantity
            : item.productprice * item.productquantity),
        0
      );
      setTotalPrice(total);
      setTotalItem(cartItems.length);
    } catch (err) {
      console.log(err);
    }
  };
  const descreaseQuantity = async (id, currentQuantity) => {
    const newQuantity = currentQuantity - 1;
    try {
      await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/updatequantity/${id}`,
        {
          updatedQauntity: newQuantity,
        }
      );

      setCartItems(
        cartItems.map((item) =>
          item._id === id ? { ...item, productquantity: newQuantity } : item
        )
      );
      const total = cartItems.reduce(
        (acc, item) =>
          acc +
          (item._id === id
            ? item.productprice * newQuantity
            : item.productprice * item.productquantity),
        0
      );
      setTotalPrice(total);
      setTotalItem(cartItems.length);
    } catch (err) {
      console.log(err);
    }
  };


  const handleRemoveItem = async (id) => {
    try {
      const response = await axios.delete(
        `https://ecommerce-gawai-swad.onrender.com/api/deletecartitem/${id}/${consumerId}`
      );
      setStatus(response.data.message);
      setStatusName(response.data.deletedItem);
      setCartItems(cartItems.filter((item) => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/placeorders/${consumerId}`,
        cartItems
      ); // Assuming you are sending the item data with the request
      console.log(response.data);
      setCartItems((prevItems) => prevItems.filter((item) => !item._id));
      setStatus("Order Is Place Successfully");
      let response2 = await axios.post(
        "https://ecommerce-gawai-swad.onrender.com/api/sendemail",
        {
          email: consumerEmail,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Your Shopping Cart</h2>
      {status == "" && statusName == "" ? (
        <p className=""></p>
      ) : (
        <p className="mt-3 text-center bg-warning">
          {statusName.productname} &nbsp;
          {status}
        </p>
      )}
      {cartItems.length > 0 ? (
        <div className="row">
          <div className="col-sm-8" style={{ borderRight: "3px solid grey" }}>
            <h5>Items In Cart</h5>
            <div className="row">
              {cartItems.map((item, index) => (
                <>
                  {item.isOrdered == false ? (
                    <div className="row" key={index}>
                      <div className="col-sm-8">
                        <div className="row my-2">
                          <div className="col-sm-4">
                            <img
                              src={`${item.productimage}`}
                              width="100px"
                              alt=""
                            />
                          </div>
                          <div className="col-sm-8">
                            <h6>Product : {item.productname}</h6>
                            <p>Price : {item.productprice}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="d-flex border border-3 border-dark rounded-1 d-inline-block">
                          <div className=" d-inline-block px-2 ms-3 my-2">
                            {item.productquantity}
                          </div>
                          <div
                            className="ms-auto me-4 mt-2 fw-bold"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              descreaseQuantity(item._id, item.productquantity)
                            }
                          >
                            -
                          </div>
                          <div
                            className="ms-auto me-4 mt-2 fw-bold"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              increaseQuantity(item._id, item.productquantity)
                            }
                          >
                            +
                          </div>
                        </div>
                        <div className="mt-2">
                          <button
                            className="btn btn-danger rounded-0 w-100"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ))}
            </div>
          </div>
          <div className="col-sm-4 ps-5">
            <h5>Price Details</h5>
            <div className="row">
              <div className="my-3">Total Items : {totalItem}</div>
              <div className="my-3">Total Price : ₹{totalPrice}</div>
              <div className="my-3">
                <button
                  className="btn rounded-0 w-75"
                  onClick={placeOrder}
                  style={{ backgroundColor: "tomato", color: "white" }}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">No items in the cart.</p>
      )}
    </Container>
  );
};

export default Cart;
