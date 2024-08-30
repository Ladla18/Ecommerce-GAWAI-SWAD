const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const sellerSchema = new Schema({
  sellercompanyname: {
    type: String,
    required: true,
  },
  sellername: {
    type: String,
    required: true,
  },
  selleremail: {
    type: String,
    required: true,
  },
  sellerpassword: {
    type: String,
    required: true,
  },
  sellerphone: {
    type: String,
    required: true,
  },
  selleraddress: {
    type: String,
    required: true,
  },
  agreeToTerms: {
    type: Boolean,
    required: true,
  },
  usertype: {
    type: String,
    default: "seller",
  },
  sellerproducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
});

const addProductSchema = new Schema({
  sellerid:{
    type:String,

  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
  },
  productCategory: {
    type: String,
    required: true,
    enum: ["Men", "Women", "Kids"],
  },
  productPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  productImage: {
    type: String, // Path to the uploaded image
  },
  sizes: {
    type: Array, 

    default: [],
  },
});

// Create the model using the schema
const AddProduct = mongoose.model("Product", addProductSchema);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = { Seller, AddProduct };
