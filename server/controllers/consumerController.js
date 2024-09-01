const {
  Consumer,
  CartItems,
  Orders,
  WishList,
} = require("../models/consumerModel");
const bcrypt = require("bcryptjs");
const { AddProduct, Seller } = require("../models/sellerModel");
const { findById } = require("../models/adminModel");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const { json } = require("body-parser");

module.exports.consumerSignUp = async (req, res) => {
  console.log("Signup called")
  const { consumername, consumeremail, consumerpassword } = req.body;
  try {
    const existingEmail = await Consumer.findOne({ consumeremail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    } else {
      const hashpassword = await bcrypt.hash(consumerpassword, 10);
      const consumer = await Consumer.create({
        consumername,
        consumeremail,
        consumerpassword: hashpassword,
      });

      return res.status(201).json({ message: "Consumer created successfully", data: consumer });
    }
  } catch (err) {
    res.status(500).json({ message: "Error creating consumer", error: err });
  }
};

module.exports.consumerDashboard = async (req, res) => {
  try {
    const consumer = await Consumer.findById(req.authData.user._id);
    const products = await Seller.find().populate("sellerproducts");
    console.log(products);
    res.json({
      message: "Consumer dashboard",
      consumer: consumer,
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      message: "There was some error during authentication",
      error: err,
    });
  }
};
module.exports.categoryFilter = async (req, res) => {
  try {
    const id = req.params.id;
    const consumer = await Consumer.findById(id);
    const products = await Seller.find().populate("sellerproducts");
    console.log(products);
    res.json({
      message: "Consumer dashboard",
      consumer: consumer,
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      message: "There was some error during authentication",
      error: err,
    });
  }
};

module.exports.specificProductDetail = async (req, res) => {
  const { sid, pid } = req.params;
  try {
    const seller = await Seller.findById(sid);
    const product = await AddProduct.findById(pid);
    res.json({ message: "Product details", seller, product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching product details", error: err });
  }
};

module.exports.addToCart = async (req, res) => {
  const id = req.params.id;
  const pid = req.params.pid;
  const sid = req.params.sid;
  console.log(`consumer id for add to cart ${id}`);

  const {
    productname,
    productprice,
    productimage,
    productquantity,
    productid,
  } = req.body;

  try {
    const consumerDetails = await Consumer.findById(id).populate("cartitem");

    // Check if the product is already in the cart
    const productExists = consumerDetails.cartitem.some(
      (item) => item.productid.toString() === pid && item.inCart === true
    );

    if (productExists) {
      // If the product is already in the cart, send a message
      res.json({ message: "Already In Cart" });
    } else {
      // If the product is not in the cart, add it
      const cartItems = new CartItems({
        sellerid: sid,
        productid,
        productname,
        productprice,
        productimage,
        productquantity,
      });
      await cartItems.save();

      await Consumer.findByIdAndUpdate(
        id,
        {
          $push: { cartitem: cartItems._id },
        },
        { new: true }
      );

      res.json({ message: "Added To Cart" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err });
  }
};

module.exports.getCartItem = async (req, res) => {
  const id = req.params.id;

  try {
    const consumerDetails = await Consumer.findById(id).populate("cartitem");
    res.json(consumerDetails.cartitem);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart items", error: err });
  }
};

module.exports.updateQauntity = async (req, res) => {
  console.log("update quantity called");
  const id = req.params.id;
  const updateQauntity = req.body;

  try {
    const quantity = Number(updateQauntity.updatedQauntity);
    console.log(quantity);
    if (isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid quantity value" });
    }
    await CartItems.findByIdAndUpdate(id, { productquantity: quantity });
    console.log("quant updated");
    res.json({ message: "Quantity Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating quantity", error: err });
  }
};

module.exports.deleteCartItem = async (req, res) => {
  try {
    const itemId = req.params.id; // ID of the cart item to delete
    const consumerId = req.params.sid; // ID of the consumer

    console.log("Cart Item ID:", itemId);
    console.log("Consumer ID:", consumerId);

    // Find the consumer by ID
    const consumer = await Consumer.findById(consumerId);
    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    // Delete the cart item by ID
    const deletedItem = await CartItems.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Remove the cart item ID from the consumer's cartItems array
    consumer.cartitem = consumer.cartitem.filter(
      (item) => item.toString() !== itemId
    );

    // Save the updated consumer document
    await consumer.save();

    res.json({ message: "Removed from cart", deletedItem: deletedItem });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error deleting item from cart", error: err });
  }
};

module.exports.landingPage = async (req, res) => {
  console.log("landing called");
  try {
    const product = await Seller.find().populate("sellerproducts");
    console.log(product);
    res.json({
      message: "Home Page",

      product: product,
    });
  } catch (err) {
    res.status(500).json({
      message: "There was some error during authentication",
      error: err,
    });
  }
};

module.exports.sendEmail = async (req, res) => {
  console.log("Send Email called");
  const { email, productname, productprice, seller, image } = req.body;
  console.log("image", image);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // pass: "",
  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // e.g., Gmail, Outlook
    auth: {
      user: "bsoft0727@gmail.com",
      pass: "viqv ypjd sfkg bifw",
    },
  });

  // Email options
  const mailOptions = {
    from: "bsoft0727@gmail.com",
    to: email,
    subject: "Shopping",
    text: `Thank you for Ordering ${productname} of ${productprice} from ${seller}`,
    html: `<h1 style="color: blue; text-align: center;">Thank You</h1> </br>    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
    console.log("Email sent success");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email" });
  }
};

module.exports.placeOrders = async (req, res) => {
  console.log("place order called");
  const items = req.body; // Assuming req.body is an array of cart items

  const uid = req.params.id;
  const orderdate = new Date();
  const orderid = Math.floor(Math.random() * 1_000_000);

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items to place in order" });
  }

  try {
    // Create and save the order
    const order = new Orders({
      orderid: orderid,
      orderdate: orderdate,
      orderproduct: items.map((item) => item._id), // Collecting all product IDs
    });

    const savedOrder = await order.save();
    console.log(savedOrder);
    // Mark cart items as ordered
    const cartItemsUpdatePromises = items.map((item) =>
      CartItems.findByIdAndUpdate(
        item._id,
        { isOrdered: true, inCart: false },

        { new: true }
      )
    );

    await Promise.all(cartItemsUpdatePromises);

    // Update the consumer with the order ID
    const consumer = await Consumer.findByIdAndUpdate(
      uid,
      {
        $push: { orders: savedOrder._id },
      },
      { new: true }
    );
    // Create a Set to store unique seller IDs
    const uniqueSellerIds = new Set();

    // Collect unique seller IDs from the items
    items.forEach((i) => {
      uniqueSellerIds.add(i.sellerid);
    });

    // Loop through unique seller IDs and update each seller
    uniqueSellerIds.forEach(async (sellerId) => {
      await Seller.findByIdAndUpdate(
        sellerId,
        {
          $push: {
            orders: savedOrder._id,
          },
        },
        { new: true }
      );
    });
    console.log("Order placed successfully");
    res.json({
      message: "Order placed successfully",
      order: savedOrder,
      consumer: consumer,
    });
  } catch (e) {
    console.log("Error placing order:", e);
    res.status(500).json({
      message: "An error occurred while placing the order",
      error: e.message,
    });
  }
};
module.exports.placeSingleOrder = async (req, res) => {
  console.log("Single Product order called");
  const id = req.params.id;
  const sid = req.params.sid;
  console.log("User id", id);
  const item = req.body;

  try {
    const orderdate = new Date();
    const orderid = Math.floor(Math.random() * 1_000_000);
    const newOrder = new Orders({
      orderid: orderid,
      orderdate: orderdate,
      singleorder: item,
    });
    const savedOrder = await newOrder.save();
    const consumer = await Consumer.findByIdAndUpdate(
      id,
      {
        $push: { orders: savedOrder._id },
      },
      { new: true }
    );
    const seller = await Seller.findByIdAndUpdate(
      sid,
      {
        $push: { orders: savedOrder._id },
      },
      { new: true }
    );
    console.log("saved order", savedOrder);
    res.json({ msg: "Order Placed Successfully" });
  } catch (e) {
    console.log("Error creating order:", e);
  }
};
module.exports.getSingleOrders = async (req, res) => {
  const uid = req.params.uid;
  console.log("Singleorderget called", uid);
  try {
    const consumer = await Consumer.findById(uid).populate({
      path: "orders",
      populate: {
        path: "singleorder", // Nested population
        model: "Product",
      },
    });
    res.json(consumer);
  } catch (e) {
    console.log("Error fetching orders:", e);
  }
};
module.exports.getYourOrders = async (req, res) => {
  console.log("Your Order is called");
  const uid = req.params.uid;

  // Check if uid is valid
  if (!mongoose.isValidObjectId(uid)) {
    console.error("Invalid ObjectId:", uid);
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const consumer = await Consumer.findById(uid).populate({
      path: "orders",
      populate: {
        path: "orderproduct", // Nested population
        model: "CartItems",
      },
    });

    if (!consumer) {
      console.error("No consumer found with the provided ID.");
      return res.status(404).json({ error: "Consumer not found" });
    }

    res.status(200).json(consumer); // Return the populated consumer object
  } catch (e) {
    console.error("Error fetching consumer orders:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.addToWishList = async (req, res) => {
  console.log("wishlist called");
  const { sid, pid, cid } = req.params;
  console.log("Consumer id =", cid);

  try {
    // Find the seller and populate the products
    const sdata = await Seller.findById(sid).populate("sellerproducts");
    if (!sdata) {
      console.log("Seller not found");
      return res.status(404).json({ message: "Seller not found" });
    }

    // Find the product within the seller's products
    const product = sdata.sellerproducts.find(
      (product) => product._id.toString() === pid
    );

    if (!product) {
      console.log("Product not found in seller's products");
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the consumer
    const consumer = await Consumer.findById(cid);
    if (!consumer) {
      console.log("Consumer not found");
      return res.status(404).json({ message: "Consumer not found" });
    }

    // Check if the product is already in the consumer's wishlist
    const productInWishlist = await WishList.findOne({
      _id: { $in: consumer.wishlist },
      productname: product.productName,
    });

    if (productInWishlist) {
      // If product exists in wishlist, remove it
      await WishList.findByIdAndDelete(productInWishlist._id);
      await Consumer.findByIdAndUpdate(
        cid,
        { $pull: { wishlist: productInWishlist._id } },
        { new: true }
      );
      console.log("Product removed from wishlist");
      return res.status(200).json({ message: "Product removed from wishlist" });
    } else {
      // If product does not exist in wishlist, add it
      const wishlist = new WishList({
        productid: product._id,
        productname: product.productName,
        productimage: product.productImage,
        productprice: product.productPrice,
      });
      const savedWishlist = await wishlist.save();
      await Consumer.findByIdAndUpdate(
        cid,
        { $push: { wishlist: savedWishlist._id } },
        { new: true }
      );
      console.log("Product added to wishlist");
      return res.status(200).json({ message: "Product added to wishlist" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "An error occurred", error: err });
  }
};

module.exports.fetchWishlist = async (req, res) => {
  console.log("Wishlist called");
  const { cid } = req.params;
  console.log(cid);
  try {
    const consumer = await Consumer.findById(cid).populate("wishlist");
    res.json({ consumer });
  } catch (err) {
    res.json({ message: "Coudnt Fetch Wishlist" });
  }
};
module.exports.deleteWishlistItems = async (req, res) => {
  console.log("Delete wishlist item called");
  const { wid } = req.params;
  try {
    const wishlistDelete = await WishList.findByIdAndDelete(wid);
    res.json({ message: "Wishlist item deleted" });
  } catch (err) {
    json({ message: "Error during deleting" });
  }
};



module.exports.searchProduct = async (req, res) => {
  console.log("Search product called");
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Split the query into individual words
    const words = query.split(/\s+/); // Split by spaces

    // Create an array of regular expressions for each word
    const regexArray = words.map((word) => new RegExp(word, "i"));

    console.log("Search Regex Array:", regexArray);

    // Create an array of search conditions for each field
    const searchConditions = regexArray.map((regex) => ({
      $or: [
        { productName: regex },
        
        // Add other fields as needed
      ],
    }));

    console.log("Search Conditions:", searchConditions);

    // Combine all search conditions with $or
    const products = await AddProduct.find({
      $or: searchConditions,
    });

    console.log("Search Results:", products);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};