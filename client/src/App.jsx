import { Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Landingpage from "./pages/Landingpage/Landingpage";
import SignUp from "./components/SignupConsumer/SingUpConsumer";
import Header from "./components/Navbar/Navbar";
import SignupSeller from "./components/SignupSeller/SignupSeller";
import Login from "./components/Login/Login";
import SignupConsumer from "./components/SignupConsumer/SingUpConsumer";
import ConsumerDashboard from "./pages/User/Consumer/ConsumerDashboard/ConsumerDashboard";
import SellerDashboard from "./pages/User/Seller/SellerDashboard/SellerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import Addproducts from "./pages/User/Seller/Addproducts/Addproducts";
import ProductList from "./pages/User/Seller/ViewProducts/ViewProducts";
import SpecificProduct from "./pages/User/Consumer/SpecificProduct/SpecificProduct";

import Cart from "./pages/User/Consumer/Cart/Cart";
import MenCategory from "./pages/User/Consumer/Men/MenCategory";
import WomenCategory from "./pages/User/Consumer/Women/WomenCategory";
import KidsCategory from "./pages/User/Consumer/Kids/KidsCategory";
import AdminVerification from "./pages/Admin/AdminVerification/AdminVerification";
import EmployeeCreation from "./pages/Admin/EmployeeCreation/EmployeeCreation";
import Unauthorized from "./pages/Unauthorized.jsx/Unauthorized";
import ModifyProduct from "./pages/User/Seller/ModifyProduct/ModifyProduct";
import YourOrders from "./pages/User/Consumer/YourOrders/YourOrders";
import WishList from "./pages/User/Consumer/WishList/WishList";
import Ticket from "./pages/User/Ticket/Ticket";
import SellerOrder from "./pages/User/Seller/Orders/SellerOrder";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AllUser from "./pages/Admin/Allusers/AllUser";
import Footer from "./components/Footer/Footer";
function App() {

  return (
    <>
      <div className="container-fluid p-0">
        <Header />
        <Routes>
          {/* Unauthorized */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<div className="display-1 text-center mt-5">Page Not Found</div>}/>


          {/* Consumer */}
          <Route path="/" element={<Landingpage />} />
          <Route path="/consumersignup" element={<SignupConsumer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/consumerdashboard" element={<ConsumerDashboard />} />
          <Route path="/men" element={<MenCategory />} />
          <Route path="/women" element={<WomenCategory />} />
          <Route path="/kids" element={<KidsCategory />} />
          <Route
            path="/productdetail/:sid/:pid"
            element={<SpecificProduct />}
          />
          <Route path="/yourorders" element={<YourOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishList/>}/>
          <Route path="/ticketdashboard" element={<Ticket/>} />
          {/* Seller */}
          <Route path="/sellersignup" element={<SignupSeller />} />
          <Route path="/sellerdashboard" element={<SellerDashboard />} />
          <Route path="/seller/addproduct" element={<Addproducts />} />
          <Route path="/seller/viewproducts" element={<ProductList />} />
          <Route path="/seller/orders" element={<SellerOrder/>} />
          <Route path="/updateproductdetails/:id" element={<ModifyProduct />} />

          {/* Admin */}
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/verify" element={<AdminVerification />} />
          <Route path="/admin/allusers" element={<AllUser />} />
          <Route path="/employeecreation" element={<EmployeeCreation />} />
        </Routes>
        <Footer/>
      </div>
    </>
  );
}

export default App;
