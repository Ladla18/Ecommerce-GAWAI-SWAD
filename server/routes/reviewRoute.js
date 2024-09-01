const express = require("express")
const router = express.Router()
const reviewController = require("../controllers/reviewController")

router.post("/submitreview/:id",reviewController.submitReview)
router.get("/getreview/:id",reviewController.getReview)

module.exports = router