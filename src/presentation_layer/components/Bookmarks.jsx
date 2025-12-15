import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { apiService } from "../../data_access_layer/auth";
import { useNavigate } from "react-router-dom";

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const response = await apiService.authenticatedFetch("https://localhost:7123/api/Bookmarks");
            setBookmarks(response);
        } catch (err) {
            console.error(err);
            setError("Failed to load bookmarks.");
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
                <h2 className="text-dark mb-4">📑 My Bookmarks</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Row>
                    {bookmarks.length > 0 ? (
                        bookmarks.map((bookmark) => (
                            <Col key={bookmark.bookmarkId} lg={3} md={4} sm={6} xs={12} className="mb-4 d-flex">
                                <Card className="bg-success-subtle w-100 h-100 d-flex flex-column">
                                    { }
                                    <Card.Img
                                        src="https://m.media-amazon.com/images/M/MV5BMTU3OTA5NTAxNF5BMl5BanBnXkFtZTcwOTMwNjI0MQ@@._V1_SX300.jpg"
                                        style={{ height: "350px", objectFit: "cover" }}
                                    />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="text-black fw-bold">{bookmark.title || bookmark.name || "Unknown Title"}</Card.Title>
                                        <Card.Text className="text-black">
                                            Added on: {new Date(bookmark.createdAt).toLocaleDateString()}
                                        </Card.Text>
                                        <div className="mt-auto">
                                            <Button
                                                variant="outline-dark"
                                                className="w-100"
                                                onClick={() => navigate(`/movie/${bookmark.tConst}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <Alert variant="info">No bookmarks found.</Alert>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
};

export default Bookmarks;
