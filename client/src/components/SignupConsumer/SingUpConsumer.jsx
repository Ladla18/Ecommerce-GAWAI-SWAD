import React, { useState,useEffect } from 'react';
import './SignUp.css'; // Importing the CSS file for styling
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const SignupConsumer = () => {
  const [formData, setFormData] = useState({
    consumername: "",
    consumeremail: "",
    consumerpassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState('');
  const [success,setSuccess] = useState('')

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
   useEffect(() => {
     const token = localStorage.getItem("token");
     if (token) {
       return navigate("/");
     }
   });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.consumerpassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    console.log(formData)
    try {
      const response = await axios.post(
        "https://ecommerce-gawai-swad.onrender.com/api/consumersignup",  {
          consumername: formData.consumername,
          consumeremail: formData.consumeremail,
          consumerpassword: formData.consumerpassword
        }    );
      setSuccess(response.data.message);
      setError('');
      
    } catch (error) {
      console.error('There was an error sending the data!', error);
      if (error.response) {
        setError(error.response.data.message || 'There was an error processing your request');
      } else {
        setError('Network error or other issue');
      }
      setSuccess('');
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-card">
          <h2>Create an Account</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="error-message bg-success">{success}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="consumername"
                value={formData.consumername}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="consumeremail"
                value={formData.consumeremail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="consumerpassword"
                value={formData.consumerpassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
          <div className="signin-link">
            <p>Already have an account?</p>
            <Link to="/login" className="signin-button">
              Sign In
            </Link>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-danger ">Signup Using Google</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupConsumer;
