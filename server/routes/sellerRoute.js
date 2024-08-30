const express = require("express")
router = express.Router();
const sellerController = require("../controllers/sellerController");
const authenticateToken = require("../middlewares/authenticateToken");


router.post("/sellersignup",sellerController.sellerSignUp)
router.post("/login",sellerController.login)
router.get("/sellerdashboard",authenticateToken,sellerController.sellerDashboard)
router.post("/addproduct",authenticateToken,sellerController.addProducts)
router.get("/getproductforedit/:id",sellerController.getProductDetailToEdit);
router.post("/updateproduct/:uid/:pid",sellerController.updateSellerProduct)
router.delete("/deletesellerproduct/:id",sellerController.deleteProduct)
router.get("/sellerorders/:sid",sellerController.sellerOrders);


module.exports = router;