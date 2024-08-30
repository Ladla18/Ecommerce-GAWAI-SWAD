import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Fix import
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate()
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setSellerId(decodedToken.user._id);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (sellerId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/sellerorders/${sellerId}`
          );
          setOrders(response.data.orders);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [sellerId]);

   useEffect(() => {
     const token = localStorage.getItem("token");
     if (!token) {
       return navigate("/login");
     }
   });


  return (
    <Container className="mt-4">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : orders.length > 0 ? (
        <Row>
          <Col sm={12} md={6} className="mb-4">
            <h2 className="text-center">Multiple Orders</h2>
            {orders.map((order) => (
              <div key={order._id}>
                {order.singleorder.length === 0 && (
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title className="text-center">
                        Order ID: {order.orderid}
                      </Card.Title>
                      {order.orderproduct.map((op) =>
                        sellerId && op.sellerid === sellerId ? (
                          <Card key={op._id} className="mb-3">
                            <Card.Body>
                              <Row>
                                <Col md={4}>
                                  <Card.Img
                                    src={`http://localhost:3000/${op.productimage}`}
                                    alt={op.productname}
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Col>
                                <Col md={8}>
                                  <Card.Title>{op.productname}</Card.Title>
                                  <Card.Text>
                                    <strong>Rs {op.productprice}</strong>
                                  </Card.Text>
                                  <Card.Text>
                                    Quantity: {op.productquantity}
                                  </Card.Text>
                                  <Button variant="primary">
                                    Accept Order
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ) : null
                      )}
                    </Card.Body>
                  </Card>
                )}
              </div>
            ))}
          </Col>

          <Col sm={12} md={6}>
            <h2 className="text-center">Single Orders</h2>
            {orders.map((order) => (
              <div key={order._id}>
                {order.orderproduct.length === 0 && (
                  <Card className="mb-3">
                    <Card.Body>
                      <Card.Title className="text-center">
                        Order ID: {order.orderid}
                      </Card.Title>
                      {order.singleorder.map((sp) =>
                        sellerId && sp.sellerid === sellerId ? (
                          <Card key={sp._id} className="mb-3">
                            <Card.Body>
                              <Row>
                                <Col md={4}>
                                  <Card.Img
                                    src={`http://localhost:3000/${sp.productImage}`}
                                    alt={sp.productName}
                                    style={{
                                      width: "100%",
                                      height: "auto",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Col>
                                <Col md={8}>
                                  <Card.Title>{sp.productName}</Card.Title>
                                  <Card.Text>
                                    <strong>Rs {sp.productPrice}</strong>
                                  </Card.Text>
                                  <Button variant="primary">
                                    Accept Order
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ) : null
                      )}
                    </Card.Body>
                  </Card>
                )}
              </div>
            ))}
          </Col>
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          No orders available.
        </Alert>
      )}
    </Container>
  );
};

export default SellerOrder;
