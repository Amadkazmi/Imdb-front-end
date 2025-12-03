import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { apiService } from '../utils/auth';

const Login = () => {
    const username = useRef();
    const email = useRef();
    const password = useRef();

    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const API_BASE_URL = 'https://localhost:7123/api/Users';

    // Validation
    const validateForm = (data) => {
        if (!data.password || data.password.length < 6) {
            return 'Password must be at least 6 characters';
        }

        if (isSignup && (!data.email || !data.email.includes('@'))) {
            return 'Enter a valid email';
        }

        if (!data.username || data.username.length < 2) {
            return 'Username must be at least 2 characters';
        }

        return true;
    };

    const storeAuthData = (data) => {
        localStorage.setItem('jwtToken', data.token);

        localStorage.setItem(
            'userData',
            JSON.stringify({
                uid: data.userId,
                email: data.email,
                displayName: data.username,
                photoURL: '/default-avatar.png'
            })
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const data = {
            username: username.current.value,
            email: email.current?.value || '',
            password: password.current.value
        };

        const validation = validateForm(data);
        if (validation !== true) {
            setError(validation);
            setIsLoading(false);
            return;
        }

        try {
            const endpoint = isSignup ? 'register' : 'login';

            const payload = isSignup
                ? { username: data.username, email: data.email, password: data.password }
                : { username: data.username, password: data.password };

            const response = await apiService.simpleFetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!response?.token) {
                throw new Error('Invalid server response');
            }

            storeAuthData(response);

            dispatch(
                addUser({
                    uid: response.userId,
                    email: response.email,
                    displayName: response.username,
                    photoURL: '/default-avatar.png'
                })
            );

            navigate('/browse');
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = () => {
        setIsSignup((prev) => !prev);
        setError('');
    };

    return (
       <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center">
  <Container>
    <Row className="justify-content-center">
      <Col xs={12} sm={8} md={6} lg={4}>
        <Card className="bg-dark border-secondary shadow-lg rounded-3">
          <Card.Body className="p-4">

            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-warning fw-bold mb-1">🎬 MOVIEDB</h2>
              <h5 className="text-white fw-normal">{isSignup ? 'Create Your Account' : 'Sign In'}</h5>
            </div>

            {/* Error Alert */}
            {error && <Alert variant="danger" className="py-2 text-center">⚠️ {error}</Alert>}

            {/* Form */}
            <Form onSubmit={handleSubmit}>

              {/* Username */}
              <Form.Group className="mb-3">
                <Form.Label className="text-white fw-semibold">Username</Form.Label>
                <Form.Control
                  ref={username}
                  type="text"
                  placeholder="Enter username"
                  className="bg-secondary text-white border-0 rounded-2"
                  required
                />
              </Form.Group>

              {/* Email (Signup only) */}
              {isSignup && (
                <Form.Group className="mb-3">
                  <Form.Label className="text-white fw-semibold">Email</Form.Label>
                  <Form.Control
                    ref={email}
                    type="email"
                    placeholder="Enter email"
                    className="bg-secondary text-white border-0 rounded-2"
                    required
                  />
                </Form.Group>
              )}

              {/* Password */}
              <Form.Group className="mb-4">
                <Form.Label className="text-white fw-semibold">Password</Form.Label>
                <Form.Control
                  ref={password}
                  type="password"
                  placeholder="Enter password"
                  className="bg-secondary text-white border-0 rounded-2"
                  required
                />
              </Form.Group>

                                    <Button
                                        type="submit"
                                        variant="warning"
                                        className="w-100"
                                        disabled={isLoading}
                                    >
                                        {isLoading && (
                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        )}
                                        {isLoading
                                            ? isSignup
                                                ? 'Creating...'
                                                : 'Signing In...'
                                            : isSignup
                                            ? 'Create Account'
                                            : 'Sign In'}
                                    </Button>
                                </Form>

                                <div className="text-center mt-3 pt-3 border-top border-secondary">
                                    <p className="text-muted mb-0">
                                        {isSignup ? 'Already have an account?' : 'Need an account?'}
                                        <Button
                                            variant="link"
                                            className="text-warning p-0 ms-1"
                                            onClick={handleToggle}
                                        >
                                            {isSignup ? 'Sign In' : 'Sign Up'}
                                        </Button>
                                    </p>
                                </div>

                                <div className="mt-3 text-muted small text-center">
                                    Connected to: {API_BASE_URL}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
