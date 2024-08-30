import React from 'react'
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import { useNavigate, Link } from "react-router-dom";
const ConsumerNeed = ({userDetail,logout}) => {
  return (
    <>
      <div className="me-3 mt-1">
        <Dropdown className="">
          <Dropdown.Toggle
            variant="warning"
            id="dropdown-basic"
            className="d-flex align-items-center"
          >
            <div className="d-flex align-items-center">
              <Nav.Link className="p-0 m-0">
                <img
                  style={{ display: "inline", marginRight: "10px" }}
                  src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
                  width="30px"
                  alt="Profile"
                />
              </Nav.Link>
              <span className="me-2">{userDetail}</span>
            </div>
            <span className="dropdown-arrow ms-2"></span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <Nav.Link
                as={Link}
                className="bg-warning text-dark rounded-2 ms-5 "
                to="/yourorders"
              >
                Your Orders
              </Nav.Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Nav.Link
                as={Link}
                className="bg-danger text-light  rounded-2 ms-5"
                to="/wishlist"
              >
                Wishlist &#9829;
              </Nav.Link>
            </Dropdown.Item>
            <Dropdown.Item>
              <Nav.Link
                className="text-warning text-center"
                style={{
                  marginTop: "3px",

                  marginLeft: "5px",
                }}
                onClick={logout}
              >
                Logout
              </Nav.Link>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

export default ConsumerNeed