import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Assuming you have a CSS file for custom styles

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State for loader visibility

  const inputHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loader before API call

    try {
      const response = await axios.post(
        "https://ecommerce-gawai-swad.onrender.com/api/login",
        formData
      );

      if (response.data.logger.usertype === "consumer") {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else if (response.data.logger.usertype === "admin") {
        localStorage.setItem("token", response.data.token);
        navigate("/admindashboard");
      } else if (response.data.logger.usertype === "seller") {
        localStorage.setItem("token", response.data.token);
        navigate("/sellerdashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Email or Password is incorrect");
    } finally {
      setIsLoading(false); // Hide loader after API call (or timeout)
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []); // Empty dependency array ensures it runs only on initial render

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header bg-primary text-white text-center py-4">
              <h4 className="mb-0">Login</h4>
            </div>
            {error && <p className="text-center text-danger mt-3">{error}</p>}
            <div className="card-body p-4">
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={inputHandler}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={inputHandler}
                    className="form-control"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="text-center">
                  {isLoading ? (
                    <div className="loader">
                      <img
                        src="Animation - 1725024782997.gif"
                        width="90px"
                        alt=""
                      />
                    </div>
                  ) : (
                    <button type="submit" className="btn btn-primary w-100">
                      Login
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="card-footer text-center py-3">
              <small className="text-muted">
                Don't have an account?{" "}
                <a href="/signup" className="text-primary">
                  Sign up
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
