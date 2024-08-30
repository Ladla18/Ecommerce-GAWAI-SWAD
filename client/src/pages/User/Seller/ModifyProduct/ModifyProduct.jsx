import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Corrected import

const ModifyProduct = () => {
  const nav = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productCategory: "",
    productPrice: "",
    productImage: null,
    sizes: [], // Use array for sizes
  });

  const [hasNewImage, setHasNewImage] = useState(false); // State to track image upload
  const [error, setError] = useState(); // State to handle errors

  useEffect(() => {
    console.log(params.id);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://ecommerce-gawai-swad.onrender.com/api/getproductforedit/${params.id}`
        );
        console.log(response.data);
        setFormData({
          ...response.data,
          sizes: response.data.sizes || [], // Ensure sizes is an array
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "productImage") {
      setFormData({ ...formData, [name]: files[0] });
      setHasNewImage(!!files[0]); // Set hasNewImage to true if a new file is selected
    } else if (type === "checkbox") {
      setFormData((prevState) => {
        const sizes = new Set(prevState.sizes);
        if (checked) {
          sizes.add(value);
        } else {
          sizes.delete(value);
        }
        return { ...prevState, sizes: Array.from(sizes) };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      formData.productName === "" ||
      formData.productDescription === "" ||
      formData.productCategory === "" ||
      formData.productPrice === "" ||
      (hasNewImage && formData.productImage === null) ||
      formData.sizes.length === 0 // Check if sizes array is empty
    ) {
      setError("Please fill in all fields");
      return;
    }

    const data = new FormData();
    data.append("productName", formData.productName);
    data.append("productDescription", formData.productDescription);
    data.append("productCategory", formData.productCategory);
    data.append("productPrice", formData.productPrice);
    if (hasNewImage) {
      // Only append the image if a new one was uploaded
      data.append("productImage", formData.productImage);
    }

    // Append each size individually to FormData
    formData.sizes.forEach((size) => {
      data.append("sizes[]", size);
    });

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const uid = decoded.user._id;
      const response = await axios.post(
        `https://ecommerce-gawai-swad.onrender.com/api/updateproduct/${uid}/${params.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Upload successful:", response.data);
      nav("/seller/viewproducts");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
   useEffect(() => {
     const token = localStorage.getItem("token");
     if (!token) {
       return navigate("/login");
     }
   });


  return (
    <div className="container">
      <div className="text-center">Edit Your Existing Product</div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            className="form-control"
            placeholder="Enter the Product Name"
            value={formData.productName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">
            Product Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            className="form-control"
            rows="3"
            placeholder="Enter the Product Description"
            value={formData.productDescription}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="productCategory" className="form-label">
            Product Category
          </label>
          <select
            id="productCategory"
            name="productCategory"
            className="form-select"
            value={formData.productCategory}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="productPrice" className="form-label">
            Product Price
          </label>
          <input
            type="number"
            id="productPrice"
            name="productPrice"
            className="form-control"
            placeholder="Enter the Product Price"
            value={formData.productPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <div>
            Current Image{" "}
            <img
              src={`https://ecommerce-gawai-swad.onrender.com/${formData.productImage}`}
              width="50px"
              alt="Product"
            />
          </div>
          <label htmlFor="productImage" className="form-label">
            Change Image
          </label>
          <input
            type="file"
            id="productImage"
            name="productImage"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <fieldset className="mb-3">
          <legend className="col-form-label">Sizes</legend>
          <div className="form-check">
            <input
              type="checkbox"
              id="sizeSmall"
              name="sizes"
              value="Small"
              className="form-check-input"
              onChange={handleChange}
              checked={formData.sizes.includes("Small")}
            />
            <label htmlFor="sizeSmall" className="form-check-label">
              Small
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="sizeMedium"
              name="sizes"
              value="Medium"
              className="form-check-input"
              onChange={handleChange}
              checked={formData.sizes.includes("Medium")}
            />
            <label htmlFor="sizeMedium" className="form-check-label">
              Medium
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="sizeLarge"
              name="sizes"
              value="Large"
              className="form-check-input"
              onChange={handleChange}
              checked={formData.sizes.includes("Large")}
            />
            <label htmlFor="sizeLarge" className="form-check-label">
              Large
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="sizeXLarge"
              name="sizes"
              value="X-Large"
              className="form-check-input"
              onChange={handleChange}
              checked={formData.sizes.includes("X-Large")}
            />
            <label htmlFor="sizeXLarge" className="form-check-label">
              X-Large
            </label>
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default ModifyProduct;
