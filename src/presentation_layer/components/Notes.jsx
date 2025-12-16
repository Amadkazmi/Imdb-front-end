import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { apiService } from "../../data_access_layer/auth";
import { useNavigate } from "react-router-dom";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await apiService.authenticatedFetch("https://localhost:7123/api/Notes");
            setNotes(response);
        } catch (err) {
            console.error(err);
            setError("Failed to load notes.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 bg-body-tertiary d-flex justify-content-center align-items-center">
                <Spinner animation="border" variant="warning" />
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-body-tertiary text-white">
            <Container fluid className="py-3">
                <h2 className="text-dark mb-4">📝 My Notes</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Row>
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <Col key={note.noteId} lg={3} md={4} sm={6} xs={12} className="mb-4 d-flex">
                                <Card className="bg-warning-subtle w-100 h-100 d-flex flex-column">
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="text-black fw-bold">
                                            {note.title || note.name || "Unknown Title"}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </Card.Subtitle>
                                        <Card.Text className="text-black flex-grow-1">
                                            {note.noteText}
                                        </Card.Text>
                                        <div className="mt-3">
                                            <Button
                                                variant="outline-dark"
                                                className="w-100"
                                                onClick={() => {
                                                    if (note.tConst) {
                                                        navigate(`/movie/${note.tConst}`);
                                                    } else {

                                                        console.warn("No tConst for note", note);
                                                    }
                                                }}
                                                disabled={!note.tConst}
                                            >
                                                View Movie
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Alert variant="info">No notes found.</Alert>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Notes;
