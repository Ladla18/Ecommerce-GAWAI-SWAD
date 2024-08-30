import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { jwtDecode } from "jwt-decode";
const WomenCategory = () => {
  const [seller, setSeller] = useState([]);
  const [products, setProducts] = useState([]);
  const [consumerId, setConsumerId] = useState();
const navigate = useNavigate();
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

  useEffect(() => {
    checkLoginStatus();
    const fetchData = async () => {
      if (consumerId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/categoryfilter/${consumerId}`
          );
          setSeller(response.data.products);
          // Flatten all seller products into one array
          const allProducts = response.data.products.flatMap(
            (s) => s.sellerproducts
          );
          setProducts(allProducts);
        } catch (er) {
          console.log(er);
        }
      }
    };
    fetchData();
  }, [consumerId]);
const productDetail = (sid, pid) => {
  navigate(`/productdetail/${sid}/${pid}`);
};
useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    return navigate("/");
  }
});
  return (
    <div className="container mt-5">
      <h1>Women</h1>
      <div className="row">
        {seller.map((s) =>
          s.sellerproducts
            .filter((p) => p.productCategory === "Women")
            .map((p) => (
              <div className="col-sm-3 mb-4" key={p._id}>
                <Card style={{ width: "18rem" }}>
                  <Card.Img
                    variant="top"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      margin: "10px auto",
                    }}
                    src={`http://localhost:3000/${p.productImage}`}
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
                      Sizes: {p.sizes.map((size) => size.slice(2, 7))},
                      {p.sizes.map((size) => size.slice(10, 16))},
                      {p.sizes.map((size) => size.slice(19, 24))}
                    </ListGroup.Item>
                    <ListGroup.Item>Price: {p.productPrice}</ListGroup.Item>
                  </ListGroup>
                  <Card.Body className="text-center">
                    <button
                      className="btn rounded-0 btn-dark m-1 w-100"
                      onClick={() => productDetail(s._id, p._id)}
                    >
                      Detail
                    </button>
                  </Card.Body>
                </Card>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default WomenCategory;
