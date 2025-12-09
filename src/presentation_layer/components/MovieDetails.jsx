import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  ListGroup,
  Form,
  Modal,
} from "react-bootstrap";
import { apiService } from "../../data_access_layer/auth";

const MovieDetails = () => {
  const { tconst } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(1);
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    if (tconst) {
      fetchMovieDetails();
    }
  }, [tconst]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiService.authenticatedFetch(
        `https://localhost:7123/api/titlebasics/${tconst}/details`
      );

      const mappedMovie = {
        id: response.tconst,
        title: response.primaryTitle,
        originalTitle: response.originalTitle,
        description:
          response.plot ||
          response.storyline ||
          response.summary ||
          "No description available",
        genres: response.genres || [],
        duration: response.runtimeMinutes
          ? `${response.runtimeMinutes} min`
          : "N/A",
        releaseDate: response.startYear || "Unknown",
        rating: response.averageRating ?? "N/A",
        votes: response.numVotes ?? "N/A",
        imageUrl:
          response.poster && response.poster.trim() !== ""
            ? response.poster
            : "https://m.media-amazon.com/images/M/MV5BMTU3OTA5NTAxNF5BMl5BanBnXkFtZTcwOTMwNjI0MQ@@._V1_SX300.jpg",
        type: response.titleType || "Unknown",
        isAdult: response.isAdult || false,
        endYear: response.endYear || "N/A",
      };

      setMovie(mappedMovie);
    } catch (err) {
      console.error(err);
      setError("Failed to load movie details.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // Rating Submit
  // ----------------------------------------------------
  const submitRating = async (e) => {
    e.preventDefault();
    setRatingError("");

    try {
      const body = {
        tConst: movie.id,
        rating: Number(ratingValue),
      };

      await apiService.authenticatedFetch(
        "https://localhost:7123/api/Ratings",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      alert("Rating submitted!");
      setShowRating(false);
    } catch (err) {
      console.error(err);
      setRatingError("Failed to submit rating");
    }
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

  const handleBack = () => navigate(-1);
  const handleGoToBrowse = () => navigate("/browse");

  if (loading) {
    return (
      <div className="min-vh-100 bg-dark d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="warning" />
        <span className="ms-2 text-white">Loading movie details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-dark">
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Error</Alert.Heading>
            {error}
            <div className="mt-3">
              <Button variant="outline-warning" onClick={handleBack} className="me-2">
                ← Go Back
              </Button>
              <Button variant="warning" onClick={handleGoToBrowse}>
                Browse Movies
              </Button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-vh-100 bg-dark text-white">
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <Button variant="outline-warning" onClick={handleBack}>
              ← Back
            </Button>
          </Col>
        </Row>

        <Row>
          <Col lg={4} md={5} className="mb-4">
            <Card className="bg-secondary border-0 shadow">
              <Card.Img
                variant="top"
                src={movie.imageUrl}
                alt={movie.title}
                style={{ height: "500px", objectFit: "cover" }}
              />
            </Card>
          </Col>

          <Col lg={8} md={7}>
            <h1 className="text-warning mb-2">{movie.title}</h1>

            {movie.originalTitle !== movie.title && (
              <h5 className="text-muted mb-4">
                Original Title: {movie.originalTitle}
              </h5>
            )}

            <div className="mb-4">
              <Badge bg="warning" text="dark" className="fs-5 me-2 p-2">
                ⭐ {movie.rating}/10
              </Badge>
              <span className="text-muted fs-5">
                ({movie.votes.toLocaleString()} votes)
              </span>

              <Button
                variant="warning"
                size="sm"
                className="ms-3 fw-bold"
                onClick={() => setShowRating(true)}
              >
                Rate Movie
              </Button>
            </div>

            <h5 className="text-warning">Overview</h5>
            <p>{movie.description}</p>

            <Button
              variant="warning"
              className="me-2"
              onClick={() => handleBookmark(movie.id)}
            >
              Add to Watchlist
            </Button>

            <Button
              variant="outline-light"
              onClick={() =>
                window.open(`https://www.imdb.com/title/${movie.id}`, "_blank")
              }
            >
              View on IMDb
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Rating Modal */}
      <Modal show={showRating} onHide={() => setShowRating(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rate {movie.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ratingError && <Alert variant="danger">{ratingError}</Alert>}
          <Form onSubmit={submitRating}>
            <Form.Group>
              <Form.Label>Your Rating (1–10)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={ratingValue}
                onChange={(e) => setRatingValue(e.target.value)}
              />
            </Form.Group>

            <Button variant="warning" type="submit" className="mt-3 w-100">
              Submit Rating
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MovieDetails;
