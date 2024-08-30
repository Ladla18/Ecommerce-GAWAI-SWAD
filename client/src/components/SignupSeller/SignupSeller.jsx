import axios from "axios";
import React, { useState } from "react";

const SignupSeller = () => {
  const [status,setStatus] = useState()
  const [formData, setFormData] = useState({
    sellercompanyname: "",
    sellername: "",
    selleremail: "",
    sellerpassword: "",
    sellerconfirmpassword: "",
    sellerphone: "",
    selleraddress: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState();
  const inputHandler = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const submitHandler = (e) => {
    e.preventDefault();
    const {
      sellercompanyname,
      sellername,
      selleremail,
      sellerpassword,
      sellerconfirmpassword,
      sellerphone,
      selleraddress,
      agreeToTerms,
    } = formData;

    if (
      !sellercompanyname ||
      !sellername ||
      !selleremail ||
      !sellerpassword ||
      !sellerconfirmpassword ||
      !sellerphone ||
      !selleraddress
    ) {
      setError("Please fill all required fields");
      return;
    }
    if (sellerpassword !== sellerconfirmpassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to our terms");
      return;
    }
   if (!/^[0-9]{10}$/.test(sellerphone)) {
     setError("Invalid phone number");
     return;
   }
   else{
    setError("")
   }
   try{
    axios.post("https://ecommerce-gawai-swad.onrender.com/api/sellersignup",formData)
    .then((response)=>{
        console.log(response.data);
        setStatus("Seller Signed Up Successfully . Please Login !" )
    })
    .catch((error)=>{
      console.log("Error post data",error);
      setStatus("Seller Email already exists !")
      
    })
   }
   catch(err){
    console.log(err);
   }
    // Submit the form data
    console.log(formData);

  };
  return (
    <div className="container">
      <h2 className="text-center mt-3 fw-bold">Seller Signup</h2>
      <div className="text-bg-danger text-center ">{error}</div>
      <div className="text-bg-success text-center ">{status}</div>
      <form
        className="row g-3 d-flex justify-content-center"
        onSubmit={submitHandler}
      >
        <div className="col-md-6 ">
          <label htmlFor="comapanyname" className="form-label">
            Company Name
          </label>
          <input
            type="text"
            className="form-control"
            id="comapanyname"
            onChange={inputHandler}
            value={formData.sellercompanyname}
            name="sellercompanyname"
            placeholder="Enter Your Company Name"
          />
          <label htmlFor="sellername" className="form-label">
            Seller Name
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            onChange={inputHandler}
            value={formData.sellername}
            name="sellername"
            placeholder="Enter Your Name"
          />
          <label htmlFor="inputName" className="form-label">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="inputName"
            onChange={inputHandler}
            value={formData.selleremail}
            name="selleremail"
            placeholder="Enter Your Email"
          />
          <label htmlFor="inputName" className="form-label">
            Password
          </label>
          <input
            type="text"
            className="form-control"
            name="sellerpassword"
            id="inputName"
            onChange={inputHandler}
            value={formData.sellerpassword}
            placeholder="Enter Your Password"
          />
          <label htmlFor="inputName" className="form-label">
            Confirm Password
          </label>
          <input
            type="text"
            name="sellerconfirmpassword"
            className="form-control"
            id="inputName"
            onChange={inputHandler}
            value={formData.sellerconfirmpassword}
            placeholder="Enter Your Confirm Password"
          />
          <label htmlFor="inputName" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            name="sellerphone"
            className="form-control"
            id="inputName"
            onChange={inputHandler}
            value={formData.sellerphone}
            placeholder="Enter Your Phone"
          />
          <label htmlFor="inputName" className="form-label">
            Address
          </label>
          <textarea
            onChange={inputHandler}
            value={formData.selleraddress}
            className="form-control"
            name="selleraddress"
            id=""
          ></textarea>{" "}
          <br />
          <input
            type="checkbox"
            name="agreeToTerms"
            onChange={inputHandler}
            value={formData.agreeToTerms}
            id=""
          />
          <span className="ms-2">Agree To Our Terms</span> <br />
          <button className="btn btn-success mt-2">Singup</button>
        </div>
      </form>
    </div>
  );
};

export default SignupSeller;
