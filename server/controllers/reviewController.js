const {
  Consumer,
  CartItems,
  Orders,
  WishList,
} = require("../models/consumerModel");
const bcrypt = require("bcryptjs");
const { AddProduct, Seller } = require("../models/sellerModel");
const { findById } = require("../models/adminModel");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const { json } = require("body-parser");
const Review = require("../models/ReviewModel");

module.exports.submitReview = async (req, res) => {
  console.log("Review Submittion Called");
  const pid = req.params.id;
  const { rating, review, consumerId } = req.body;
  console.log(pid, rating, review, consumerId);
  const newReview = new Review({
    rating: rating,
    reviewText: review,
    productId: pid,
    consumerId: consumerId,
    
  });
  await newReview.save();
  const product = await AddProduct.findByIdAndUpdate(
    pid,
    {
      $push: { reviews: newReview._id },
    },
    { new: true }
  );
  console.log(product);
  res.json({ msg: "review added" });
};

module.exports.getReview = async (req, res) => {
  console.log("get revuiewcalled");
  try {
    const pid = req.params.id;
    const product = await AddProduct.findById(pid).populate({
      path: "reviews",
      populate: {
        path: "consumerId",
        model: "Consumer",
      },
    });
    res.json(product.reviews);
  } catch (e) {
    console.log(e);
  }
};
