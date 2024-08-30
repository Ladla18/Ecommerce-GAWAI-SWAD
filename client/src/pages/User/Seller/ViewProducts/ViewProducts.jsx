import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Alert, Card, Row, Col } from "react-bootstrap";
import './ViewProducts.css'
import { useNavigate } from "react-router-dom";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [status, setStatus] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/viewproducts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data.sellerproducts);
      } catch (error) {
        setError("Error fetching products");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

    const handleRemoveItem = async (id) => {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/deletesellerproduct/${id}`
        );
        setStatus(response.data.message);
        setProducts(products.filter((item) => item._id !== id));
      } catch (err) {
        console.log(err);
      }
    };
    const navigate = useNavigate()

    const handleUpdateProduct = (id)=>{
        navigate(`/updateproductdetails/${id}`)
    }
     useEffect(() => {
       const token = localStorage.getItem("token");
       if (!token) {
         return navigate("/login");
       }
     });


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="product-list mt-5 container">
      <p className="bg-primary text-center text-light">{status}</p>
      <Row xs={1} md={2} lg={3} xl={4}>
        {products.map((p) => (
          <Col key={p._id}>
            <Card className="product-card mt-3" style={{ height: "30rem" }}>
              <Card.Img
                variant="top"
                src={`http://localhost:3000/${p.productImage}`}
                alt={p.productName}
              />
              <Card.Body>
                <Card.Title className="product-title">
                  {p.productName}
                </Card.Title>
                <Card.Text className="product-description" >
                  {p.productDescription.slice(0, 90)}.......
                </Card.Text>
                <Card.Text className="product-price">
                  <strong>₹{p.productPrice}</strong>
                </Card.Text>
                <div className="product-actions d-flex justify-content-between">
                  <button className="btn btn-primary rounded-0 w-25" onClick={()=>handleUpdateProduct(p._id)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger rounded-0 "
                    onClick={() => handleRemoveItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
