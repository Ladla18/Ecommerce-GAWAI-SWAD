const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const sellerRoute = require("./routes/sellerRoute");
const consumerRoute = require("./routes/consumerRoute");
const adminRoute = require("./routes/adminRoute");
const ticketRoute = require("./routes/ticketRoute")
const reviewRoute = require("./routes/reviewRoute")
const { AddProduct, Seller } = require("./models/sellerModel");
const path = require("path");
const authenticateToken = require("./middlewares/authenticateToken");
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage: storage });

// Routes
app.use("/api", upload.single("productImage"), sellerRoute);
app.use("/api", consumerRoute);
app.use("/api", adminRoute);
app.use("/api", ticketRoute);
app.use("/api",reviewRoute)

app.get("/api/viewproducts", authenticateToken, async (req, res) => {
  try {
    const products = await Seller.findById(req.authData.user._id).populate(
      "sellerproducts"
    );
    console.log(products);
    res.status(200).json(products); // Send products as JSON response
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors
  }
});
mongoose
  .connect("mongodb+srv://ecom:amanladla@cluster0.en3tt.mongodb.net/ecommerce")
  .then(() => {
    console.log("Mongo Connected");
  })
  .catch(() => {
    console.log("Mongo Not Connected");
  });

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
