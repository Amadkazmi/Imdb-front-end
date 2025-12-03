import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const MovieFooter = () => {
  return (
    <footer className="bg-dark text-secondary border-top border-secondary mt-auto">
      <Container fluid className="pt-5 pb-4 px-4">   {/* FIXED */}

        <Row className="gy-4">

          <Col lg={3} md={6}>
            <h4 className="text-warning fw-bold">IMDB</h4>
            <p className="small lh-lg">
              Explore trending movies, TV shows, trailers and reviews — all in one platform.
            </p>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="text-uppercase text-white fw-semibold mb-3">Movies</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a className="link-secondary link-warning-hover" href="#">Top Rated</a></li>
              <li className="mb-2"><a className="link-secondary link-warning-hover" href="#">Now Playing</a></li>
              <li><a className="link-secondary link-warning-hover" href="#">Genres</a></li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="text-uppercase text-white fw-semibold mb-3">TV Shows</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a className="link-secondary link-warning-hover" href="#">Popular Shows</a></li>
              <li className="mb-2"><a className="link-secondary link-warning-hover" href="#">New Episodes</a></li>
              <li className="mb-2"><a className="link-secondary link-warning-hover" href="#">Trending</a></li>
              </ul>
          </Col>

          <Col lg={3} md={6}>
            <h6 className="text-uppercase text-white fw-semibold mb-3">Company</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a className="link-secondary link-warning-hover" href="#">About</a></li>
           <li className="mb-2"><a className="link-secondary link-warning-hover" href="#">Press</a></li>
              <li><a className="link-secondary link-warning-hover" href="#">Contact</a></li>
            </ul>
          </Col>

        </Row>

        <Row className="border-top border-secondary pt-3 mt-4 small align-items-center">
          <Col md={6} className="text-center text-md-start">
            © {new Date().getFullYear()} IMDB. All rights reserved.
          </Col>
          <Col md={6} className="text-center text-md-end mt-2 mt-md-0">
            <span className="me-3">Privacy</span>
            <span className="me-3">Terms</span>
            <span>Support</span>
          </Col>
        </Row>

      </Container>
    </footer>
  );
};

export default MovieFooter;
