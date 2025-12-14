import React from "react";
import MovieFooter from "./components/MovieFooter";

const ContactUs = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary text-dark">

      {/* Main Content */}
      <div className="container py-5 flex-grow-1">
        <h1 className="text-warning mb-4">Contact Us</h1>

        <p className="text-muted">
          If you have questions, feedback, or need support, feel free to reach
          out to our team. We’re happy to help.
        </p>

        <hr className="border-secondary my-4" />

        <section className="mb-4">
          <h4>Project Team</h4>
          <p>
            You can contact any of the team members below via email:
          </p>

          <ul className="list-unstyled mt-3">
            <li className="mb-2">
              <strong>Bhisma Osti</strong><br />
              <a
                href="mailto:stud-bhisma@ruc.dk"
                className="text-warning text-decoration-none"
              >
                stud-bhisma@ruc.dk
              </a>
            </li>

            <li className="mb-2">
              <strong>Deepesh Raj Ghimire</strong><br />
              <a
                href="mailto:stud-deepesh@ruc.dk"
                className="text-warning text-decoration-none"
              >
                stud-deepesh@ruc.dk
              </a>
            </li>

            <li className="mb-2">
              <strong>Krishna Prasad Khanal</strong><br />
              <a
                href="mailto:stud-khanal@ruc.dk"
                className="text-warning text-decoration-none"
              >
                stud-khanal@ruc.dk
              </a>
            </li>

            <li className="mb-2">
              <strong>Syed Amad Hussain Shah Kazmi</strong><br />
              <a
                href="mailto:stud-syedk@ruc.dk"
                className="text-warning text-decoration-none"
              >
                stud-syedk@ruc.dk
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-4">
          <h4>Support & Feedback</h4>
          <p>
            For technical issues, login problems, or feature suggestions,
            please include a short description of the issue when contacting us.
          </p>
        </section>

        <p className="text-muted small mt-5">
          We usually respond within a reasonable time during working days.
        </p>
      </div>

    </div>
  );
};

export default ContactUs;
