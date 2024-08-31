const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { AddProduct } = require("./sellerModel");

const consumerSchema = new Schema({
  consumername: {
    type: String,
    required: true,
  },
  consumeremail: {
    type: String,
    required: true,
  },
  consumerpassword: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    default: "consumer",
  },
  cartitem: [
    {
      type: Schema.Types.ObjectId,
      ref: "CartItems",
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Orders",
    },
  ],
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "WishList",
    },
  ],
  tickets:[
    {
      type:Schema.Types.ObjectId,
      ref:'Ticket'
    }
  ]
  ,
  isBanned:{
    type:Boolean,
    default:false
  }
});

const cartItemSchema = new Schema({
  sellerid:{
    type:String
  },
  productid: {
    type: String,
  },
  productname: {
    type: String,
    required: true,
  },
  productprice: {
    type: Number,
    required: true,
  },
  productquantity: {
    type: Number,
  },
  productimage: {
    type: String,
    required: true,
  },
  isOrdered: {
    type: Boolean,
    default: false,
  },
  inCart: {
    type: Boolean,
    default: true,
  },
});

const orderSchema = new Schema({
  orderid: {
    type: String,
  },
  orderdate: {
    type: Date,
  },
  orderstatus: {
    type: String,
    default: "Processing",
  },
  orderproduct: [
    {
      type: Schema.Types.ObjectId,
      ref: "CartItems",
    },
  ],
  singleorder: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const wishListSchema = new Schema({
  productid: {
    type: String,
  },
  productname: {
    type: String,
  },
  productprice: {
    type: String,
  },
  productimage: {
    type: String,
  },
});
const Consumer = mongoose.model("Consumer", consumerSchema);
const CartItems = mongoose.model("CartItems", cartItemSchema);
const Orders = mongoose.model("Orders", orderSchema);
const WishList = mongoose.model("WishList", wishListSchema);
module.exports = { Consumer, CartItems, Orders, WishList };
