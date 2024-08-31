const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const {
  Consumer,
  CartItems,
  Orders,
  WishList,
} = require("../models/consumerModel");
const { Seller, AddProduct } = require("../models/sellerModel");
const Ticket = require("../models/ticketModel")

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
  console.log("Geting all users called");
  try {
    const consumers = await Consumer.find()
      .populate("orders")
      .populate("tickets");
    const sellers = await Seller.find().populate("orders").populate("tickets");
    const alltickets = await  Ticket.find();

    res.json({ consumers: consumers, sellers: sellers,tickets:alltickets });
  } catch (Err) {
    console.log(Err);
  }
};
module.exports.deleteSeller = async (req, res) => {
  console.log("delete seller called");
  try {
    const sellerId = req.params.id;
    const seller = await Seller.findByIdAndDelete(sellerId);
    res.json(seller);
  } catch (err) {
    console.log(err);
  }
};
module.exports.deleteUser = async (req, res) => {
  console.log("delete user called");
  const userId = req.params.id;
  console.log(userId);
  try {
    const user = await Consumer.findByIdAndDelete(userId);
  } catch (err) {
    console.log(err);
  }
};

module.exports.consumerTicketDetails = async(req,res)=>{
  console.log("getting consumer ticket details called");
  try{
    const id =  req.params.id;
    const consumer = await Consumer.findById(id).populate('orders').populate('tickets')
    res.json(consumer)

  }
  catch(e){
    console.log(e);
  }
}
module.exports.sellerTicketsDetails = async (req,res)=>{
  console.log("getting seller ticket details called");
  try{
    const id = req.params.id;
    const seller = await Seller.findById(id).populate('orders').populate('tickets')
    res.json(seller)
  }
  catch(e){
    console.log(e);
  }
}
module.exports.resolveConsumerTicker = async (req,res)=>{
  console.log("resolving consumer ticket called");
  try{
    const id = req.params.id;
    const ticket = await Ticket.findByIdAndUpdate(id,
      {$set:{isResolved:true}}
    )
    res.json(ticket)
  }
  catch(e){
    console.log(e);
  }
}
module.exports.bannedConsumer = async(req,res)=>{
  console.log("banning consumer called");
  try{
    const id = req.params.id;
    const consumer = await Consumer.findByIdAndUpdate(id,
      {$set:{isBanned:true}}
      )
      res.json(consumer)
      }
      catch(e){
        console.log(e);
        }

}
module.exports.bannedSeller = async(req,res)=>{
  console.log("banning seller called");
  try{
    const id = req.params.id;
    const seller = await Seller.findByIdAndUpdate(id,
      {$set:{isBanned:true}}
      )
      res.json(seller)
    }
    catch(E){
      console.log(E);
    }
}