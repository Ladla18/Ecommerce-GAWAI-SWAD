const express = require('express');
const adminController = require("../controllers/adminController");
const authenticateToken = require('../middlewares/authenticateToken');
const router =  express.Router();


router.post("/adminsignup",adminController.adminSignUp)
router.get("/admindashboard",authenticateToken,adminController.adminDashboard)
router.get("/getallusers",adminController.getAllUsers);
router.delete("/deleteseller/:id",adminController.deleteSeller)
router.delete("/deleteuser/:id",adminController.deleteUser)
router.get("/consumertic/:id", adminController.consumerTicketDetails);
router.get('/sellertic/:id',adminController.sellerTicketsDetails)
router.post("/resolveconsumerticket/:id",adminController.resolveConsumerTicker)
router.post("/bannedconsumer/:id",adminController.bannedConsumer)
router.post("/bannedseller/:id",adminController.bannedSeller)


module.exports = router