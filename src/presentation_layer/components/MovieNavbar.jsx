import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Button, Offcanvas, Form, ListGroup, Dropdown } from 'react-bootstrap';
import { apiService } from '../../data_access_layer/auth';

const MovieNavbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    return stored ? JSON.parse(stored) : null;
  });

  const hasToken = !!userData; // or !!localStorage.getItem('jwtToken') if preferred, but userData syncs with state

  const navigate = useNavigate();
  const mobileMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSearchHistory = async () => {
    if (!hasToken) return;
    try {
      const history = await apiService.authenticatedFetch("https://localhost:7123/api/titlebasics/search/history", {
        method: "GET"
      });

      const historyItems = Array.isArray(history) ? history.map(h => h.keyword || h).slice(0, 5) : [];
      setSearchHistory(historyItems);
    } catch (error) {
      console.error("Failed to fetch search history", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userData');
    setUserData(null);
    navigate('/login');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      // API expects GET request with keyword in URL: api/titlebasics/search/{keyword}
      const results = await apiService.authenticatedFetch(
        `https://localhost:7123/api/titlebasics/search/${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
        }
      );

      navigate('/browse', { state: { searchResults: results, searchTerm } });
      setSearchTerm(""); // Optional: clear search after submit
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search failed. Please try again.");
    }
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

            {/* Search Bar */}
            <div className="d-flex mx-auto position-relative" style={{ maxWidth: '400px', width: '100%' }} ref={searchRef}>
              <Form className="d-flex w-100" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Search movies..."
                  className="me-2 bg-secondary text-white border-secondary"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    setShowHistory(true);
                    fetchSearchHistory();
                  }}
                />
                <Button variant="outline-warning" type="submit">Search</Button>
              </Form>

              {/* Search History Dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <ListGroup className="position-absolute w-100 mt-1 shadow" style={{ top: '100%', zIndex: 1000 }}>
                  {searchHistory.map((term, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      className="bg-dark text-white border-secondary"
                      onClick={() => {
                        setSearchTerm(term);
                        setShowHistory(false);
                        // Trigger search immediately
                        navigate('/browse', { state: { searchTerm: term } }); // We might want to trigger the fetch logic too, but setting searchTerm and letting user click or reusing logic is better. 
                        apiService.authenticatedFetch(`https://localhost:7123/api/titlebasics/search/${encodeURIComponent(term)}`, { method: "GET" })
                          .then(results => navigate('/browse', { state: { searchResults: results, searchTerm: term } }))
                          .catch(err => console.error(err));
                      }}
                    >
                      🕒 {term}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="d-flex align-items-center ms-3">
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
                <>
                  {userData && (
                    <Dropdown align="end">
                      <Dropdown.Toggle
                        variant="outline-warning"
                        id="user-dropdown"
                        size="sm"
                        className="fw-semibold"
                      >
                        {userData.displayName || userData.email}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className=" border-secondary">
                        <Dropdown.ItemText>
                          <strong>Username:</strong> {userData.displayName || userData.email}
                        </Dropdown.ItemText>
                        <Dropdown.ItemText>
                          <strong>Email:</strong> {userData.email}
                        </Dropdown.ItemText>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => navigate('/bookmarks')}>
                          📑 My Bookmarks
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </>
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
              <>
                {userData && (
                  <div className="text-warning text-center mb-2 fw-semibold">
                    {userData.name || userData.email}
                  </div>
                )}
                <Button variant="outline-warning" size="lg" onClick={() => {
                  navigate('/bookmarks');
                  setShowMobileMenu(false);
                }}>
                  📑 My Bookmarks
                </Button>
                <Button variant="outline-danger" size="lg" onClick={handleLogout}>
                  Logout
                </Button>
              </>
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
