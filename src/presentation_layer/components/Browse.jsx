import React, { useState, useEffect } from "react";
import ExpandableText from "./ExpandableText.jsx";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Alert,
  Nav,
} from "react-bootstrap";
import { apiService } from "../../data_access_layer/auth";

const PAGE_SIZE = 4;

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    prev: null,
    next: null,
    current: 0,
    totalPages: 0,
    totalItems: 0,
  });

  const genres = [
    "all",
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Documentary",
  ];

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const fetchMovies = async (p) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiService.authenticatedFetch(
        `https://localhost:7123/api/titlebasics/paginated?Page=${p}&PageSize=${PAGE_SIZE}`
      );

      if (!response.items) {
        setMovies([]);
        return;
      }

      const mapped = response.items.map((item) => ({
        id: item.tconst,
        title: item.primaryTitle,
        description: item.plot || item.originalTitle || "No description",
        genres: item.genres || [],
        duration: item.runtimeMinutes ? `${item.runtimeMinutes} min` : "N/A",
        releaseDate: item.startYear || 0,
        rating: item.averageRating ?? "N/A",
        votes: item.numVotes ?? "N/A",
        imageUrl:
          item.poster && item.poster.trim() !== ""
            ? item.poster
            : "https://m.media-amazon.com/images/M/MV5BMTU3OTA5NTAxNF5BMl5BanBnXkFtZTcwOTMwNjI0MQ@@._V1_SX300.jpg",
      }));

      setMovies(mapped);

      setPageInfo({
        prev: response.prev,
        next: response.next,
        current: p,
        totalPages: response.numberOfPages,
        totalItems: response.numberOfItems,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMovies = () => {
    let filtered = [...movies];

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGenre !== "all") {
      filtered = filtered.filter((m) => m.genres.includes(selectedGenre));
    }

    if (sortBy === "latest") {
      filtered.sort((a, b) => b.releaseDate - a.releaseDate);
    } else if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredMovies(filtered);
  };

  const handleBookmark = async (tconst) => {
    try {
      await apiService.authenticatedFetch("https://localhost:7123/api/Bookmarks", {
        method: "POST",
        body: JSON.stringify({ tconst }),
      });
      alert("Added to watchlist!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to watchlist.");
    }
  };

  const goNext = () => {
    if (page + 1 < pageInfo.totalPages) setPage(page + 1);
  };

  const goPrev = () => {
    if (page > 0) setPage(page - 1);
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-dark d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="warning" />
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-dark text-white">
      <Container fluid className="py-3">
        {/* Header + Search */}
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <h2 className="text-warning">🎬 Movie Library</h2>
          </Col>
          <Col xs={12} md={6} className="mt-2 mt-md-0">
            <Form.Control
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-secondary text-white"
            />
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={8} className="mb-2 mb-md-0">
            <Nav variant="pills" className="flex-wrap">
              {genres.map((g) => (
                <Nav.Item key={g} className="me-2 mb-2">
                  <Nav.Link
                    active={selectedGenre === g}
                    onClick={() => setSelectedGenre(g)}
                    className={
                      selectedGenre === g
                        ? "bg-warning text-dark"
                        : "bg-secondary text-white"
                    }
                  >
                    {g}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col xs={12} md={4} className="text-md-end">
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="title">A-Z</option>
            </Form.Select>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Movie Grid */}
        <Row>
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <Col key={movie.id} lg={3} md={4} sm={6} xs={12} className="mb-4 d-flex">
                <Card className="bg-secondary w-100 h-100 d-flex flex-column">
                  <Card.Img
                    src={movie.imageUrl}
                    style={{ height: "350px", objectFit: "cover" }}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://m.media-amazon.com/images/M/MV5BMTU3OTA5NTAxNF5BMl5BanBnXkFtZTcwOTMwNjI0MQ@@._V1_SX300.jpg")
                    }
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      <ExpandableText text={movie.description} />
                    </Card.Text>
                    <div className="mb-2">
                      {movie.genres.map((g) => (
                        <span key={g} className="badge bg-dark me-1">
                          {g}
                        </span>
                      ))}
                    </div>
                    <small className="text-warning mb-2">
                      ⭐ {movie.rating} ({movie.votes} votes)
                    </small>
                    <div className="d-grid gap-2 mt-auto">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleBookmark(movie.id)}
                      >
                        ➕ Bookmark
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => (window.location.href = `/movie/${movie.id}`)}
                      >
                        ℹ️ Details
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">No movies found.</Alert>
            </Col>
          )}
        </Row>

        {/* Pagination Buttons */}
        <Row className="mt-4">
          <Col className="d-flex justify-content-center gap-3">
            <Button
              variant="secondary"
              disabled={page === 0}
              onClick={goPrev}
            >
              ← Prev
            </Button>
            <span className="text-white align-self-center">
              Page {page + 1} of {pageInfo.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page + 1 >= pageInfo.totalPages}
              onClick={goNext}
            >
              Next →
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Browse;
