import React from "react";

const About = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary text-dark">

      {/* Main Content */}
      <div className="container py-5 flex-grow-1">
        <h1 className="text-warning mb-4">About MovieDB</h1>

        <p className="text-muted mb-4">
          MovieDB is a student-built movie discovery platform designed to help
          users explore films, view details, and manage their watchlist in a
          simple and secure way.
        </p>

        <hr className="border-secondary my-4" />

        <section className="mb-4">
          <h4>Our Mission</h4>
          <p>
            Our goal is to provide a clean, fast, and user-friendly interface
            for discovering movies while demonstrating modern full-stack
            development practices.
          </p>
        </section>

        <section className="mb-4">
          <h4>What We Built</h4>
          <ul>
            <li>Movie browsing with posters and metadata</li>
            <li>Secure authentication using JWT</li>
            <li>Personalized user experience</li>
            <li>Responsive design for mobile and desktop</li>
          </ul>
        </section>

        <section className="mb-4">
          <h4>Technology Stack</h4>
          <ul>
            <li>React + React Bootstrap (Frontend)</li>
            <li>ASP.NET Core Web API (Backend)</li>
            <li>JWT Authentication</li>
            <li>IMDb / OMDb data sources</li>
          </ul>
        </section>

        <section className="mb-4">
          <h4>Academic Project</h4>
          <p>
            This application was developed as part of a university project to
            demonstrate full-stack development, API design, authentication,
            and user-centric UI/UX design.
          </p>
        </section>

      </div>

    </div>
  );
};

export default About;
