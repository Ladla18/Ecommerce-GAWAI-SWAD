const {
  Consumer,
  CartItems,
  Orders,
  WishList,
} = require("../models/consumerModel");
const { AddProduct, Seller } = require("../models/sellerModel");
const Ticket = require("../models/ticketModel");
const mongoose = require("mongoose");

module.exports.raiseTicket = async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  const newTicket = new Ticket({
    ticketTitle: title,
    ticketDescription: description,
  });
  console.log(id);
  const savedTicket = await newTicket.save();
  const sellerdata = await Seller.findById(id);
  console.log(sellerdata);
  if (sellerdata.usertype == "seller") {
    const sellerTic = await Seller.findByIdAndUpdate(
      id,
      {
        $push: {
          tickets: savedTicket._id,
        },
      },
      { new: true }
    );
  }
  const consumer = await Consumer.findByIdAndUpdate(
    id,
    {
      $push: {
        tickets: savedTicket._id,
      },
    },
    { new: true }
  );
};
module.exports.fetchTickets = async (req, res) => {
  const id = req.params.id;
  console.log("fetch called");

  try {
    const seller =await  Seller.findById(id);
    console.log(seller)
    if (seller.usertype == "seller") {
      const sellertickets = await Seller.findById(id).populate("tickets");
      console.log(sellertickets)
      res.json(sellertickets.tickets);
    }
  else{
      const consumerticket = await Consumer.findById(id).populate("tickets");

      if (!consumerticket) {
        // If no consumer is found, return a 404 error
        return res.status(404).json({ message: "Consumer not found" });
      }

      res.json(consumerticket.tickets);
  }
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.closeTicket = async (req, res) => {
  console.log("close ticket called");
  const id = req.params.id;
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { $set: { isClosed: true } },
      { new: true }
    );
    res.json({ message: "Your ticket is closed" });
  } catch (err) {
    console.error(err);
  }
};
