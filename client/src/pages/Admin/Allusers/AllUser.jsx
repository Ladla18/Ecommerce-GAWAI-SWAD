import React, { useState,useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
const AllUser = () => {
    const [adminId,setAdminId] = useState()
    const [consumers,setConsumers] = useState([])
    const [sellers,setSellers] = useState([])

    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);

          setAdminId(decodedToken.user._id);
          console.log("Admin Id", decodedToken.user._id);
        } catch (error) {
          console.error("Failed to decode token", error);
        }
      }
    };
    useEffect(() => {
      checkLoginStatus();
    },[]);

    useEffect(()=>{
        const fetchUsers =async()=>{
            try{
                const response = await axios.get(`http://localhost:3000/api/getallusers`)
                setConsumers(response.data.consumers)
                setSellers(response.data.sellers)
                console.log(response.data.consumers);
                console.log(response.data.sellers);
            }
            catch(error){
                console.log(error)
            }
        }
        fetchUsers()
    },[])
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <h2 className="text-center my-3">Consumers</h2>
          <table className="table table-striped">
            <thead className="">
              <tr className="">
                <th className="text-bg-dark">Name</th>
                <th className="text-bg-dark">Email</th>
                <th className="text-bg-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consumers.map((c) => (
                <tr key={c._id}>
                  <td>{c.consumername}</td>
                  <td>{c.consumeremail}</td>
                  <td>
                    <button className="btn btn-primary p-1 rounded-0">
                      More Info
                    </button>
                    <button className="btn btn-danger p-1 rounded-0 ms-2">
                      Ban User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-sm-6">
          <h2 className="text-center my-3">Sellers</h2>
          <table className="table table-striped">
            <thead className="">
              <tr className="">
                <th className="text-bg-dark">Name</th>
                <th className="text-bg-dark">Email</th>
                <th className="text-bg-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((c) => (
                <tr key={c._id}>
                  <td>{c.sellername}</td>
                  <td>{c.selleremail}</td>
                  <td>
                    <button className="btn btn-primary p-1 rounded-0">
                      More Info
                    </button>
                    <button className="btn btn-danger p-1 rounded-0 ms-2">
                      Ban Seller
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllUser