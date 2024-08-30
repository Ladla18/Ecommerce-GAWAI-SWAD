import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const EmployeeCreation = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://ecommerce-gawai-swad.onrender.com/api/adminsignup", formData)
      .then((response) => {
        navigate("/login");
         localStorage.removeItem("admintoken");
      })
      .catch((err) => {
        setError("Something wen wrong");
      });
  };
 


  const admintoken = localStorage.getItem("admintoken");
  if (!admintoken) {
     useEffect(()=>{
            navigate("/unauthorized");
        })
    return (
    <></>
    )
     ;
  } else {
    return (
      <div className="container">
  
        <h2>Create Employee</h2>
        <form action="" className="form-group" onSubmit={handleSubmit}>
          <label className="form-label">Employee Id</label>
          <input
            type="text"
            name="id"
            onChange={handleChange}
            value={formData.id}
            className="form-control"
            placeholder="Enter Employee Id"
          />
          <br />
          <label className="form-label">Employee Password</label>
          <input
            type="text"
            onChange={handleChange}
            value={formData.password}
            className="form-control"
            name="password"
            placeholder="Enter Employee Password"
          />
          <button type="submit" className="btn btn-primary">
            Create
          </button>
        </form>
      </div>
    );
  }
};

export default EmployeeCreation;
