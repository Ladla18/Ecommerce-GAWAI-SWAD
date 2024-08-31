import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ConsumerTicketDetails = () => {
  const [consumerData, setConsumerData] = useState(null);
  const param = useParams();
  const navigate = useNavigate();
  console.log("userid", param.id);

  useEffect(() => {
    const fetchConsumerData = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-gawai-swad.onrender.com/api/consumertic/${param.id}`
        );
        setConsumerData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConsumerData();
  }, [param.id]);

  if (!consumerData) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  const goBack = ()=>{
    navigate("/admindashboard")
  }
  const resolveConsumerTicket = async ()=>{
   try{
     const response = axios.post(`https://ecommerce-gawai-swad.onrender.com/api/resolveconsumerticket/${param.tid}`)
   }
   catch(E){
    console.error(E)
    
   }
  }
  return (
    <div className="container mt-5">
        <button className="btn btn-dark rounded-0" onClick={goBack}>Go Back</button>
      <h1 className="mb-4" style={{ color: "#343a40" }}>
        Consumer Details
      </h1>
      <div
        className="card mb-4"
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="card-body">
          <h5 className="card-title">Personal Information</h5>
          <p className="card-text">
            <strong>Name:</strong> {consumerData.consumername}
          </p>
          <p className="card-text">
            <strong>Email:</strong> {consumerData.consumeremail}
          </p>
          <p className="card-text">
            <strong>User Type:</strong> {consumerData.usertype}
          </p>
        </div>
        <div>
            <button onClick={resolveConsumerTicket} className="btn btn-success rounded-0 mt-3 ms-4 mb-3">Resolve Now</button>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="mb-3" style={{ color: "#007bff" }}>
          Orders
        </h2>
        {consumerData.orders.length === 0 ? (
          <p className="text-muted">No orders found.</p>
        ) : (
          <ul className="list-group">
            <li className="list-group-item">
              <div className="row">
                <div className="col-sm-3 fw-bold">S.N</div>
                <div className="col-sm-3 fw-bold">Order DATE</div>
                <div className="col-sm-3 fw-bold">ORDER STATUS</div>
                <div className="col-sm-3 fw-bold">ORDER ID</div>
              </div>
            </li>
            {consumerData.orders.map((order, index) => (
              <li className="list-group-item" key={index}>
                <div className="row">
                  <div className="col-sm-3">{index + 1}</div>
                  <div className="col-sm-3">{order.orderdate.slice(0, 10)}</div>
                  <div className="col-sm-3">{order.orderstatus}</div>
                  <div className="col-sm-3 d-flex justify-content-between">
                    {order.orderid}
                    <button className="btn btn-primary rounded-0 ms-3">
                      {" "}
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConsumerTicketDetails;
