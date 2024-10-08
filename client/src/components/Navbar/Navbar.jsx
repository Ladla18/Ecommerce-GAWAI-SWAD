import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";
import axios from "axios";


import CustomerSupport from "../CustomerSupport/CustomerSupport";
import ConsumerNeed from "../ConsumerNeeds/ConsumerNeed";
const Header = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [userType, setUserType] = useState("");
  const [consumerId,setConsumerId] =useState()
  const [cartItems, setCartItems] = useState([]);
  const [searchData,setSearchData] = useState({
    searchBar:""
  })
  const navigate = useNavigate();

  // Check login status and set user details
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decodedToken = jwtDecode(token);
        setUserDetail(decodedToken.user);
        setUserType(decodedToken.user.usertype);
        setConsumerId(decodedToken.user._id);
      } catch (error) {
        console.error("Failed to decode token", error);
        setIsLoggedIn(false);
        setUserDetail(null);
        setUserType("");
      }
    } else {
      setIsLoggedIn(false);
      setUserDetail(null);
      setUserType("");
    }
  };

  useEffect(() => {
    checkLoginStatus();
    if (consumerId) {
      const fetchCartDetails = async () => {
        try {
          const response = await axios.get(
            `https://ecommerce-gawai-swad.onrender.com/api/getcartitem/${consumerId}`
          );
          setCartItems(response.data);
          console.log(response.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchCartDetails();
    }
  }, [navigate,consumerId]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserDetail(null);
    setUserType("");
    navigate("/login");
  };

  const handleSearchProduct = (e)=>{
    setSearchData({...searchData,[e.target.name]:e.target.value})
  }
 const handleSearchButton = (e) => {
   e.preventDefault(); // Prevent form submission
   // Navigate to the landing page with the search query
   navigate(`/?search=${encodeURIComponent(searchData.searchBar)}`);
 };


  return (
    <div
      className="container-fluid p-0 position-sticky top-0 start-0 end-0"
      style={{ zIndex: "10" }}
    >
      <div className="row">
        <div className="col-sm-12 p-0">
          <Navbar bg="dark" expand="lg" className="p-3" data-bs-theme="dark">
            <Container>
              {/* Brand Link */}
              {isLoggedIn && userType === "consumer" ? (
                <Navbar.Brand as={Link} to="/">
                  SnazzyTouch
                </Navbar.Brand>
              ) : (
                <Navbar.Brand as={Link}>SnazzyTouch</Navbar.Brand>
              )}

              {/* Toggle for smaller screens */}
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />

              <Navbar.Collapse id="responsive-navbar-nav">
                {/* Conditional Links Based on User Type */}
                {isLoggedIn && userType === "admin" ? (
                  <Nav className="me-auto">
                    <Nav.Link as={Link} to="/admindashboard">
                      Dashboard
                    </Nav.Link>
                  </Nav>
                ) : isLoggedIn && userType === "seller" ? (
                  <Nav className="me-auto">
                    <Nav.Link as={Link} to="/sellerdashboard">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/seller/addproduct">
                      Add Products
                    </Nav.Link>
                    <Nav.Link as={Link} to="/seller/viewproducts">
                      View Your Products
                    </Nav.Link>
                    <Nav.Link as={Link} to="/seller/orders">
                      View Orders
                    </Nav.Link>
                  </Nav>
                ) : isLoggedIn && userType === "consumer" ? (
                  <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">
                      Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/men">
                      Men
                    </Nav.Link>
                    <Nav.Link as={Link} to="/women">
                      Women
                    </Nav.Link>
                    <Nav.Link as={Link} to="/kids">
                      Kids
                    </Nav.Link>
                    <div>
                      <form
                        action=""
                        method="get"
                        onSubmit={handleSearchButton}
                        className="d-flex"
                      >
                        <div className="ms-sm-4">
                          <input
                            type="text"
                            placeholder="Search Our Products"
                            name="searchBar"
                            onChange={handleSearchProduct}
                            value={searchData.searchBar}
                            className="form-control"
                            id=""
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="btn btn-outline-warning ms-2"
                          >
                            Search
                          </button>
                        </div>
                      </form>
                    </div>
                  </Nav>
                ) : (
                  <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">
                      Home
                    </Nav.Link>
                  </Nav>
                )}

                {/* Right Side Links */}
                <Nav className="ms-auto">
                  {isLoggedIn ? (
                    <>
                      <ConsumerNeed
                        userDetail={
                          userDetail.consumername ||
                          userDetail.sellername ||
                          userDetail.adminemail
                        }
                        logout={logout}
                      />
                      <span
                        className="text-light"
                        style={{ marginTop: "12px" }}
                      >
                        {}
                      </span>
                    </>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/sellersignup">
                        Become A Seller
                      </Nav.Link>
                      <Nav.Link as={Link} to="/consumersignup">
                        SignUp
                      </Nav.Link>
                      <Nav.Link as={Link} to="/login">
                        Login
                      </Nav.Link>
                    </>
                  )}
                </Nav>

                {/* Cart Icon and Status */}
                <Nav className="mt-lg-0 mt-3">
                  {isLoggedIn && userType === "consumer" ? (
                    <Link id="cart" to="/cart">
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/1170/1170576.png"
                        width="30px"
                        alt="Cart"
                      />
                      {cartItems.length > 0 ? (
                        <div
                          className="bg-warning px-2 rounded-2"
                          style={{
                            position: "absolute",
                            color: "black",
                            top: "-15px",
                            left: "24px",
                          }}
                          id="cart-status"
                        >
                          {cartItems.filter((item) => !item.isOrdered).length}
                        </div>
                      ) : (
                        <div
                          id="cart-status"
                          style={{
                            position: "absolute",
                            height: "5px",
                            width: "5px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                            top: "-2px",
                            left: "20px",
                          }}
                        ></div>
                      )}
                    </Link>
                  ) : (
                    ""
                  )}
                </Nav>
                <CustomerSupport />
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>
      </div>
    </div>
  );
};

export default Header;
