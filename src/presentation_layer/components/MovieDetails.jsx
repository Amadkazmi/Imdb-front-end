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
  Modal,
} from "react-bootstrap";
import { apiService } from "../../data_access_layer/auth";
import { getTMDBPersonImages } from "../../data_access_layer/fetchTMDBPersonImages";

const placeholderPoster = "https://placeholdit.com/600x400/dddddd/999999";

const MovieDetails = () => {
  const { tconst } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showActorModal, setShowActorModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);

  const handleActorClick = (actor) => {
    setSelectedActor(actor);
    setShowActorModal(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchMovieAndActors = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch movie details
        const response = await apiService.authenticatedFetch(
          `https://localhost:7123/api/titlebasics/${tconst}/details`
        );

        if (!isMounted) return;

        setMovie({
          id: response.tconst,
          title: response.primaryTitle,
          originalTitle: response.originalTitle,
          description: response.plot || "No description available",
          genres: response.genres || [],
          duration: response.runtimeMinutes ? `${response.runtimeMinutes} min` : "N/A",
          releaseDate: response.startYear || "Unknown",
          rating: response.averageRating ?? "N/A",
          votes: response.numVotes ?? "N/A",
          imageUrl: response.poster?.trim() || placeholderPoster,
          type: response.titleType || "Unknown",
          isAdult: response.isAdult || false,
          endYear: response.endYear || "N/A",
        });

        // Fetch principals (actors/actresses)
        const principals = await apiService.authenticatedFetch(
          `https://localhost:7123/api/titlebasics/${tconst}/principals`
        );

        if (!isMounted) return;

        const actorPrincipals = principals.filter(
          (p) => p.category === "actor" || p.category === "actress"
        );

        const processedActors = [];
        for (const p of actorPrincipals.slice(0, 8)) {
          if (!isMounted) break;
          try {
            const imagesData = await getTMDBPersonImages(p.nconst);

            if (!imagesData.profiles || imagesData.profiles.length === 0) continue;

            const firstImage = imagesData.profiles[0];
            const imageUrl = `https://image.tmdb.org/t/p/w185${firstImage.file_path}`;

            processedActors.push({
              ...p,
              name: p.character || "Unknown Actor",
              character: p.character || "Unknown Role",
              image: imageUrl,
              tmdbId: imagesData.tmdbId,
              uniqueKey: `${p.nconst}-${p.ordering}-${imageUrl}`,
            });
          } catch (err) {
            console.error(`Error processing actor ${p.nconst}:`, err);
            continue;
          }
        }

        if (!isMounted) return;

        setActors(processedActors);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load movie details.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMovieAndActors();

    return () => {
      isMounted = false;
    };
  }, [tconst]);

  const handleBack = () => navigate(-1);

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
      <Container className="min-vh-100 py-5 bg-body-tertiary">
        <Alert variant="danger" className="text-center">
          <h4>Error</h4>
          {error}
          <div className="mt-3 d-flex text-dark justify-content-center gap-2">
            <Button className="btn btn-dark" onClick={handleBack}>
              ← Go Back
            </Button>
            <Button variant="warning" onClick={() => navigate("/browse")}>
              Browse Movies
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-vh-100 bg-body-tertiary text-white">
      <Container className="py-4">
        <Button variant="outline-warning"  className="btn btn-dark mb-4" onClick={handleBack}>
          ← Back
        </Button>

        <Row className="g-4">
          <Col lg={4} md={5} className="d-flex flex-column align-items-center">
            <Card className="bg-secondary border-0 shadow" style={{ width: "300px" }}>
              <Card.Img
                src={movie.imageUrl}
                alt={movie.title}
                style={{ height: "450px", objectFit: "cover" }}
              />
            </Card>

            {actors.length > 0 && (
              <>
                <h5 className="mt-4 text-dark fw-bold">Cast</h5>
                <p className="text-muted mb-0">
                  Showing {actors.length} main cast members
                </p>
                <Row className={`g-3 mt-2 ${actors.length === 1 ? "justify-content-center" : ""}`}>
                  {actors.map((actor) => (
                    <Col
                      key={actor.uniqueKey}
                      xs={6}
                      sm={4}
                      md={4}
                      className="d-flex justify-content-center"
                    >
                      <Card
                        className="bg-body-tertiary border-secondary overflow-hidden"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleActorClick(actor)}
                      >
                        <Card.Img
                          src={actor.image}
                          alt={actor.name}
                          style={{
                            height: "200px",
                            width: "100%",
                            objectFit: "cover",
                            filter: "blur(5px)",
                            transition: "filter 0.3s",
                          }}
                          onLoad={(e) => {
                            e.target.style.filter = "blur(0px)";
                          }}
                        />
                        <div
                          className="position-absolute bottom-0 start-0 end-0"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                            height: "60px",
                          }}
                        />
                        <Card.Body className="p-3 text-center">
                          <div className="text-dark fw-bold mb-1" style={{ fontSize: "0.9rem" }}>
                            {actor.name}
                          </div>
                          <div className="text-warning" style={{ fontSize: "0.8rem" }}>
                            as {actor.character}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>

          <Col lg={8} md={7}>
            <h1 className="text-dark mb-2 fw-bold">{movie.title}</h1>
            {movie.originalTitle !== movie.title && (
              <h5 className="text-dark mb-4">Original Title: {movie.originalTitle}</h5>
            )}
            <div className="mb-4 d-flex flex-wrap align-items-center gap-2">
              <Badge bg="warning" text="dark" className="fs-6 fw-bold">
                ⭐ {movie.rating}/10
              </Badge>
              <span className="text-dark">({movie.votes.toLocaleString()} votes)</span>
            </div>
            <h5 className="text-dark fw-bold">Overview</h5>
            <p className="text-dark">{movie.description}</p>
          </Col>
        </Row>
      </Container>

      {/* Actor Modal */}
      <Modal show={showActorModal} onHide={() => setShowActorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedActor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedActor && (
            <>
              <img
                src={selectedActor.image}
                alt={selectedActor.name}
                className="img-fluid rounded mb-3"
              />
              <p className="fw-bold">as {selectedActor.character}</p>
              <Button
                variant="warning"
                onClick={() => {
                  if (selectedActor.tmdbId) {
                    window.open(
                      `https://www.themoviedb.org/person/${selectedActor.tmdbId}`,
                      "_blank"
                    );
                  } else {
                    alert("TMDB profile not available");
                  }
                }}
              >
                View on TMDB
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MovieDetails;
