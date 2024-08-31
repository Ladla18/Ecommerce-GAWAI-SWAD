import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Modal,
} from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Ticket = () => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [consumerId, setConsumerId] = useState();
  const [ticketData, setTicketData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setConsumerId(decodedToken.user._id);
        console.log("userid", decodedToken.user._id);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);
  
   



  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitHandle = (e) => {
    e.preventDefault();
    console.log(formData);
    const raiseTicket = async () => {
      try {
        await axios.post(
          `https://ecommerce-gawai-swad.onrender.com/api/raiseticket/${consumerId}`,
          formData
        );
        setFormData({ title: "", description: "" }); // Reset form after submission
      } catch (er) {
        console.log(er);
      }
    };
    raiseTicket();
  };
    useEffect(() => {
      const fetchTickets = async () => {
        try {
          const response = await axios.get(
            `https://ecommerce-gawai-swad.onrender.com/api/fetchticket/${consumerId}`
          );
          setTicketData(response.data);
          // console.log(response.data);
        } catch (Er) { 
          console.log(Er);
        }
      };
      if (consumerId) {
        fetchTickets();
      }
    }, [consumerId]);

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };
  const closeTicket = async (id)=>{
    try{
        const response = await axios.patch(`https://ecommerce-gawai-swad.onrender.com/api/closeticket/${id}`)
    }
    catch(err){
        console.log(err);
    }

  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/");
    }
  });
  
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Help And Support</h2>

      {/* Section to Raise a New Ticket */}
      <Row className="mb-4">
        <Col>
          <h4>Raise a New Ticket</h4>
          <Form onSubmit={submitHandle}>
            <Form.Group controlId="ticketTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ticket title"
                name="title"
                onChange={handleInput}
                value={formData.title}
              />
            </Form.Group>
            <Form.Group controlId="ticketDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your issue..."
                name="description"
                onChange={handleInput}
                value={formData.description}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-2">
              <FaPlus /> Raise Ticket
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Section to View Active Tickets */}
      <Row className="mb-4">
        <Col>
          <h4>Your Active Tickets</h4>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search tickets..."
              aria-label="Search tickets"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-search">
              <FaSearch />
            </Button>
          </InputGroup>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Ticket Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ticketData.map((ticket, index) => (
                <tr key={ticket._id}>
                  <td>{index + 1}</td>
                  <td>{ticket.ticketTitle}</td>
                  <td>{ticket.ticketDescription}</td>
                  <td>
                    {ticket.isResolved === false ? "Resolving" : "Resolved"}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewClick(ticket)}
                    >
                      View
                    </Button>
                    {ticket.isClosed===false?(
                        <Button onClick={()=>closeTicket(ticket._id)} variant="danger" size="sm">
                      Close
                    </Button>
                    ):(
                        <span className="text-danger">Closed by You</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal to Show Ticket Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTicket && (
            <>
             
              <p>Agend Name : </p>
              <p>
                Status:{" "}
                {selectedTicket.isResolved === false ? "Resolving" : "Closed"}
              </p>
            </>
          )}
        </Modal.Body>
    
      </Modal>
    </Container>
  );
};

export default Ticket;
