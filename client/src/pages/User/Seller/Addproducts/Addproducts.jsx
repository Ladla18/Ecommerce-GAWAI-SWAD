import React, { useState,useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  document.title = "Add Products"
  const nav = useNavigate();
  const [error, setError] = useState();
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productCategory: "",
    productPrice: "",
    productImage: null,
    sizes: [], // Array to store selected sizes
  });
const navigate = useNavigate()
  const handleChange = (event) => {
    const { name, value, files, type, checked } = event.target;
    if (name === "productImage") {
      setFormData({ ...formData, [name]: files[0] });
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      formData.productName === "" ||
      formData.productDescription === "" ||
      formData.productCategory === "" ||
      formData.productPrice === "" ||
      formData.productImage === null ||
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
    data.append("productImage", formData.productImage);

    // Append each size individually to FormData
    formData.sizes.forEach((size) => {
      data.append("sizes[]", size); // 'sizes[]' to represent an array
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/addproduct",
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
      setError("Failed to upload product. Please try again.");
    }
  };
 useEffect(() => {
   const token = localStorage.getItem("token");
   if (!token) {
     return navigate("/login");
   }
 });


  return (
    <div className="container position-relative">
      <div
        className="row text-center bg-danger text-light "
        style={{ position: "sticky", top: "79px", zIndex: "10" }}
      >
        <div className="col-sm-12">
          {error}
          
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Add Product</h4>
            </div>
            <div className="card-body">
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
                  <label htmlFor="productImage" className="form-label">
                    Product Image
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
                    />
                    <label htmlFor="sizeXLarge" className="form-check-label">
                      X-Large
                    </label>
                  </div>
                </fieldset>

                <button type="submit" className="btn btn-primary">
                  Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
