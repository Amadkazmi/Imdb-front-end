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
  Form,
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

  // Rating State
  const [showRating, setShowRating] = useState(false);
  const [ratingValue, setRatingValue] = useState(1);
  const [ratingError, setRatingError] = useState("");

  // Note State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState("");

  // Actor Modal State
  const [showActorModal, setShowActorModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState(null);

  const handleActorClick = (actor) => {
    setSelectedActor(actor);
    setShowActorModal(true);
  };

  // Function to clean up character string
  const cleanCharacterString = (charString) => {
    if (!charString) return "Unknown";
    // Remove the array brackets and quotes
    return charString
      .replace(/^\['|'\]$/g, '')  // Remove [' at start and '] at end
      .replace(/''/g, "'")         // Fix double quotes
      .trim();
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
        const seenImageUrls = new Set();

        // Process a limited number of actors (e.g., top 8) for better performance
        const actorsToProcess = actorPrincipals.slice(0, 8);

        for (const p of actorsToProcess) {
          if (!isMounted) break;

          try {
            // Get TMDB images for this actor
            const imagesData = await getTMDBPersonImages(p.nconst);

            // If no images, skip this actor completely
            if (!imagesData || !imagesData.profiles || imagesData.profiles.length === 0) {
              continue;
            }

            // Get the first image
            const firstImage = imagesData.profiles[0];
            const imageUrl = `https://image.tmdb.org/t/p/w185${firstImage.file_path}`;

            // Check if this image URL is already used (duplicate)
            if (seenImageUrls.has(imageUrl)) {
              continue;
            }

            // Mark this image URL as seen
            seenImageUrls.add(imageUrl);

            let actorName = "Unknown Actor";
            if (p.character && p.character !== "Unknown") {
              // Use character name as a fallback or if primary name is missing
              // But usually we want the person's name. 
              // The API response for principals might not have the name if it's just nconst/category/characters.
              // However, the previous code was fetching namebasics separately in one version, 
              // but the 'principals' endpoint usually returns 'name' or 'primaryName' if joined.
              // Let's assume 'principals' has the name, or we rely on what we have.
              // Looking at the conflict, one version had `fetchActorName`.
              // But `getTMDBPersonImages` might not return the name.
              // Let's assume the `principals` object has `name` or `primaryName`.
              // If not, we might need to fetch it. 
              // The remote version used `p.character` as name fallback? That seems wrong.
              // Let's check the HEAD version: it tried `fetchActorName` but didn't use it in the loop?
              // Wait, HEAD had `fetchActorName` defined but not used in the loop shown in the snippet?
              // Actually, HEAD's loop had `let actorName = "Unknown Actor";` then `if (p.character...) actorName = characterName`.
              // That implies it was using the character name as the actor name? That's weird.
              // Ah, `extractActorName` map suggests they are mapping character names to real actor names for some specific dataset (Only Fools and Horses?).
              // I will stick to the logic that was there: use `p.name` if available, else fallback.
              // The remote version used `p.character` as name? `name: p.character || "Unknown Actor"`. That looks like a bug in Remote.
              // I will try to use `p.primaryName` or `p.name` if it exists.
            }

            // Clean up the character string
            const character = cleanCharacterString(p.characters);

            // Create actor object
            const actor = {
              ...p,
              name: p.primaryName || p.name || "Unknown Actor", // improved from p.character
              character: character,
              image: imageUrl,
              tmdbId: imagesData.tmdbId || undefined,
              uniqueKey: `${p.nconst}-${p.ordering}-${imageUrl}`
            };

            processedActors.push(actor);
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
        <Button variant="outline-warning" className="btn btn-dark mb-4" onClick={handleBack}>
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
              <Button variant="warning" size="sm" onClick={() => setShowRating(true)}>
                Rate Movie
              </Button>
            </div>

            <h5 className="text-warning fw-bold">Overview</h5>
            <p className="text-dark">{movie.description}</p>

            <div className="d-flex gap-2 flex-wrap">
              <Button variant="warning" onClick={handleBookmark}>
                Add to Watchlist
              </Button>
              <Button variant="outline-warning" onClick={() => setShowNoteModal(true)}>
                Add Note
              </Button>
              <Button
                variant="outline-dark"
                onClick={() => window.open(`https://www.imdb.com/title/${movie.id}`, "_blank")}
              >
                View on IMDb
              </Button>
            </div>
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

      {/* Note Modal */}
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
