import React, { useState, useEffect } from "react";
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
import { apiService } from "../utils/auth";

const Browse = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Placeholder genres; update based on backend MovieDto.Genres
  const genres = ["all", "Action", "Comedy", "Drama", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller","Documentary"];

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError("");

      // Backend endpoint returning List<MovieDto>
      const response = await apiService.authenticatedFetch(
        "https://localhost:7123/api/titlebasics"
      );

      const mapped = response.map((item) => ({
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

        {/* Filters + Sort */}
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
              <Col
                key={movie.id}
                lg={3}
                md={4}
                sm={6}
                xs={12}
                className="mb-4 d-flex"
              >
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
                      {movie.description}
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
                        onClick={() =>
                          alert(`Added ${movie.id} to watchlist!`)
                        }
                      >
                        ➕ Watchlist
                      </Button>

                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/movie/${movie.id}`)
                        }
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
      </Container>
    </div>
  );
};

export default Browse;
