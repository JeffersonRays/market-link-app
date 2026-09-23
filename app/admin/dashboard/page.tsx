import {
  ApprovalTable,
  DashboardShell,
  PlatformOrderTable,
  QuickActions,
  ReviewCard,
  SectionHeader,
  StatCard,
  StatGrid,
  StatusBadge,
} from "../../dashboard/components";

import {
  adminApprovals,
  adminReviews,
  marketActivity,
  platformOrders,
  registrations,
} from "../../dashboard-data";

import { Icon } from "../../components";

export default function AdminDashboard() {
  return (
    <DashboardShell
      role="admin"
      name="MarketLink Admin"
      initials="AD"
      eyebrow="MarketLink admin"
      title="Good morning, team"
      subtitle="A quick pulse check on the marketplace today."
    >
      <div className="admin-dashboard-content">
        {/* =====================================================
            PLATFORM OVERVIEW HERO
        ====================================================== */}

        <section className="admin-command-hero">
          <div className="admin-command-copy">
            <div className="admin-command-status">
              <span className="admin-live-dot" />
              PLATFORM OPERATING NORMALLY
            </div>

            <h2>MarketLink is active across 16 markets today.</h2>

            <p>
              Farmers are selling, customers are ordering, and overall
              marketplace activity is trending upward this month.
            </p>

            <div className="admin-command-metrics">
              <div>
                <small>Active farmers today</small>
                <strong>73</strong>
              </div>

              <div>
                <small>Orders today</small>
                <strong>286</strong>
              </div>

              <div>
                <small>Order value today</small>
                <strong>₦2.84M</strong>
              </div>

              <div>
                <small>Completion rate</small>
                <strong>93.1%</strong>
              </div>
            </div>
          </div>

          <div className="admin-health-panel">
            <div className="admin-health-header">
              <div>
                <small>PLATFORM HEALTH</small>
                <h3>Everything looks stable</h3>
              </div>

              <span className="admin-health-badge">Healthy</span>
            </div>

            <div className="admin-health-items">
              <div>
                <span>
                  <i className="admin-health-good" />
                  Order processing
                </span>
                <strong>Normal</strong>
              </div>

              <div>
                <span>
                  <i className="admin-health-good" />
                  Farmer availability
                </span>
                <strong>73 online</strong>
              </div>

              <div>
                <span>
                  <i className="admin-health-warning" />
                  Pending approvals
                </span>
                <strong>12</strong>
              </div>

              <div>
                <span>
                  <i className="admin-health-good" />
                  Markets active today
                </span>
                <strong>3</strong>
              </div>
            </div>

            <button className="admin-health-action">
              View platform activity
              <span>→</span>
            </button>
          </div>
        </section>

        {/* =====================================================
            ATTENTION CENTER
        ====================================================== */}

        <section className="admin-attention-center">
          <div className="admin-attention-heading">
            <span>Needs attention</span>
            <strong>Administrative tasks waiting for review</strong>
          </div>

          <div className="admin-attention-actions">
            <button>
              <span className="admin-attention-icon orange">
                <Icon name="shield" size={16} />
              </span>

              <span>
                <strong>12 farmer approvals</strong>
                <small>Waiting for verification</small>
              </span>

              <b>→</b>
            </button>

            <button>
              <span className="admin-attention-icon red">
                <Icon name="star" size={16} />
              </span>

              <span>
                <strong>4 flagged reviews</strong>
                <small>Moderation recommended</small>
              </span>

              <b>→</b>
            </button>

            <button>
              <span className="admin-attention-icon blue">
                <Icon name="users" size={16} />
              </span>

              <span>
                <strong>37 new registrations</strong>
                <small>Since yesterday</small>
              </span>

              <b>→</b>
            </button>
          </div>
        </section>

        {/* =====================================================
            PLATFORM STATS
        ====================================================== */}

        <StatGrid className="admin-stats admin-dashboard-stats">
          <StatCard
            label="Total farmers"
            value="148"
            detail="+8 this month"
            icon="users"
            tone="green"
          />

          <StatCard
            label="Pending approvals"
            value="12"
            detail="Need your review"
            icon="shield"
            tone="orange"
          />

          <StatCard
            label="Total customers"
            value="2,840"
            detail="+184 this month"
            icon="users"
            tone="lilac"
          />

          <StatCard
            label="Total markets"
            value="16"
            detail="3 active today"
            icon="storefront"
            tone="blue"
          />

          <StatCard
            label="Total products"
            value="1,286"
            detail="Across all markets"
            icon="package"
            tone="green"
          />

          <StatCard
            label="Total orders"
            value="8,492"
            detail="+14% this month"
            icon="chart"
            tone="orange"
          />

          <StatCard
            label="Completed orders"
            value="7,910"
            detail="93.1% completion rate"
            icon="check"
            tone="lilac"
          />
        </StatGrid>

        {/* =====================================================
            FARMER APPROVALS
        ====================================================== */}

        <section className="admin-dashboard-panel admin-approval-panel">
          <div className="admin-panel-header-row">
            <SectionHeader
              eyebrow="Needs your attention"
              title="Pending farmer approvals"
              action="Review all farmers"
            />

            <div className="admin-panel-counter">
              <strong>12</strong>
              <span>pending review</span>
            </div>
          </div>

          <ApprovalTable approvals={adminApprovals} />
        </section>

        {/* =====================================================
            ORDERS
        ====================================================== */}

        <section className="admin-dashboard-panel admin-orders-panel">
          <div className="admin-panel-header-row">
            <SectionHeader
              eyebrow="Live platform activity"
              title="Platform order overview"
              action="View all orders"
            />

            <div className="admin-order-summary">
              <span>
                <strong>286</strong>
                today
              </span>

              <i />

              <span>
                <strong>₦2.84M</strong>
                order value
              </span>

              <i />

              <span>
                <strong>93.1%</strong>
                completed
              </span>
            </div>
          </div>

          <PlatformOrderTable orders={platformOrders} />
        </section>

        {/* =====================================================
            MARKET ACTIVITY + CATEGORY SHARE
        ====================================================== */}

        <div className="dashboard-two-column admin-middle-row admin-dashboard-grid">
          <section className="admin-dashboard-panel">
            <SectionHeader
              eyebrow="Across the network"
              title="Market activity"
              action="Manage markets"
            />

            <div className="admin-market-overview">
              <div>
                <strong>16</strong>
                <span>Total markets</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Active today</span>
              </div>

              <div>
                <strong>73</strong>
                <span>Farmers selling</span>
              </div>
            </div>

            <div className="admin-market-list">
              {marketActivity.map((market) => (
                <article className="admin-market-row" key={market.slug}>
                  <span className="admin-market-icon">
                    <Icon name="storefront" size={18} />
                  </span>

                  <div>
                    <strong>{market.name}</strong>
                    <small>
                      {market.activeFarmers} active farmers ·{" "}
                      {market.weeklyOrders} orders this week
                    </small>
                  </div>

                  <div className="admin-market-day">
                    <small>{market.days}</small>
                    <StatusBadge status={market.status} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-dashboard-panel">
            <SectionHeader
              eyebrow="What people are browsing"
              title="Popular categories"
              action="Manage categories"
            />

            <div className="admin-category-summary">
              <strong>92%</strong>
              <span>
                of product discovery comes from the top four categories
              </span>
            </div>

            <div className="category-list admin-category-list">
              <div>
                <span className="category-icon category-veg">✦</span>

                <span className="admin-category-name">
                  <strong>Vegetables</strong>
                  <small>Most popular</small>
                </span>

                <span className="admin-category-bar">
                  <i style={{ width: "38%" }} />
                </span>

                <b>38%</b>
              </div>

              <div>
                <span className="category-icon category-fruit">●</span>

                <span className="admin-category-name">
                  <strong>Fruits</strong>
                  <small>Strong demand</small>
                </span>

                <span className="admin-category-bar">
                  <i style={{ width: "24%" }} />
                </span>

                <b>24%</b>
              </div>

              <div>
                <span className="category-icon category-dairy">◒</span>

                <span className="admin-category-name">
                  <strong>Dairy</strong>
                  <small>Steady interest</small>
                </span>

                <span className="admin-category-bar">
                  <i style={{ width: "19%" }} />
                </span>

                <b>19%</b>
              </div>

              <div>
                <span className="category-icon category-bake">✧</span>

                <span className="admin-category-name">
                  <strong>Baked goods</strong>
                  <small>Growing category</small>
                </span>

                <span className="admin-category-bar">
                  <i style={{ width: "11%" }} />
                </span>

                <b>11%</b>
              </div>
            </div>
          </section>
        </div>

        {/* =====================================================
            REVIEWS + REGISTRATIONS
        ====================================================== */}

        <div className="dashboard-two-column admin-bottom-row admin-dashboard-grid">
          <section className="admin-dashboard-panel">
            <SectionHeader
              eyebrow="Keep the marketplace healthy"
              title="Recent reviews"
              action="Moderate reviews"
            />

            <div className="admin-review-summary">
              <div>
                <strong>4.8</strong>

                <span>
                  <b>★★★★★</b>
                  <small>Average platform rating</small>
                </span>
              </div>

              <span className="admin-review-alert">4 need review</span>
            </div>

            <div className="review-list">
              {adminReviews.map((review) => (
                <ReviewCard review={review} key={review.name} />
              ))}
            </div>
          </section>

          <section className="admin-dashboard-panel">
            <SectionHeader
              eyebrow="Growing the community"
              title="Recent registrations"
              action="View directory"
            />

            <div className="admin-registration-summary">
              <div>
                <strong>+37</strong>
                <span>new registrations today</span>
              </div>

              <div>
                <strong>+184</strong>
                <span>this month</span>
              </div>
            </div>

            <div className="registration-list">
              {registrations.map((registration) => (
                <article className="registration-row" key={registration.name}>
                  <span
                    className="avatar avatar-small"
                    style={{ background: registration.accent }}
                  >
                    {registration.initials}
                  </span>

                  <div>
                    <strong>{registration.name}</strong>
                    <small>
                      {registration.type} · {registration.detail}
                    </small>
                  </div>

                  <time>{registration.time}</time>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <section className="admin-dashboard-panel admin-actions-section">
          <div className="admin-quick-action-heading">
            <div>
              <p className="eyebrow">Common tasks</p>
              <h2>Quick actions</h2>
              <span>
                Jump directly into the administrative tools you use most.
              </span>
            </div>
          </div>

          <QuickActions
            items={[
              "Add a new market",
              "Review farmer applications",
              "Manage categories",
              "Create announcement",
            ]}
          />
        </section>
      </div>
    </DashboardShell>
  );
}
