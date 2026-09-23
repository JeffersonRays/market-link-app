import {
  DashboardShell,
  InventoryTable,
  MarketCardSmall,
  PickupTable,
  QuickActions,
  ReviewCard,
  SectionHeader,
  StatCard,
  StatGrid,
  StatusBadge,
} from "../../dashboard/components";

import {
  farmerOrders,
  farmerReviews,
  inventory,
  dashboardData,
} from "../../dashboard-data";

export default function FarmerDashboard() {
  return (
    <DashboardShell
      role="farmer"
      name="Green Acre Farms"
      initials="GA"
      eyebrow="Green Acre Farms"
      title="Good morning, Green Acre"
      subtitle="Your Saturday market is looking busy. Here's the day at a glance."
    >
      <div className="farmer-dashboard-content">
        {/* =====================================================
            FARMER DAY HERO
        ====================================================== */}

        <section className="farmer-day-hero">
          <div className="farmer-day-copy">
            <div className="farmer-day-status">
              <span className="farmer-live-dot" />
              SELLING TODAY
            </div>

            <h2>You&apos;re open and customers are already placing orders.</h2>

            <p>
              Keep stock accurate, prepare upcoming pickups and respond to
              pending orders before market opens.
            </p>

            <div className="farmer-day-meta">
              <div>
                <small>Market</small>
                <strong>Lekki Farmers Market</strong>
              </div>

              <div>
                <small>Stall</small>
                <strong>B14</strong>
              </div>

              <div>
                <small>Market hours</small>
                <strong>8:00 AM – 4:00 PM</strong>
              </div>
            </div>

            <div className="farmer-hero-actions">
              <button className="farmer-primary-action">
                View today&apos;s orders
              </button>

              <button className="farmer-secondary-action">Update stock</button>
            </div>
          </div>

          <div className="farmer-selling-panel">
            <div className="farmer-selling-panel-top">
              <span className="selling-leaf farmer-selling-icon">
                <span>✦</span>
              </span>

              <div>
                <small>MARKET VISIBILITY</small>
                <h3>You&apos;re open for business</h3>
              </div>
            </div>

            <p>
              Customers can see your available produce and reserve items for
              pickup.
            </p>

            <div className="farmer-selling-toggle-row">
              <div>
                <strong>Visible to customers</strong>
                <span>Your farm appears as selling today.</span>
              </div>

              <div className="selling-control">
                <span className="selling-control-copy">
                  <b>ON</b>
                </span>

                <button
                  className="toggle-large is-on"
                  aria-label="Toggle selling status"
                >
                  <i />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            ATTENTION STRIP
        ====================================================== */}

        <section className="farmer-attention-strip">
          <div className="farmer-attention-heading">
            <span>Needs your attention</span>
            <strong>3 things before the market gets busy</strong>
          </div>

          <div className="farmer-attention-items">
            <button>
              <span className="attention-number">8</span>

              <span>
                <strong>Pending orders</strong>
                <small>Accept or decline</small>
              </span>

              <b>→</b>
            </button>

            <button>
              <span className="attention-number">2</span>

              <span>
                <strong>Sold out products</strong>
                <small>Review your stock</small>
              </span>

              <b>→</b>
            </button>

            <button>
              <span className="attention-number">11</span>

              <span>
                <strong>Ready pickups</strong>
                <small>Next at 10:30 AM</small>
              </span>

              <b>→</b>
            </button>
          </div>
        </section>

        {/* =====================================================
            STATS
        ====================================================== */}

        <StatGrid className="farmer-stats farmer-dashboard-stats">
          <StatCard
            label="Today's orders"
            value="24"
            detail="↑ 12% vs last Saturday"
            icon="package"
            tone="green"
          />

          <StatCard
            label="Pending orders"
            value="8"
            detail="Need your attention"
            icon="clock"
            tone="orange"
          />

          <StatCard
            label="Ready for pickup"
            value="11"
            detail="Next pickup at 10:30 AM"
            icon="truck"
            tone="lilac"
          />

          <StatCard
            label="Weekly sales value"
            value="₦184,600"
            detail="↑ 18% vs last week"
            icon="chart"
            tone="blue"
          />

          <StatCard
            label="Available products"
            value="12"
            detail="Across 2 markets"
            icon="leaf"
            tone="green"
          />

          <StatCard
            label="Sold out products"
            value="2"
            detail="Restock before Saturday"
            icon="package"
            tone="orange"
          />
        </StatGrid>

        {/* =====================================================
            PICKUPS
        ====================================================== */}

        <section className="farmer-dashboard-panel farmer-pickups-panel">
          <div className="farmer-panel-heading">
            <SectionHeader
              eyebrow="Saturday, 18 May"
              title="Today's pickup schedule"
              action="View all orders"
            />

            <div className="farmer-panel-summary">
              <span>
                <strong>11</strong>
                ready
              </span>

              <i />

              <span>
                <strong>10:30 AM</strong>
                next pickup
              </span>
            </div>
          </div>

          <PickupTable orders={farmerOrders} />
        </section>

        {/* =====================================================
            INVENTORY
        ====================================================== */}

        <section className="farmer-dashboard-panel farmer-inventory-panel">
          <div className="farmer-panel-heading">
            <SectionHeader
              eyebrow="Stock at a glance"
              title="Weekly inventory overview"
              action="Update stock"
            />

            <div className="farmer-inventory-key">
              <span>
                <i className="inventory-key-good" />
                Healthy
              </span>

              <span>
                <i className="inventory-key-low" />
                Low stock
              </span>

              <span>
                <i className="inventory-key-out" />
                Sold out
              </span>
            </div>
          </div>

          <InventoryTable items={inventory} />
        </section>

        {/* =====================================================
            PERFORMANCE + MARKETS
        ====================================================== */}

        <div className="dashboard-two-column farmer-middle-row farmer-dashboard-grid">
          <section className="farmer-dashboard-panel">
            <SectionHeader
              eyebrow="What's moving"
              title="Product performance"
              action="View analytics"
            />

            <div className="farmer-performance-summary">
              <div>
                <small>This week&apos;s sales</small>
                <strong>₦184,600</strong>
                <span>+18% from last week</span>
              </div>

              <div className="farmer-performance-bars">
                <i style={{ height: "35%" }} />
                <i style={{ height: "48%" }} />
                <i style={{ height: "42%" }} />
                <i style={{ height: "61%" }} />
                <i style={{ height: "55%" }} />
                <i style={{ height: "75%" }} />
                <i className="active" style={{ height: "94%" }} />
              </div>
            </div>

            <div className="performance-card farmer-performance-card">
              <div className="performance-row">
                <span className="performance-rank">01</span>

                <div>
                  <strong>Vine-ripened tomatoes</strong>
                  <small>Best seller · 32 kg sold this week</small>
                </div>

                <b>₦57,600</b>
              </div>

              <div className="performance-row">
                <span className="performance-rank">02</span>

                <div>
                  <strong>Butter lettuce</strong>
                  <small>Most reserved · 16 heads reserved</small>
                </div>

                <b>₦25,200</b>
              </div>

              <div className="performance-row">
                <span className="performance-rank">03</span>

                <div>
                  <strong>Fresh basil</strong>
                  <small>Sold out · Restock recommended</small>
                </div>

                <StatusBadge status="Sold Out" />
              </div>
            </div>
          </section>

          <section className="farmer-dashboard-panel">
            <SectionHeader
              eyebrow="Your selling spots"
              title="Markets"
              action="Manage markets"
            />

            <div className="farmer-market-summary">
              <div>
                <strong>2</strong>
                <span>active markets</span>
              </div>

              <div>
                <strong>Saturday</strong>
                <span>next market day</span>
              </div>
            </div>

            <div className="dashboard-market-stack">
              {dashboardData.markets.slice(0, 2).map((market) => (
                <MarketCardSmall
                  market={market}
                  meta={
                    market.slug === "lekki-farmers-market"
                      ? "Stall B14"
                      : "Stall C08"
                  }
                  key={market.slug}
                />
              ))}
            </div>
          </section>
        </div>

        {/* =====================================================
            REVIEWS + QUICK ACTIONS
        ====================================================== */}

        <div className="dashboard-two-column farmer-bottom-row farmer-dashboard-grid">
          <section className="farmer-dashboard-panel">
            <SectionHeader
              eyebrow="From your customers"
              title="Recent reviews"
              action="See all reviews"
            />

            <div className="farmer-review-overview">
              <div className="farmer-rating-score">
                <strong>4.9</strong>

                <span>
                  <b>★★★★★</b>
                  <small>Based on 84 customer reviews</small>
                </span>
              </div>

              <span className="farmer-review-pill">
                Excellent customer feedback
              </span>
            </div>

            <div className="review-list">
              {farmerReviews.map((review) => (
                <ReviewCard review={review} key={review.name} />
              ))}
            </div>
          </section>

          <section className="farmer-dashboard-panel farmer-actions-panel">
            <SectionHeader
              eyebrow="Make today easier"
              title="Quick actions"
              action={null}
            />

            <p className="farmer-actions-description">
              Common things you might need while preparing for market day.
            </p>

            <QuickActions
              items={[
                "Add a new product",
                "Update weekly stock",
                "View all orders",
                "Manage pickup slots",
              ]}
            />

            <div className="farmer-market-tip">
              <span>✦</span>

              <div>
                <strong>Market day tip</strong>

                <p>
                  Keep your available stock updated so customers don&apos;t
                  reserve produce you&apos;ve already sold at your stall.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
