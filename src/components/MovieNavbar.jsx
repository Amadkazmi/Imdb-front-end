import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Button, Offcanvas } from 'react-bootstrap';

const MovieNavbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);

  // Check token
  const hasToken = !!localStorage.getItem('jwtToken');

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="border-bottom border-secondary py-2" fixed="top">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center w-100">

            {/* Logo */}
            <Navbar.Brand
              role="button"
              onClick={() => navigate('/')}
              className="d-flex align-items-center bg-warning text-dark fw-bold px-5 py-2 rounded"
              style={{ cursor: 'pointer', fontSize: '1.3rem', letterSpacing: '1px' }}
              tabIndex={0}
              aria-label="Go to homepage"
              onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            >
              IMDb
            </Navbar.Brand>

            {/* Auth Buttons */}
            <div className="d-flex align-items-center">
              {!hasToken ? (
                <>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2 d-none d-sm-block"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button variant="warning" size="sm" className="d-none d-sm-block">
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              )}

              {/* Mobile menu button */}
              <Button
                variant="outline-warning"
                size="sm"
                className="ms-2 d-md-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                ref={mobileMenuRef}
              >
                ☰
              </Button>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title className="text-warning">MOVIEDB</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-grid gap-2">
            {!hasToken ? (
              <>
                <Button variant="outline-warning" size="lg" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="warning" size="lg">
                  Sign Up
                </Button>
              </>
            ) : (
              <Button variant="outline-danger" size="lg" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Spacer for fixed navbar */}
      <div style={{ height: '56px' }}></div>
    </>
  );
};

export default MovieNavbar;
