import React from 'react'
import { Nav,OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
const CustomerSupport = () => {
  return (
    <>
      <Nav.Link
        className="ms-4"
        as={Link}
        to="/ticketdashboard"
        style={{ cursor: "pointer" }}
      >
        <OverlayTrigger
          placement="bottom" // Position of the tooltip
          overlay={
            <Tooltip id="help-support-tooltip">Help and Support</Tooltip> // Tooltip content
          }
        >
          <img
            src="https://cdn-icons-png.flaticon.com/128/4961/4961759.png"
            width="30px"
            alt="Help and Support"
          />
        </OverlayTrigger>
      </Nav.Link>
    </>
  );
}

export default CustomerSupport