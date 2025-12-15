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
  Form,
  Modal,
} from "react-bootstrap";
import { apiService } from "../../data_access_layer/auth";
import { getTMDBPersonImages } from "../../data_access_layer/fetchTMDBPersonImages";

const placeholderPoster = "https://via.placeholder.com/300x450?text=No+Image";

const MovieDetails = () => {
  const { tconst } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(1);

  const [ratingError, setRatingError] = useState("");

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState("");

  // Function to clean up character string
  const cleanCharacterString = (charString) => {
    if (!charString) return "Unknown";

    // Remove the array brackets and quotes
    return charString
      .replace(/^\['|'\]$/g, '')  // Remove [' at start and '] at end
      .replace(/''/g, "'")         // Fix double quotes
      .trim();
  };

  // Function to fetch actor name from your API
  const fetchActorName = async (nconst) => {
    try {

      const actorResponse = await apiService.authenticatedFetch(
        `https://localhost:7123/api/namebasics/${nconst}`
      );
      return actorResponse?.primaryName || actorResponse?.name || "Unknown Actor";
    } catch (err) {
      console.error(`Failed to fetch actor name for ${nconst}:`, err);
      return "Unknown Actor";
    }
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

        console.log("Fetched principals:", principals);

        if (!isMounted) return;

        // Filter only actors and actresses
        const actorPrincipals = principals.filter(
          (p) => p.category === "actor" || p.category === "actress"
        );

        // Track unique image URLs to prevent duplicates
        const seenImageUrls = new Set();
        const processedActors = [];

        // Process a limited number of actors (e.g., top 6-8) for better performance
        const actorsToProcess = actorPrincipals.slice(0, 8);

        for (const p of actorsToProcess) {
          if (!isMounted) break;

          try {
            // Get TMDB images for this actor
            const images = await getTMDBPersonImages(p.nconst);

            // If no images, skip this actor completely
            if (!images || images.length === 0) {
              console.log(`Skipping actor ${p.nconst} - no images found`);
              continue;
            }

            // Get the first image
            const firstImage = images[0];
            const imageUrl = `https://image.tmdb.org/t/p/w185${firstImage.file_path}`;

            // Check if this image URL is already used (duplicate)
            if (seenImageUrls.has(imageUrl)) {
              console.log(`Skipping duplicate image for actor ${p.nconst}: ${imageUrl}`);
              continue;
            }

            // Mark this image URL as seen
            seenImageUrls.add(imageUrl);


            let actorName = "Unknown Actor";


            if (p.character && p.character !== "Unknown") {
              // Use character name as a fallback
              const characterName = cleanCharacterString(p.characters);
              actorName = characterName;
            }

            // Clean up the character string
            const character = cleanCharacterString(p.characters);

            // Create actor object
            const actor = {
              ...p,
              name: actorName,
              character: character,
              image: imageUrl,
              tmdbId: firstImage.tmdbId || undefined,
              uniqueKey: `${p.nconst}-${p.ordering}-${imageUrl}`
            };

            processedActors.push(actor);
          } catch (err) {
            console.error(`Error processing actor ${p.nconst}:`, err);
            continue;
          }
        }

        if (!isMounted) return;

        console.log("Processed actors:", processedActors);
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

  const extractActorName = (characterName) => {
    // Simple mapping for common cases
    const nameMap = {
      "Derek 'Del Boy' Trotter": "David Jason",
      "Rodney Trotter": "Nicholas Lyndhurst",
      "Trigger": "Roger Lloyd-Pack",
      "Boycie": "John Challis",

    };

    return nameMap[characterName] || characterName || "Unknown Actor";
  };

  const submitRating = async (e) => {
    e.preventDefault();
    setRatingError("");
    try {
      await apiService.authenticatedFetch("https://localhost:7123/api/Ratings", {
        method: "POST",
        body: JSON.stringify({ tConst: movie.id, rating: Number(ratingValue) }),
      });
      alert("Rating submitted!");
      setShowRating(false);
    } catch (err) {
      console.error(err);
      setRatingError("Failed to submit rating");
    }
  };

  const handleBookmark = async () => {
    try {
      await apiService.authenticatedFetch("https://localhost:7123/api/Bookmarks", {
        method: "POST",
        body: JSON.stringify({ tconst: movie.id }),
      });
      alert("Added to watchlist!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to watchlist.");
    }
  };

  const submitNote = async (e) => {
    e.preventDefault();
    setNoteError("");
    try {
      await apiService.authenticatedFetch("https://localhost:7123/api/Notes", {
        method: "POST",
        body: JSON.stringify({
          NoteText: noteText,
          TConst: movie.id,
          NConst: null
        }),
      });
      alert("Note added successfully!");
      setShowNoteModal(false);
      setNoteText("");
    } catch (err) {
      console.error(err);
      setNoteError("Failed to add note.");
    }
  };

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
      <Container className="min-vh-100 py-5 bg-dark">
        <Alert variant="danger" className="text-center">
          <h4>Error</h4>
          {error}
          <div className="mt-3 d-flex justify-content-center gap-2">
            <Button variant="outline-warning" onClick={handleBack}>
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
    <div className="min-vh-100 bg-dark text-white">
      <Container className="py-4">
        <Button variant="outline-warning" onClick={handleBack} className="mb-4">
          ← Back
        </Button>

        <Row className="g-4">
          {/* Poster and Actors */}
          <Col lg={4} md={5} className="d-flex flex-column align-items-center">
            <Card
              className="bg-secondary border-0 shadow"
              style={{
                width: "300px",
                cursor: "pointer",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.25)";
              }}
            >
              <Card.Img
                src={movie.imageUrl}
                alt={movie.title}
                style={{ height: "450px", objectFit: "cover" }}
              />
            </Card>

            {actors.length > 0 ? (
              <>
                <h5 className="mt-4 text-warning fw-bold">Cast</h5>
                <p className="text-muted mb-0">
                  Showing {actors.length} main cast members
                </p>
                <Row className="g-3 mt-2">
                  {actors.map((actor) => {
                    // Try to extract real actor name
                    const displayName = extractActorName(actor.character);

                    return (
                      <Col key={actor.uniqueKey || `${actor.nconst}-${actor.ordering}`} xs={6} sm={4} md={4}>
                        <div style={{ textDecoration: "none", color: "inherit" }}>
                          <Card className="bg-dark border-secondary overflow-hidden">
                            <div className="position-relative">
                              <Card.Img
                                src={actor.image}
                                alt={displayName}
                                style={{
                                  height: "200px",
                                  width: "100%",
                                  objectFit: "cover"
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                              <div
                                className="position-absolute bottom-0 start-0 end-0"
                                style={{
                                  background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                                  height: "60px"
                                }}
                              />
                            </div>
                            <Card.Body className="p-3">
                              <div className="text-white fw-bold mb-1" style={{ fontSize: "0.9rem" }}>
                                {displayName}
                              </div>
                              <div className="text-warning" style={{ fontSize: "0.8rem" }}>
                                as {actor.character || "Unknown Role"}
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </>
            ) : (
              !loading && (
                <div className="mt-4 text-center">
                  <h5 className="text-warning fw-bold">Cast</h5>
                  <p className="text-muted">No actor photos available</p>
                </div>
              )
            )}
          </Col>

          {/* Movie Info */}
          <Col lg={8} md={7}>
            <h1 className="text-warning mb-2 fw-bold">{movie.title}</h1>
            {movie.originalTitle !== movie.title && (
              <h5 className="text-light mb-4">Original Title: {movie.originalTitle}</h5>
            )}

            <div className="mb-4 d-flex flex-wrap align-items-center gap-2">
              <Badge bg="warning" text="dark" className="fs-6 fw-bold">
                ⭐ {movie.rating}/10
              </Badge>
              <span className="text-light">({movie.votes.toLocaleString()} votes)</span>
              <Button variant="warning" size="sm" onClick={() => setShowRating(true)}>
                Rate Movie
              </Button>
            </div>

            <h5 className="text-warning fw-bold">Overview</h5>
            <p className="text-light">{movie.description}</p>

            <div className="d-flex gap-2 flex-wrap">
              <Button variant="warning" onClick={handleBookmark}>
                Add to Watchlist
              </Button>
              <Button variant="outline-warning" onClick={() => setShowNoteModal(true)}>
                Add Note
              </Button>
              <Button
                variant="outline-light"
                onClick={() => window.open(`https://www.imdb.com/title/${movie.id}`, "_blank")}
              >
                View on IMDb
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

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

      <Modal show={showNoteModal} onHide={() => setShowNoteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Note for {movie.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {noteError && <Alert variant="danger">{noteError}</Alert>}
          <Form onSubmit={submitNote}>
            <Form.Group>
              <Form.Label>Your Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your thoughts..."
                required
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="mt-3 w-100">
              Save Note
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MovieDetails;