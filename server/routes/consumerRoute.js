const express = require("express");
const router = express.Router();
const consumerController = require("../controllers/consumerController");

const authenticateToken = require("../middlewares/authenticateToken");

router.post("/consumersignup",consumerController.consumerSignUp)
router.get("/consumerdashboard",authenticateToken,consumerController.consumerDashboard)
router.get("/categoryfilter/:id",consumerController.categoryFilter)
router.get("/specificproductdetail/:sid/:pid",consumerController.specificProductDetail)
router.post("/addtocart/:id/:pid/:sid",consumerController.addToCart)
router.post("/placeorders/:id",consumerController.placeOrders)
router.post("/placesingleorder/:id/:sid", consumerController.placeSingleOrder);
router.get("/singleorders/:uid", consumerController.getSingleOrders);
router.get("/yourorders/:uid",consumerController.getYourOrders)
router.get("/getcartitem/:id",consumerController.getCartItem)
router.post("/updatequantity/:id",consumerController.updateQauntity);
router.delete("/deletecartitem/:id/:sid",consumerController.deleteCartItem);
router.get("/landingpage",consumerController.landingPage)
router.post("/addtowishlist/:sid/:pid/:cid",consumerController.addToWishList)
router.get("/fetchwishlist/:cid",consumerController.fetchWishlist);
router.delete("/deletewishlist/:wid",consumerController.deleteWishlistItems)
router.post("/sendemail",consumerController.sendEmail)
module.exports = router