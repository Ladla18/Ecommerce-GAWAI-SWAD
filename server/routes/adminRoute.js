const express = require('express');
const adminController = require("../controllers/adminController");
const authenticateToken = require('../middlewares/authenticateToken');
const router =  express.Router();


router.post("/adminsignup",adminController.adminSignUp)
router.get("/admindashboard",authenticateToken,adminController.adminDashboard)
router.get("/getallusers",adminController.getAllUsers);

module.exports = router