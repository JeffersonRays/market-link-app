import Link from 'next/link';
import { Header, Footer } from '../components';
import '../styles/about.css';

export default function About() {
  return (
    <>
      <Header />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-bg-overlay" />
          
          <div className="container about-hero-grid">
            <div className="about-hero-copy">
              <span className="hero-kicker">
                <span className="hero-kicker-dot" />
              Direct Agricultural Marketplace
              </span>
              
              <h1>Connecting Communities to Verified Local Producers.</h1>
              
              <p>
           We bridge the gap between agricultural producers and consumers. Explore verified 
                storefront locations, source fresh local harvests, and facilitate direct, transparent transactions.
              </p>

            <div className="hero-actions">
                <Link className="button hero-primary-button" href="/markets">
                  Explore Marketplace →
                </Link>
              </div>
            </div>

        
            <div className="about-hero-card">
              <div className="card-tag">Our Mission</div>
              <p>
               To empower local farmers with digital storefront infrastructure while providing 
                consumers with seamless, reliable access to verified producers and precise location data.
              </p>
              <Link href="/contact" className="card-link">Contact us→</Link>
            </div>
          </div>
        </section>

        <section className="section about-narrative-section">
          <div className="container">
            
            <div className="about-tabs">
              <button className="filter-pill green-pill active">About Us</button>
              <button className="filter-pill">Our Ecosystem</button>
              <button className="filter-pill">Vision</button>
              <button className="filter-pill">Mission</button>
            </div>

            <div className="narrative-wrapper">
              <div className="narrative-label">
                <span className="dot" /> Corporate Overview
              </div>
              
              <h2>
                Redefining agricultural commerce by establishing direct channels between local 
                producers and consumers for unprecedented transparency and accessibility.
              </h2>
              
              <p className="narrative-desc">
               By eliminating supply chain inefficiencies, our platform enables buyers to pinpoint exact 
                farmer storefronts, evaluate available inventory, and engage in direct commerce. We are 
                committed to fostering a sustainable, community-driven agricultural economy built on trust and visibility.
              </p>
              
              <Link href="/contact" className="section-link">
              Send Us A Message
              </Link>
            </div>

            <div className="about-cards-grid">
              
              <div className="about-stat-card card-dark">
                <div className="card-image-box image-three">
                  <div className="card-badge">↗</div>
                </div>
                <div className="card-content">
                  <h3>100%</h3>
                  <h4>Verified Producer Storefronts</h4>
                  <p>
                      Every merchant on our network undergoes verification. Consumers can access exact 
                    store coordinates, communicate directly with growers, and procure traceable, high-quality produce.
                  </p>
                </div>
              </div>

              <div className="about-stat-card card-bright">
                <div className="card-image-box image-four">
                  <div className="card-badge">↗</div>
                </div>
                <div className="card-content">
                  <h3>85%</h3>
                  <h4>Platform Reliability Index</h4>
                  <p>
                Our users experience exceptional satisfaction through streamlined vendor discovery, 
                    efficient logistics navigation, and empowered direct trade partnerships.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}