import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Nav,
  Navbar,
} from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [adminId, setAdminId] = useState();
  const [consumers, setConsumers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [activeTab, setActiveTab] = useState("consumers");
  const [conclicked,setConClicked] = useState()
  const [sellerclicked,setSellerClicked] = useState()
  const [reportsclicked,setReportsClicked] = useState()
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminId(decodedToken.user._id);
        console.log("Admin Id", decodedToken.user._id);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-gawai-swad.onrender.com/api/getallusers`
        );
        setConsumers(response.data.consumers);
        setSellers(response.data.sellers);
      } catch (error) {
        console.log(error);
      }
    };
    setConClicked("bg-warning")
    fetchUsers();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }
  });
  return (
    <Container fluid>
      <Row>
        <Col sm={2} style={{ height: "650px" }} className="bg-secondary p-0">
          <Nav className="flex-column mt-3 ">
            <Nav.Link
              className={`text-dark ${conclicked}`}
              onClick={() => {
                setActiveTab("consumers");
                setConClicked("bg-warning");
                setSellerClicked("")
                setReportsClicked("")
              }}
            >
              Consumers
            </Nav.Link>
            <Nav.Link
              className={`text-dark ${sellerclicked}`}
              onClick={() => {
                setActiveTab("sellers");
                setSellerClicked("bg-warning")
                 setReportsClicked("");
                    setConClicked("");
              
              }}
            >
              Sellers
            </Nav.Link>
            <Nav.Link
              className={`text-dark ${reportsclicked}`}
              onClick={() => {
                setActiveTab("reports");
                setReportsClicked("bg-warning")
                  setSellerClicked("");
                  setConClicked("")
              }}
            >
              Reports
            </Nav.Link>
          </Nav>
        </Col>
        <Col sm={10} className="p-3">
          {activeTab === "consumers" && (
            <div>
              <h2>Consumers</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consumers.map((c) => (
                    <tr key={c._id}>
                      <td>{c.consumername}</td>
                      <td>{c.consumeremail}</td>
                      <td>
                        <Button variant="primary" className="me-2">
                          More Info
                        </Button>
                        <Button variant="danger">Ban User</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {activeTab === "sellers" && (
            <div>
              <h2>Sellers</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((s) => (
                    <tr key={s._id}>
                      <td>{s.sellername}</td>
                      <td>{s.selleremail}</td>
                      <td>
                        <Button variant="primary" className="me-2">
                          More Info
                        </Button>
                        <Button variant="danger">Ban Seller</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {activeTab === "reports" && (
            <div>
              <h2>Reports</h2>
              <p>Reports section will be implemented here.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
