import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.scss';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Festivio</h1>
          <p>Organize and manage your events with ease</p>
          <Link to="/register" className="cta-button">Get Started</Link>
        </div>
      </section>

      <main>
        {/* Your main content goes here */}
      </main>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h2 className="stat-number">98%</h2>
            <h3 className="stat-title">ENGAGE EVERYONE TILL THE END</h3>
            <p className="stat-description">
              Witness a 70% jump in your engagement rate by delivering an immersive attendee experience.
            </p>
          </div>

          <div className="stat-item">
            <h2 className="stat-number">3X</h2>
            <h3 className="stat-title">BUILD A CONNECTED COMMUNITY</h3>
            <p className="stat-description">
              Unleash the most influential event networking features that multiply organic conversations by 3X.
            </p>
          </div>

          <div className="stat-item">
            <h2 className="stat-number">200%</h2>
            <h3 className="stat-title">GET THE BEST ROI</h3>
            <p className="stat-description">
              Double your leads and revenue using the most in-depth event analytics and audience insights.
            </p>
          </div>
        </div>
        <div className="stats-cta">
          <Link to="/login" className="cta-button">Get These Results</Link>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Festivio is your go-to platform for seamless event organization and management.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@festivio.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2023 Festivio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;