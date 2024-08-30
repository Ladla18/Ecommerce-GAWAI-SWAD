const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const adminSchema = new Schema({
  adminemail: {
    type: String,
    required: true,
  },
  adminpassword: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    default: "admin",
  },
});
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
