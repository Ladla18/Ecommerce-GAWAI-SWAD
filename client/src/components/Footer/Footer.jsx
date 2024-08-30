import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="row mt-5">
      <div className="col-sm-12 p-0 ">
        <footer className="bg-dark text-white py-5 px-0">
          <Container>
            <Row>
              <Col md={4}>
                <h5>About Us</h5>
                <p>
                  We are an e-commerce platform providing the best quality
                  products at the most competitive prices. Our mission is to
                  make shopping easy and enjoyable for everyone.
                </p>
              </Col>
              <Col md={4}>
                <h5>Quick Links</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#" className="text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white">
                      Shop
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white">
                      FAQs
                    </a>
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <h5>Follow Us</h5>
                <div>
                  <a href="#" className="text-white me-2">
                    <FaFacebook size={24} />
                  </a>
                  <a href="#" className="text-white me-2">
                    <FaTwitter size={24} />
                  </a>
                  <a href="#" className="text-white me-2">
                    <FaInstagram size={24} />
                  </a>
                  <a href="#" className="text-white">
                    <FaLinkedin size={24} />
                  </a>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="text-center">
                <p>
                  &copy; {new Date().getFullYear()} Your E-Commerce Website. All
                  Rights Reserved.
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
