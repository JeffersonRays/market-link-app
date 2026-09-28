'use client';

import { useState } from 'react';
import '../styles/contact.css';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter 
} from 'react-icons/fa';
import { Header, Footer } from '../components';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <>
      <Header />

      <main className="contact-page">
        <div className="contact-hero-banner">
          <div className="contact-hero-overlay" />
          <div className="contact-hero-content">
            <span className="contact-kicker">Get In Touch With Us</span>
            <h1>We’re Here to Help You Connect</h1>
            <p>
              Have questions about finding local farm storefronts or listing your produce? 
              Reach out to our support team and let’s grow together.
            </p>
          </div>
        </div>

        <div className="contact-container">
          
          <div className="contact-form">
            <h2>Send Us a Message</h2>
            
            {submitted && (
              <div style={{ 
                backgroundColor: '#e6f4ea', 
                color: '#137333', 
                padding: '12px 15px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                ✨ Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?" 
                />
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..." 
                  rows={5}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message →
              </button>
            </form>
          </div>

          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p className="info-subtext" style={{ color: '#8AAA67', marginBottom: '30px', fontSize: '14px' }}>
              Connect with our marketplace headquarters or reach out via our channels.
            </p>
            
            <div className="info-item">
              <FaEnvelope className="icon" />
              <p>marketlink06@gmail.com</p>
            </div>

            <div className="info-item">
              <FaPhone className="icon" />
              <p>+1 123-649-7501</p>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <p>12 Hawthorn Terrace, Richmond, TW9 1AE, United Kingdom</p>
            </div>

            <div className="socials-wrapper" style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px' }}>
              <h4 style={{ color: '#8AAA67', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Follow Our Community
              </h4>
              <div className="socials">
                <a href="#" aria-label="Facebook"><FaFacebook /></a>
                <a href="#" aria-label="Instagram"><FaInstagram /></a>
                <a href="#" aria-label="Twitter"><FaTwitter /></a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}