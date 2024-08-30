const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const {
  Consumer,
  CartItems,
  Orders,
  WishList,
} = require("../models/consumerModel");
const { Seller, AddProduct } = require("../models/sellerModel");
module.exports.adminSignUp = async (req, res) => {
  const { id, password } = req.body;

  try {
    const hashpassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      adminemail: id,
      adminpassword: hashpassword,
    });
    await admin.save();
    res.json(admin);
  } catch (err) {
    res.json(err);
  }
};

module.exports.adminDashboard = async (req, res) => {
  try {
    if (req.authData) {
      res.json(req.authData.user._id);
    } else {
      res.json({ message: "You are not logged in" });
    }
  } catch (err) {
    res.json(err);
  }
};

module.exports.getAllUsers = async (req, res) => {
  console.log("Geting all users called")
  try {
    const consumers = await Consumer.find()
    const sellers = await Seller.find()
    res.json({consumers:consumers,sellers:sellers})
  } catch (Err) {
    console.log(Err);
  }
};
