import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Nav } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState();
  const [consumers, setConsumers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [activeTab, setActiveTab] = useState("consumers");
  const [conclicked, setConClicked] = useState();
  const [sellerclicked, setSellerClicked] = useState();
  const [reportsclicked, setReportsClicked] = useState();
  const [selectedUser, setSelectedUser] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const [showSection, setShowSection] = useState(null); // New state to manage sections

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
        setAllTickets(response.data.tickets);
        // console.log(response.data.tickets);
        setSellers(response.data.sellers);
      } catch (error) {
        console.log(error);
      }
    };
    // const fetchAllTickets = async ()=>{
    //   try{
    //     const response = await axios.get(`https://ecommerce-gawai-swad.onrender.com/api/getalltickets`)
    //     setAllTickets(response.data)
    //   }
    //   catch(e){
    //     console.log(e)
    //   }
    // }
    setConClicked("bg-warning");
    // fetchAllTickets()
    fetchUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }
  });

  const deleteSeller = async (id) => {
    try {
      await axios.delete(
        `https://ecommerce-gawai-swad.onrender.com/api/deleteseller/${id}`
      );
      setSellers(sellers.filter((seller) => seller._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `https://ecommerce-gawai-swad.onrender.com/api/deleteuser/${id}`
      );
      setConsumers(consumers.filter((consumer) => consumer._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const sellerTicketDetail = (id, tid) => {
    navigate(`/sellerticketdetail/${id}/${tid}`);
  };
  const consumerTicketDetail = (id, tid) => {
    navigate(`/consumerticketdetail/${id}/${tid}`);
  };
  const bannedConsumer = async (id) => {
    try {
      const res = await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/bannedconsumer/${id}`
      );
    } catch (e) {
      console.log(e);
    }
  };
  const bannedSeller = async (id) => {
    try {
      const res = await axios.post(`https://ecommerce-gawai-swad.onrender.com/api/bannedseller/${id}`);
    } catch (e) {
      console.log(e);
    }
  };
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
                setSellerClicked("");
                setReportsClicked("");
                setSelectedUser(null);
                setShowSection(null);
              }}
            >
              Consumers
            </Nav.Link>
            <Nav.Link
              className={`text-dark ${sellerclicked}`}
              onClick={() => {
                setActiveTab("sellers");
                setSellerClicked("bg-warning");
                setReportsClicked("");
                setConClicked("");
                setSelectedUser(null);
                setShowSection(null);
              }}
            >
              Sellers
            </Nav.Link>
            <Nav.Link
              className={`text-dark ${reportsclicked}`}
              onClick={() => {
                setActiveTab("reports");
                setReportsClicked("bg-warning");
                setSellerClicked("");
                setConClicked("");
                setSelectedUser(null);
                setShowSection(null);
              }}
            >
              Reports
            </Nav.Link>
          </Nav>
        </Col>
        <Col sm={10} className="p-3">
          {!selectedUser && activeTab === "consumers" && (
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
                        <Button
                          variant="primary"
                          className="me-2"
                          onClick={() => setSelectedUser(c)}
                        >
                          More Info
                        </Button>
                        {c.isBanned === false ? (
                          <Button
                            variant="danger"
                            onClick={() => bannedConsumer(c._id)}
                          >
                            Ban User
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            onClick={() => bannedConsumer(c._id)}
                          >
                            Banned
                          </Button>
                        )}
                        <Button
                          variant="dark ms-1"
                          onClick={() => deleteUser(c._id)}
                        >
                          Delete User
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {!selectedUser && activeTab === "sellers" && (
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
                        <Button
                          variant="primary"
                          className="me-2"
                          onClick={() => setSelectedUser(s)}
                        >
                          More Info
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => bannedSeller(s._id)}
                        >
                          Ban Seller
                        </Button>
                        <Button
                          variant="dark ms-1"
                          onClick={() => deleteSeller(s._id)}
                        >
                          Delete Seller
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {!selectedUser && activeTab === "reports" && (
            <div>
              <h2>Reports</h2>
              <p>Reports section will be implemented here.</p>
              <div className="row">
                <div className="col-sm-6">
                  <h2>Consumers Tickets</h2>
                  <div className="row">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTickets.map((t) => (
                          <>
                            {t.userkind == "consumer" && (
                              <tr>
                                <td>{t.ticketTitle}</td>
                                <td>{t.ticketDescription}</td>
                                <td>{t.date.slice(0, 10)}</td>
                                <td>
                                  {t.isResolved === false ? (
                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        consumerTicketDetail(t.userid, t._id)
                                      }
                                    >
                                      View
                                    </button>
                                  ) : (
                                    <button className="btn btn-success">
                                      Resolved
                                    </button>
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-sm-6">
                  <h2>Seller Ticket</h2>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTickets.map((t) => (
                        <>
                          {t.userkind == "seller" && (
                            <tr>
                              <td>{t.ticketTitle}</td>
                              <td>{t.ticketDescription}</td>
                              <td>{t.date.slice(0, 10)}</td>
                              <td>
                                {t.isResolved === false ? (
                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      consumerTicketDetail(t.userid, t._id)
                                    }
                                  >
                                    View
                                  </button>
                                ) : (
                                  <button className="btn btn-success">
                                    Resolved
                                  </button>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {selectedUser && (
            <div>
              <h2>User Details</h2>
              <p>
                Name: {selectedUser.consumername || selectedUser.sellername}
              </p>
              <p>
                Email: {selectedUser.consumeremail || selectedUser.selleremail}
              </p>
              <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                Back to List
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
