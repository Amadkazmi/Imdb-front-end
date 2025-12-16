import React from "react";
import MovieFooter from "./components/MovieFooter";

const Support = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary text-dark">

      {/* Main Content */}
      <div className="container py-5 flex-grow-1">
        <h1 className="text-warning mb-4">Support</h1>

        <p className="text-muted mb-4">
          Need help using the application? You’ll find answers to common
          questions and guidance below.
        </p>

        <hr className="border-secondary my-4" />

        <section className="mb-4">
          <h4>Account & Login</h4>
          <p>
            If you’re having trouble signing in or staying logged in, make sure:
          </p>
          <ul>
            <li>Your username and password are correct</li>
            <li>Your JWT token has not expired</li>
            <li>You are not blocking local storage in your browser</li>
          </ul>
        </section>

        <section className="mb-4">
          <h4>Browsing Movies</h4>
          <p>
            If movies or posters do not appear correctly:
          </p>
          <ul>
            <li>Check your internet connection</li>
            <li>Refresh the page to reload movie data</li>
            <li>Some titles may not have posters available</li>
          </ul>
        </section>

        <section className="mb-4">
          <h4>Still need help?</h4>
          <p>
            If your issue isn’t resolved, please visit the{" "}
            <strong>Contact Us</strong> page and reach out to the project team.
          </p>
        </section>

        <p className="text-muted small mt-5">
          Support content may be updated as the application evolves.
        </p>
      </div>

    </div>
  );
};

export default Support;
