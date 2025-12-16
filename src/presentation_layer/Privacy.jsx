import React from "react";
import MovieFooter from "./components/MovieFooter";

const Privacy = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary text-dark">

      {/* Main Content */}
      <div className="container py-5 flex-grow-1">
        <h1 className="text-warning mb-4">Privacy Policy</h1>

        <p className="text-muted">
          Your privacy matters to us. This page explains what data we store,
          why we store it, and how it is used inside the application.
        </p>

        <hr className="border-secondary my-4" />

        <section className="mb-4">
          <h4>What data we store</h4>
          <p>
            When you sign in or sign up, we store a small amount of information
            directly in your browser using <strong>localStorage</strong>.
            This includes:
          </p>
          <ul>
            <li>JWT authentication token</li>
            <li>Your username</li>
            <li>Your email address</li>
            <li>Basic account identifiers (user ID)</li>
          </ul>
        </section>

        <section className="mb-4">
          <h4>Why we store this data</h4>
          <p>
            This data allows the application to:
          </p>
          <ul>
            <li>Keep you signed in between page refreshes</li>
            <li>Securely authenticate API requests</li>
            <li>Personalize your experience</li>
            <li>Protect routes that require login</li>
          </ul>
        </section>

        <section className="mb-4">
          <h4>How your data is stored</h4>
          <p>
            All authentication data is stored <strong>only in your browser</strong>.
            We do not store personal data in cookies, and we do not track users
            across websites.
          </p>
          <p>
            The JWT token is used solely for authentication and expires
            automatically based on server configuration.
          </p>
        </section>

        <section className="mb-4">
          <h4>How to remove your data</h4>
          <p>
            You can remove all stored data at any time by:
          </p>
          <ul>
            <li>Clicking the <strong>Logout</strong> button</li>
            <li>Clearing your browser’s local storage</li>
          </ul>
          <p>
            Once logged out, all locally stored authentication data is removed.
          </p>
        </section>

        <section className="mb-4">
          <h4>Third-party services</h4>
          <p>
            Movie images and metadata may be loaded from third-party providers
            (such as IMDb or OMDb). We do not control how these services handle
            requests made from your browser.
          </p>
        </section>

        <section className="mb-4">
          <h4>Changes to this policy</h4>
          <p>
            This privacy policy may be updated as the application evolves.
            Any changes will be reflected on this page.
          </p>
        </section>

        <p className="text-muted small mt-5">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

    </div>
  );
};

export default Privacy;
