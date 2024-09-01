const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  consumerId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for consumers
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // Assuming a 1-5 star rating system
  },
  reviewText: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
