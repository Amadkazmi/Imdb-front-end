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
} from "react-bootstrap";
import { apiService } from "../utils/auth";

const MovieDetails = () => {
  const { tconst } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      console.log("API Response:", response); // For debugging

      // Map the response to match your frontend structure
      const mappedMovie = {
        id: response.tconst,
        title: response.primaryTitle,
        originalTitle: response.originalTitle,
        description: response.plot || "No description available",
        genres: response.genres || [],
        duration: response.runtimeMinutes ? `${response.runtimeMinutes} min` : "N/A",
        releaseDate: response.startYear || "Unknown",
        rating: response.averageRating ?? "N/A",
        votes: response.numVotes ?? "N/A",
        imageUrl: response.poster && response.poster.trim() !== "" 
          ? response.poster 
          : "https://m.media-amazon.com/images/M/MV5BMTU3OTA5NTAxNF5BMl5BanBnXkFtZTcwOTMwNjI0MQ@@._V1_SX300.jpg",
        type: response.titleType || "Unknown",
        isAdult: response.isAdult || false,
        endYear: response.endYear || "N/A",
      };

      setMovie(mappedMovie);
    } catch (err) {
      console.error("Error fetching movie details:", err);
      setError("Failed to load movie details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    if (movie) {
      alert(`Added "${movie.title}" to watchlist!`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoToBrowse = () => {
    navigate('/browse');
  };

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

  if (!movie) {
    return (
      <div className="min-vh-100 bg-dark">
        <Container className="py-5">
          <Alert variant="info" className="text-center">
            <Alert.Heading>Movie Not Found</Alert.Heading>
            The movie you're looking for doesn't exist or may have been removed.
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

  return (
    <div className="min-vh-100 bg-dark text-white">
      <Container className="py-4">
        {/* Back Button */}
        <Row className="mb-4">
          <Col>
            <Button variant="outline-warning" onClick={handleBack}>
              ← Back to Previous Page
            </Button>
          </Col>
        </Row>

        {/* Movie Details */}
        <Row>
          {/* Poster */}
          <Col lg={4} md={5} className="mb-4">
            <Card className="bg-secondary border-0 shadow">
              <Card.Img
                variant="top"
                src={movie.imageUrl}
                alt={movie.title}
                style={{ height: "500px", objectFit: "cover" }}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://m.media-amazon.com/images/M/MV5BMTU3OTA5NTAxNF5BMl5BanBnXkFtZTcwOTMwNjI0MQ@@._V1_SX300.jpg")
                }
              />
            </Card>
          </Col>

          {/* Details */}
          <Col lg={8} md={7}>
            <div className="ps-md-4">
              <h1 className="text-warning mb-2">{movie.title}</h1>
              
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <h5 className="text-muted mb-4">
                  <strong>Original Title:</strong> {movie.originalTitle}
                </h5>
              )}

              {/* Rating and Votes */}
              <div className="mb-4">
                <Badge bg="warning" text="dark" className="fs-5 me-2 p-2">
                  ⭐ {movie.rating}/10
                </Badge>
                <span className="text-muted fs-5">({movie.votes.toLocaleString()} votes)</span>
              </div>

              {/* Genres */}
              <div className="mb-4">
                <h5 className="text-warning mb-2">Genres</h5>
                {movie.genres.map((genre, index) => (
                  <Badge key={index} bg="dark" className="me-1 mb-1 fs-6 p-2">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Movie Information */}
              <div className="mb-4">
                <h5 className="text-warning mb-3">Movie Information</h5>
                <ListGroup variant="flush" className="bg-dark">
                  <ListGroup.Item className="bg-dark text-white border-secondary d-flex justify-content-between">
                    <strong>Type:</strong>
                    <span className="text-capitalize">{movie.type}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-dark text-white border-secondary d-flex justify-content-between">
                    <strong>Release Year:</strong>
                    <span>{movie.releaseDate}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="bg-dark text-white border-secondary d-flex justify-content-between">
                    <strong>Duration:</strong>
                    <span>{movie.duration}</span>
                  </ListGroup.Item>
                  {movie.endYear && movie.endYear !== "N/A" && (
                    <ListGroup.Item className="bg-dark text-white border-secondary d-flex justify-content-between">
                      <strong>End Year:</strong>
                      <span>{movie.endYear}</span>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item className="bg-dark text-white border-secondary d-flex justify-content-between">
                    <strong>Adult Content:</strong>
                    <span>{movie.isAdult ? "Yes" : "No"}</span>
                  </ListGroup.Item>
                </ListGroup>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 className="text-warning mb-3">Overview</h5>
                <p className="fs-5 lh-base">{movie.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex">
                <Button
                  variant="warning"
                  size="lg"
                  className="me-md-2 mb-2 fw-bold"
                  onClick={handleBookmark}
                >
                  ➕ Add to Watchlist
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  className="mb-2 fw-bold"
                  onClick={() => window.open(`https://www.imdb.com/title/${movie.id}`, '_blank')}
                >
                  🎬 View on IMDb
                </Button>
              </div>

              {/* Movie ID for reference */}
              <div className="mt-4 pt-3 border-top border-secondary">
                <small className="text-muted">
                  Movie ID: {movie.id}
                </small>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MovieDetails;