import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminVerification = () => {
  const [formData, setFormData] = useState({
    verify: "",
  });
  const navigate = useNavigate();
  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const secretkey = "hello"
  const handlesubmit = (e) => {
    e.preventDefault();
    const { verify } = formData;
    if (verify === "admin") {
        localStorage.setItem("admintoken",secretkey)
      navigate("/employeecreation");
    } else {
      navigate("/unauthorized");
    }
  };
  return (
    <div className="container mt-5">
      <button className="btn btn-dark my-4">Manage Employees</button>
      <h2>Verify That You Are Admin</h2>
      <form action="" className="form-group" onSubmit={handlesubmit}>
        <label htmlFor="verify" className="form-label">
          Verification Code
        </label>
        <input
          type="text"
          name="verify"
          onChange={handlechange}
          value={formData.verify}
          className="form-control"
          id="verify"
        />{" "}
        <br />
        <button className="btn btn-primary" type="submit">
          GO
        </button>
      </form>
    </div>
  );
};

export default AdminVerification;
