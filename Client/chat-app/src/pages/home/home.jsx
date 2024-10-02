import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Footer from '../../components/Footer/footer';
import './home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to CrimsonLink</h1>
        <p>Stay connected with your friends and colleagues in real-time.</p>
        <button className="cta-button">Get Started</button>
      </header>

      <section className="features-section">
        <h2>Our Features</h2>
        <div className="features-grid">
          <div className="feature-box">
            <h3>Real-time Messaging</h3>
            <p>Experience instant communication with low latency, ensuring your messages are always delivered on time.</p>
          </div>
          <Link to="/explore" className="feature-box"> {/* Wrap the Private Chats box with Link */}
            <h3>Private Chats</h3>
            <p>Have secure one-on-one conversations with your contacts and manage all your chats in one place.</p>
          </Link>
          <div className="feature-box">
            <h3>Group Conversations</h3>
            <p>Create groups and stay in touch with all your friends or colleagues at the same time.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
