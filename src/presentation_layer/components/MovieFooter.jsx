import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsInfoCircle, BsEnvelope, BsLifePreserver, BsShield } from "react-icons/bs";

const MovieFooter = () => {
  return (
    <footer className="bg-body-tertiary text-secondary border-top border-secondary mt-auto">
      <Container fluid className="pt-5 pb-4 px-4">

        {/* Top Section */}
        <Row className="gy-4 align-items-start justify-content-between">

          {/* Logo + About */}
          <Col lg={4} md={6} className="footer-brand">
  <div className="d-flex align-items-center mb-3 footer-logo">
    <span
      className="bg-warning text-dark fw-bold px-4 py-2 rounded"
      style={{
        fontSize: '1.3rem',
        letterSpacing: '1px',
        cursor: 'default'
      }}
    >
      IMDb
    </span>
  </div>
  <p className="lh-lg text-dark fw-bold mt-2">
    Your Entertainment Hub — discover movies, shows, ratings, and reviews with a modern and clean experience.
  </p>
</Col>


          {/* Company Section with Privacy */}
          <Col lg={3} md={6} className="footer-links">
<<<<<<< HEAD
          
=======
            <h6 className="text-uppercase text-white fw-semibold mb-3">
              Info.
            </h6>
>>>>>>> b8715d7c3d82f020a962cfa29a67382d638ed773
            <ul className="list-unstyled small">
              <li className="mb-2 d-flex align-items-center">
                <BsInfoCircle className="me-2 text-dark" />
                <Link className="footer-link fw-bold" to="/about">About</Link>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <BsEnvelope className="me-2 text-dark " />
                <Link className="footer-link fw-bold" to="/contact">Contact</Link>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <BsLifePreserver className="me-2 text-dark" />
                <Link className="footer-link fw-bold" to="/support">Support</Link>
              </li>
              <li className="d-flex align-items-center">
                <BsShield className="me-2 text-dark" />
                <Link className="footer-link fw-bold" to="/privacy">Privacy</Link>
              </li>
            </ul>
          </Col>

        </Row>

        {/* Bottom Section */}
        <Row className="border-top border-secondary pt-3 mt-4 small align-items-center">
          <Col className="text-center text-md-center text-dark fw-bold">
            © {new Date().getFullYear()} IMDB. All rights reserved.
          </Col>
        </Row>

      </Container>
    </footer>
  );
};

export default MovieFooter;
