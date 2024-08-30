import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import { jwtDecode } from "jwt-decode";
const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const [ConsumerDashboard, setConsumerDashboard] = useState();
  const [seller, setSeller] = useState([]);
  const [products, setProducts] = useState([]);
  const [consumerId, setConsumerId] = useState();

  // Check login status and set user details
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      
      try {
        const decodedToken = jwtDecode(token);

        setConsumerId(decodedToken.user._id);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  };
console.log("consumerid",consumerId)
  useEffect(() => {
    checkLoginStatus();
    const fetchData = () => {
      axios
        .get("https://ecommerce-gawai-swad.onrender.com/api/consumerdashboard", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log(response.data);
          setConsumerDashboard(response.data.consumer);
          setSeller(response.data.products);
          // Flatten all seller products into one array
          const allProducts = response.data.products.flatMap(
            (s) => s.sellerproducts
          );
          console.log(allProducts)
          setProducts(allProducts);
        })
        .catch((error) => {
          console.error(error);
          if (error) {
            navigate("/login");
          }
        });
    };
    fetchData();
  }, []);
  console.log(products);

  const productDetail = (sid, pid) => {
    navigate(`/productdetail/${sid}/${pid}`);
  };


  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-sm-12">
          <h2 className="text-center">
            Welcome to The India's No.1 Shopping Place
          </h2>
          <h4 className="mt-5">Explore Our Products</h4>
        </div>

        {seller.map((s) => (
          <>
            {s.sellerproducts.map((p) => (
              <div className="col-sm-3" key={p._id}>
                <Card style={{ width: "18rem" }}>
                  <Card.Img
                    variant="top"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      margin: "10px auto",
                    }}
                    src={`https://ecommerce-gawai-swad.onrender.com/${p.productImage}`}
                    width="200px"
                  />
                  <Card.Body>
                    <Card.Title>{p.productName}</Card.Title>
                    <Card.Text>{p.productDescription}</Card.Text>
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      Category: {p.productCategory}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Sizes :{p.sizes.map((size) => size.slice(2, 7))},
                      {p.sizes.map((size) => size.slice(10, 16))},
                      {p.sizes.map((size) => size.slice(19, 24))},
                    </ListGroup.Item>
                    <ListGroup.Item>Price : {p.productPrice}</ListGroup.Item>
                  </ListGroup>
                  <Card.Body className="text-center">
                   
                    <button
                      className="btn btn-dark rounded-0 m-1 w-100"
                      onClick={() => productDetail(s._id, p._id)}
                    >
                      Detail
                    </button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default ConsumerDashboard;
