const {Seller,AddProduct} = require("../models/sellerModel");
const {Consumer,CartItems} = require("../models/consumerModel");
const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
module.exports.sellerSignUp = async (req, res) => {
  const {
    sellercompanyname,
    sellername,
    selleremail,
    sellerpassword,
    sellerphone,
    selleraddress,
    agreeToTerms,
  } = req.body;

  try {
    const existingSeller = await Seller.findOne({selleremail})
    if(existingSeller){
      return res.status(400).json({message:"Seller already exists with this email."})
    }
    const hashpassword = await bcrypt.hash(sellerpassword, 10);
    const seller = new Seller({
      sellercompanyname,
      sellername,
      selleremail,
      sellerpassword: hashpassword,
      sellerphone,
      selleraddress,
      agreeToTerms,
    });
    await seller.save();
    res.json(seller);
  } catch (err) {
    console.log(err);
    res.json({ err: "Unable to fetch data" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const seller = await Seller.findOne({ selleremail: email });
    if (!seller) {
      const consumer = await Consumer.findOne({ consumeremail: email });
      if (!consumer) {
        const admin = await Admin.findOne({ adminemail: email });
        const match = await bcrypt.compare(password, admin.adminpassword);
        if (match && admin.usertype == "admin") {
            const token = jwt.sign({ user: admin}, "MYSECRET",{expiresIn:"1d"})
          res.json({ message: "Admin logged in successfully", logger: admin , token});
        }
      } else if (consumer.usertype == "consumer") {
        const match = await bcrypt.compare(password, consumer.consumerpassword);
        if (match) {
            const token = jwt.sign({ user: consumer }, "MYSECRET", {
              expiresIn: "1d",
            });
          res.json({
            message: "Consumer logged in successfully",
            logger: consumer,
            token
          });
        }
      }
    } else if (seller.usertype == "seller") {
      const match = await bcrypt.compare(password, seller.sellerpassword);
      if (match) {
         const token = jwt.sign({ user: seller }, "MYSECRET", {
           expiresIn: "1d",
         });
        res.json({ message: "Seller logged in successfully",logger:seller,token });
      }
    } else {
      return res.json({ err: "Invalid Password" });
    }
  } catch (err) {
    console.log(err);
    res.json({ message: "Cannot get data from request" });
  }
};

module.exports.sellerDashboard = async(req,res)=>{

   try { 
    console.log(req.authData.user._id);
     const seller = await Seller.findById(req.authData.user._id);
     res.json({
       message: "Seller dashboard",
       seller: seller,
     });  
   } catch (err) {
     res.status(500).json({
       message: "There was some error during authentication",
       error: err,
     });
   }
}

module.exports.addProducts =  async (req, res) => {
  try {
    const {
      productName,
      productDescription,
      productCategory,
      productPrice,
      sizes,
    } = req.body;
    console.log(req.file)
    const productImage = req.file.path;
  
    const newProduct = new AddProduct({
      sellerid:req.authData.user._id,
      productName,
      productDescription,
      productCategory,
      productPrice,
   productImage,
      sizes,
    });
    await newProduct.save();
    const sellerproducts = await Seller.findByIdAndUpdate(
      req.authData.user._id,
      {
        $push: {
          sellerproducts: newProduct._id,
        },
      },
      { new: true }
    );
    
    res.status(201).json({ message: "Product added successfully!" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err);
  }
}
module.exports.getProductDetailToEdit = async(req,res)=>{
  console.log("getProductDetailToEdit called");
  const  productId = req.params.id;
  try{
    const product = await AddProduct.findById(productId)
    res.json(product)
  }
  catch(e){
    res.status(500).json({message:"Error while fetching product details",error:e});
  }

}
module.exports.updateSellerProduct = async (req, res) => {
  console.log("Update called");
  const { uid, pid } = req.params;

  try {
    const {
      productName,
      productDescription,
      productCategory,
      productPrice,
      sizes,
    } = req.body;

    let updateData = {
      productName,
      productDescription,
      productCategory,
      productPrice,
      sizes,
    };

    // Check if an image file is provided
    if (req.file) {
      updateData.productImage = req.file.path;
    }

    const product = await AddProduct.findByIdAndUpdate(pid, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Update Successful");
    res.json({ message: "Update Successful", product });
  } catch (error) {
    console.error("Error while updating product:", error);
    res.status(500).json({ message: "Error while updating product", error });
  }
};
module.exports.deleteProduct = async(req,res)=>{
  console.log("delete seller product called")
  const id = req.params.id
  const sid = req.params.sid
  console.log("sid",sid)
  try{
    const product = await AddProduct.findByIdAndDelete(id)
    const seller = await Seller.findById(sid)
    seller.sellerproducts.pull(id)
    await seller.save()
    res.status(200).json({message: "Product deleted successfully!"})
    }catch(err){
      res.status(500).json({err: err.message})
    }
}

module.exports.sellerOrders = async (req,res)=>{
    const sid = req.params.sid
    console.log("seller id",sid)
    try{
      const orders = await Seller.findById(sid).populate({
        path: "orders",
        populate: [
          {
            path: "orderproduct", // Nested population
            model: "CartItems",
          },
          {
            path: "singleorder",
            model: "Product",
          },
        ],
      });
      res.json(orders)
    }
    catch(er){
      res.status(500).json({err: er.message})

    }
}