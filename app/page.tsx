import Link from "next/link";
import {
  Footer,
  FarmerShelf,
  Header,
  Icon,
  MapMock,
  MarketCard,
  ProductShelf,
  SectionHeading,
} from "./components";
import { markets } from "./data";

export default function Home() {
  return (
    <>
      <Header />

      <main className="home-page">
        {/* HERO */}
        <section className="hero home-hero">
          <div className="hero-noise" />

          <div className="container hero-grid home-hero-grid">
            <div className="hero-copy home-hero-copy">
              <div className="hero-kicker">
                <span className="hero-kicker-dot" />
                Fresh from local farmers
              </div>

              <h1>
                Know what&apos;s
                <span> fresh </span>
                before market day.
              </h1>

              <p>
                Discover local markets, see what farmers are bringing this week,
                reserve your favourites, and pick them up when you arrive.
              </p>

              <div className="hero-actions">
                <Link className="button hero-primary-button" href="/markets">
                  Explore markets
                  <Icon name="arrow" size={17} />
                </Link>

                <Link
                  className="button button-outline hero-secondary-button"
                  href="/products"
                >
                  Browse fresh produce
                </Link>
              </div>

              <div className="hero-trust-row">
                <div>
                  <Icon name="check" size={15} />
                  <span>No online payment</span>
                </div>

                <div>
                  <Icon name="check" size={15} />
                  <span>Reserve before market day</span>
                </div>

                <div>
                  <Icon name="check" size={15} />
                  <span>Pay farmers directly</span> 
                </div>
              </div>
            </div>

            <div className="hero-visual home-hero-visual">
              <div className="hero-photo home-hero-photo" />

              <div className="hero-stamp home-hero-stamp">
                <div>
                  <span>42+</span>
                  local
                  <br />
                  growers
                </div>
              </div>

              <div className="floating-stock home-floating-stock">
                <div className="floating-stock-header">
                  <div>
                    <p>AVAILABLE THIS WEEK</p>
                    <strong>Vine tomatoes</strong>
                  </div>

                  <span>Fresh</span>
                </div>

                <div className="stock-row">
                  <span>12 kg remaining</span>
                  <b>₦1,800/kg</b>
                </div>

                <div className="stock-bar">
                  <i />
                </div>

                <div className="stock-footer">
                  <span>From Ada&apos;s Farm</span>
                  <span>Reserve →</span>
                </div>
              </div>
            </div>
          </div>
        </section>
<section className="market-run-section">
  <div className="market-run-container">
    <div className="market-run-content">
      <span className="market-run-subtitle">PLAN YOUR MARKET RUN</span>
      <h2 className="market-run-title">What are you looking for this week?</h2>
    </div>
    <div className="market-run-filters">
      <button className="filter-pill green-pill">
        All markets <span className="dropdown-arrow">v</span>
      </button>
      <button className="filter-pill green-pill">
        This week <span className="dropdown-arrow">v</span>
      </button>
      <button className="filter-pill search-pill">
        Search &rarr;
      </button>
    </div>
  </div>
</section>
     
        <section className="home-value-strip">
          <div className="container home-value-grid">
            <div className="home-value-item">
              <span className="home-value-number">01</span>
              <div>
                <strong>See what&apos;s actually available</strong>
                <p>Weekly stock directly from local farmers.</p>
              </div>
            </div>

            <div className="home-value-item">
              <span className="home-value-number">02</span>
              <div>
                <strong>Reserve before it&apos;s gone</strong>
                <p>Your reservation reduces available stock immediately.</p>
              </div>
            </div>

            <div className="home-value-item">
              <span className="home-value-number">03</span>
              <div>
                <strong>Collect and pay in person</strong>
                <p>Show your pickup code and pay the farmer directly.</p>
              </div>
            </div>
          </div>

        </section>
       
        <section className="section home-markets-section">
          <div className="container">
            <SectionHeading
              eyebrow="Markets near you"
              title="A good Saturday starts at the right market."
              text="Explore trusted local markets, see who's selling, and know what is waiting before you leave home."
              action={
                <Link className="section-link" href="/markets">
                  View all markets
                  <Icon name="arrow" size={15} />
                </Link>
              }
            />

            <div className="market-grid home-market-grid">
              {markets.slice(0, 3).map((market, index) => (
                <div
                  className={`home-market-card ${
                    index === 0 ? "home-market-card-featured" : ""
                  }`}
                  key={market.slug}
                >
                  <MarketCard market={market} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="section section-soft home-products-section">
          <div className="container">
            <div className="home-products-heading">
              <SectionHeading
                eyebrow="Picked this week"
                title="Fresh finds, before they sell out."
                text="See what farmers are bringing this week and reserve the produce you don't want to miss."
                action={
                  <Link className="section-link" href="/products">
                    Browse all produce
                    <Icon name="arrow" size={15} />
                  </Link>
                }
              />

              <div className="home-live-note">
                <span />
                Stock shown reflects current reservations
              </div>
            </div>

            <ProductShelf limit={6} />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section home-how-section">
          <div className="container how-grid home-how-grid">
            <div className="home-how-copy">
              <p className="eyebrow">From farm to market bag</p>

              <h2 className="section-heading-title">
                Your market trip,
                <br />
                with fewer surprises.
              </h2>

              <p className="how-intro">
                MarketLink gives you certainty without taking the market out of
                farmers&apos; hands. Browse, reserve, collect and pay in person.
              </p>

              <div className="steps home-steps">
                <div className="step">
                  <div className="step-number">01</div>

                  <div>
                    <span className="step-label">BEFORE MARKET DAY</span>
                    <h3>Discover what&apos;s fresh</h3>
                    <p>
                      Browse local farmers and see the exact stock they plan to
                      bring this week.
                    </p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">02</div>

                  <div>
                    <span className="step-label">WHEN YOU FIND IT</span>
                    <h3>Reserve your favourites</h3>
                    <p>
                      Reserve the quantity you need. Available stock updates as
                      customers reserve.
                    </p>
                  </div>
                </div>

                <div className="step">
                  <div className="step-number">03</div>

                  <div>
                    <span className="step-label">AT THE MARKET</span>
                    <h3>Pick up and pay</h3>
                    <p>
                      Once your order is ready, show your pickup confirmation
                      code and pay your farmer directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

           </div>
        </section>

        {/* FARMERS */}
        <section className="section section-soft home-farmers-section">
          <div className="container">
            <SectionHeading
              eyebrow="Selling this week"
              title="Know the people behind your food."
              text="Follow the farmers you love, discover what they're bringing this week, and make them part of your regular market routine."
              action={
                <Link className="section-link" href="/farmers">
                  Meet all farmers
                  <Icon name="arrow" size={15} />
                </Link>
              }
            />

            <FarmerShelf limit={3} />
          </div>
        </section>

        {/* MAP */}
        <section className="map-section home-map-section">
          <div className="container map-layout home-map-layout">
            <div className="home-map-copy">
              <p className="eyebrow">Closer than you think</p>

              <h2 className="section-heading-title">
                Find your next
                <br />
                market morning.
              </h2>

              <p className="how-intro">
                Discover markets near you, see the farmers attending, check
                their weekly inventory and plan your pickup before you arrive.
              </p>

              <div className="home-map-stats">
                <div>
                  <strong>12</strong>
                  <span>Markets</span>
                </div>

                <div>
                  <strong>42+</strong>
                  <span>Farmers</span>
                </div>

                <div>
                  <strong>180+</strong>
                  <span>Fresh items</span>
                </div>
              </div>

              <Link className="button" href="/markets">
                Explore nearby markets
                <Icon name="arrow" size={17} />
              </Link>
            </div>

            <div className="home-map-shell">
              <MapMock />

              <div className="home-map-live">
                <i />8 farmers selling today
              </div>
            </div>
          </div>
        </section>

        {/* FARMER CTA */}
        <section className="section farmer-cta home-farmer-cta">
          <div className="home-farmer-pattern" />

          <div className="container">
            <div>
              <p className="eyebrow">Built for the people who grow it</p>

              <h2>
                Take your market stall
                <br />
                beyond market day.
              </h2>

              <p>
                Publish your weekly stock, accept reservations from regulars and
                know what is already sold before you arrive at the market.
              </p>

              <div className="farmer-cta-benefits">
                <span>
                  <Icon name="check" size={14} />
                  Weekly inventory
                </span>

                <span>
                  <Icon name="check" size={14} />
                  Simple reservations
                </span>

                <span>
                  <Icon name="check" size={14} />
                  No platform payments
                </span>
              </div>
            </div>

            <Link className="button" href="/join">
              Join as a farmer
              <Icon name="arrow" size={17} />
            </Link>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta home-final-cta">
          <div className="container">
            <span className="final-cta-mark">M</span>

            <p className="eyebrow">Your weekend starts here</p>

            <h2>
              Fresh food.
              <br />
              Familiar faces.
            </h2>

            <p>
              Find your market, discover what&apos;s fresh and reserve your next
              market bag before Saturday morning.
            </p>

            <Link className="button" href="/markets">
              Find a market
              <Icon name="arrow" size={17} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}