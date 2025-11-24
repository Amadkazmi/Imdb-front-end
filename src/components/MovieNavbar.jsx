import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas, Form, InputGroup } from 'react-bootstrap';

const MovieNavbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const searchText = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchText.current) {
      const query = searchText.current.value.trim();
      if (query) {
        console.log("Searching for:", query);
        // Add your search logic here
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Movies', href: '#' },
    { label: 'TV Shows', href: '#' },
    { label: 'Celebs', href: '#' },
    { label: 'News', href: '#' },
    { label: 'Watchlist', href: '#' }
  ];

  return (
    <>
      {/* Top Row - Only Logo, Search, and Auth */}
      <Navbar bg="dark" variant="dark" className="border-bottom border-secondary py-2" fixed="top">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center w-100">
            
            {/* Logo - Always visible */}
            <Navbar.Brand href="#" className="fw-bold text-warning fs-4 me-2 me-md-3">
              MDB
            </Navbar.Brand>

            {/* Search Bar - Always visible on all screens */}
            <div className="flex-grow-1 mx-2 mx-md-3">
              <InputGroup size="sm">
                <Form.Control
                  ref={searchText}
                  type="text"
                  placeholder="Search movies, TV shows..."
                  className="bg-light text-dark"
                  onKeyPress={handleKeyPress}
                />
                <Button variant="warning" onClick={handleSearch}>
                  <span className="d-none d-sm-inline">Search</span>
                  <span className="d-sm-none">🔍</span>
                </Button>
              </InputGroup>
            </div>

            {/* Auth Buttons - Always visible */}
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-warning" 
                size="sm" 
                className="me-1 me-sm-2 d-none d-sm-block"
              >
                Sign In
              </Button>
              <Button 
                variant="warning" 
                size="sm" 
                className="d-none d-sm-block"
              >
                Sign Up
              </Button>
              
              {/* Mobile Auth Icons */}
              <Button 
                variant="outline-warning" 
                size="sm" 
                className="me-1 d-sm-none"
                title="Sign In"
              >
                👤
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                ref={mobileMenuRef}
                className="d-md-none"
              >
                ☰
              </Button>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Second Row - Navigation Links (Desktop only) */}
      <Navbar bg="dark" variant="dark" className="border-bottom border-secondary py-1 d-none d-md-block" style={{ marginTop: '56px' }}>
        <Container fluid>
          <Nav className="justify-content-center w-100">
            {navLinks.map((link, index) => (
              <Nav.Link
                key={index}
                href={link.href}
                className="fw-semibold text-white mx-2 mx-lg-3"
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="text-warning">
            MOVIEDB
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Mobile Navigation Links */}
          <Nav className="flex-column">
            {navLinks.map((link, index) => (
              <Nav.Link
                key={index}
                href={link.href}
                className="text-white py-3 border-bottom border-secondary"
                onClick={() => setShowMobileMenu(false)}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          
          {/* Mobile Auth Buttons - Full width */}
          <div className="mt-4 pt-3 border-top border-secondary">
            <div className="d-grid gap-2">
              <Button variant="outline-warning" size="lg">
                Sign In
              </Button>
              <Button variant="warning" size="lg">
                Sign Up
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Spacer for fixed navbar - Responsive height */}
      <div style={{ height: '56px' }} className="d-md-none"></div>
      <div style={{ height: '84px' }} className="d-none d-md-block"></div>
    </>
  );
};

export default MovieNavbar;