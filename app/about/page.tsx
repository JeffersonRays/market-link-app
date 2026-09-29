import Link from "next/link";
import { Header, Footer } from "../components";
import "../styles/about.css";

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

              <h1>Local food, closer to home.</h1>

              <p>
                Find nearby markets, see what local farmers have available, and
                reserve produce to pick up when you visit.
              </p>

              <div className="hero-actions">
                <Link className="button hero-primary-button" href="/markets">
                  Explore markets →
                </Link>
              </div>
            </div>

            <div className="about-hero-card">
              <div className="card-tag">Our Mission</div>
              <p>
                Help farmers share their produce and make it easier for shoppers
                to find local food and plan a market visit.
              </p>
              <Link href="/contact" className="card-link">
                Contact us →
              </Link>
            </div>
          </div>
        </section>

        <section className="section about-narrative-section">
          <div className="container">
            <div className="narrative-wrapper">
              <div className="narrative-label">
                <span className="dot" /> How MarketLink works
              </div>

              <h2>
                Discover local produce, see where it is sold, and reserve it for
                pickup.
              </h2>

              <p className="narrative-desc">
                Farmers can create profiles, list products, and manage weekly
                stock. Shoppers can browse markets and available produce, then
                place an order to collect from the farmer at a pickup time.
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
                  <h3>For shoppers</h3>
                  <h4>Browse and reserve</h4>
                  <p>
                    Check market and product listings, choose what you want, and
                    reserve it for pickup.
                  </p>
                </div>
              </div>

              <div className="about-stat-card card-bright">
                <div className="card-image-box image-four">
                  <div className="card-badge">↗</div>
                </div>
                <div className="card-content">
                  <h3>For farmers</h3>
                  <h4>Manage your listings</h4>
                  <p>
                    Set up a farmer profile, publish available stock, and keep
                    track of orders for your market days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-team-section">
          <div className="container">
            <div className="about-team-heading-row">
              <div className="about-team-copy">
                <p className="narrative-label">
                  <span className="dot" /> Project contributors
                </p>
                <h2 id="about-team-heading">
                  The people who brought MarketLink together.
                </h2>
                <p>Meet the five contributors behind the project.</p>
              </div>
              <div className="about-team-count">
                <strong>05</strong>
                <span>contributors</span>
              </div>
            </div>
            <ul
              className="about-team-list"
              aria-labelledby="about-team-heading"
            >
              {[
                {
                  name: "Esther Anosike",
                  initials: "EA",
                  role: "Frontend Developer",
                },
                {
                  name: "Esther Etumudon",
                  initials: "EE",
                  role: "UI/UX Designer",
                },
                {
                  name: "Yemi Akinsanya",
                  initials: "YA",
                  role: "Project Documentation and Workflow Developer",
                },
                {
                  name: "Jeffrey Ray-Yuba",
                  initials: "JR",
                  role: "Full-stack Developer",
                },
                {
                  name: "Busayo Oseni",
                  initials: "BO",
                  role: "UI/UX Designer",
                },
              ].map(({ name, initials, role }, index) => (
                <li className="about-team-card" key={name}>
                  <span className="about-team-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="about-team-avatar" aria-hidden="true">
                    {initials}
                  </span>
                  <h3>{name}</h3>
                  <p>{role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
