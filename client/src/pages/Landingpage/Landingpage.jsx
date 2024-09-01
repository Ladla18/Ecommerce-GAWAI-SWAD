import React, { useEffect, useState } from "react";
import Header from "../../components/Navbar/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Carouselmage from "../../components/CarouseImage/Carouselmage";
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { jwtDecode } from "jwt-decode";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./Landingpage.css";

const Landingpage = () => {
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState([]);
  const [consumerId, setConsumerId] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(true); // State for modal visibility
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search");

    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query);
    } else {
      // Clear the search query from the URL
      if (location.search) {
        window.history.replaceState({}, "", window.location.pathname);
      }
      fetchAllProducts();
    }
  }, [location.search]);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://ecommerce-gawai-swad.onrender.com/api/searchproduct/search?query=${encodeURIComponent(
          query
        )}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Failed to fetch search results", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://ecommerce-gawai-swad.onrender.com/api/landingpage"
      );
      setSeller(response.data.product);
      const allProducts = response.data.product.flatMap(
        (s) => s.sellerproducts
      );
      setProducts(allProducts);
      setResults([]); // Clear search results
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const productDetail = (sid, pid) => {
    navigate(`/productdetail/${sid}/${pid}`);
  };

  const addToWishList = async (sid, pid) => {
    try {
      const response = await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/addtowishlist/${sid}/${pid}/${consumerId}`
      );
      setStatus(response.data.message);
      setTimeout(() => setStatus(""), 3000); // Clear status message after 3 seconds
    } catch (err) {
      console.log(err);
    }
  };

  const displayProducts = searchQuery ? results : products;

  return (
    <>
      {/* Modal */}
      <Modal show={showModal} style={{padding:"100px"}} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Snazzy Touch</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-5 h2">
          This Web Application was Developed by{" "}
          <span className="text-primary fw-bold">Amanullah Ansari</span> during
          an internship at <span className="fw-bold" style={{color:"tomato"}}>Softpro India.</span>
        </Modal.Body>
       
      </Modal>

      <div className="container-fluid">
        <div className="row">
          <div className="col-ms-12 p-0" style={{ position: "relative" }}>
            <Carousel activeIndex={index} onSelect={handleSelect}>
              <Carousel.Item>
                <Carouselmage image="https://prod-img.thesouledstore.com/public/theSoul/uploads/themes/5722420240820130000.jpg?format=webp&w=1500&dpr=1.3" />
                <Carousel.Caption></Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <Carouselmage image="https://prod-img.thesouledstore.com/public/theSoul/uploads/themes/8050620240827103427.jpg?format=webp&w=1500&dpr=1.3" />
                <Carousel.Caption></Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
        <div className="container" style={{ position: "relative" }}>
          <div className="row mt-4 d-flex justify-content-center">
            <div className="col-sm-12 text-center border-bottom h4 border-3 border-dark w-25 py-3">
              Best Sellers
            </div>
          </div>
          {status && (
            <div
              style={{
                position: "fixed",
                top: "90vh",
                left: "42vw",
                zIndex: "99",
                transition: "all ease 1s",
              }}
            >
              <p
                className="text-bg-dark p-3 text-center rounded-2"
                style={{ boxShadow: "6px 6px 15px white" }}
              >
                {status}
              </p>
            </div>
          )}
          {loading ? (
            <div className="text-center mt-5">
              <img src="infinite-spinner.svg" width="170px" alt="" />
            </div>
          ) : (
            <div className="row mt-5">
              {displayProducts.map((p) => (
                <div className="col-sm-3 mt-4" key={p._id}>
                  <Card
                    className="product-card"
                    style={{ width: "18rem", height: "28rem" }}
                  >
                    <div
                      className="p-0 m-0"
                      style={{
                        display: "inline",
                        position: "absolute",
                        left: "250px",
                        top: "15px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src="heart.png"
                        alt=""
                        width="30px"
                        onClick={() => addToWishList(p.sellerid, p._id)}
                      />
                    </div>
                    <div style={{ height: "340px" }}>
                      <Card.Img
                        onClick={() => productDetail(p.sellerid, p._id)}
                        variant="top"
                        className="p-0 m-0"
                        style={{
                          cursor: "pointer",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          margin: "10px auto",
                        }}
                        src={`${p.productImage}`}
                        width="200px"
                      />
                    </div>
                    <Card.Body
                      className=""
                      style={{ height: "10px", marginTop: "-10px" }}
                    >
                      <Card.Title
                        className="p-0 m-0"
                        style={{ fontSize: "16px" }}
                      >
                        {p.productName}
                      </Card.Title>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item style={{ fontSize: "12px" }}>
                        Category: {p.productCategory}
                      </ListGroup.Item>
                      <ListGroup.Item>Price: ₹{p.productPrice}</ListGroup.Item>
                    </ListGroup>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Landingpage;
