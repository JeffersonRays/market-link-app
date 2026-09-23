import {
  DashboardShell,
  DashboardProductCard,
  FarmerCardSmall,
  MarketCardSmall,
  NotificationItem,
  OrderCard,
  PickupCard,
  SectionHeader,
  StatCard,
  StatGrid,
} from "../../dashboard/components";

import {
  customerNotifications,
  customerOrders,
  dashboardData,
} from "../../dashboard-data";

export default function CustomerDashboard() {
  return (
    <DashboardShell
      role="customer"
      name="Ada Nwosu"
      initials="AN"
      eyebrow="Your MarketLink"
      title="Good morning, Ada"
      subtitle="Fresh produce, trusted farmers, and your market day in one place."
    >
      <div className="customer-dashboard-content">
        {/* MARKET DAY OVERVIEW */}
        <section className="customer-market-overview">
          <div className="customer-market-overview-copy">
            <span className="customer-overview-label">
              SATURDAY MARKET PLAN
            </span>

            <h2>Your weekend shopping is already taking shape.</h2>

            <p>
              One order is ready for pickup and two of your favourite farmers
              are selling today.
            </p>

            <div className="customer-overview-chips">
              <span>
                <i />1 ready for pickup
              </span>

              <span>
                <i />3 active orders
              </span>

              <span>
                <i />2 favourites selling
              </span>
            </div>

            <div className="customer-overview-actions">
              <button className="customer-primary-button">
                Browse fresh produce
              </button>

              <button className="customer-secondary-button">
                Explore markets
              </button>
            </div>
          </div>

          <div className="customer-next-pickup-summary">
            <span className="customer-next-label">NEXT PICKUP</span>

            <div className="customer-next-date">
              <strong>18</strong>
              <span>
                <b>Saturday</b>
                <small>May</small>
              </span>
            </div>

            <div className="customer-next-divider" />

            <div className="customer-next-meta">
              <span>10:30 AM</span>
              <p>Green Acre Farms</p>
              <small>{customerOrders[0].market}</small>
            </div>
          </div>
        </section>

        {/* STATS */}
        <StatGrid className="customer-stats customer-stat-grid">
          <StatCard
            label="Active orders"
            value="3"
            detail="Across 2 markets"
            icon="package"
            tone="green"
          />

          <StatCard
            label="Ready for pickup"
            value="1"
            detail="Next: Saturday, 10:30 AM"
            icon="truck"
            tone="orange"
          />

          <StatCard
            label="Completed orders"
            value="18"
            detail="Since joining in 2024"
            icon="check"
            tone="lilac"
          />

          <StatCard
            label="Favorite farmers"
            value="6"
            detail="2 selling today"
            icon="heart"
            tone="blue"
          />
        </StatGrid>

        {/* UPCOMING PICKUP */}
        <section className="customer-feature-panel">
          <SectionHeader
            eyebrow="Ready when you are"
            title="Upcoming pickup"
            action="View all orders"
          />

          <PickupCard order={customerOrders[0]} />
        </section>

        {/* ORDERS + FARMERS */}
        <div className="dashboard-two-column customer-orders-row customer-section-grid">
          <section className="customer-panel customer-orders-panel">
            <SectionHeader
              eyebrow="Track your purchases"
              title="Active orders"
              action="View all"
            />

            <div className="order-list">
              {customerOrders.slice(1).map((order) => (
                <OrderCard order={order} key={order.id} />
              ))}
            </div>
          </section>

          <section className="customer-panel">
            <SectionHeader
              eyebrow="People you trust"
              title="Favorite farmers"
              action="See all"
            />

            <div className="dashboard-farmer-grid">
              {dashboardData.farmers.slice(0, 2).map((farmer) => (
                <FarmerCardSmall farmer={farmer} key={farmer.slug} />
              ))}
            </div>
          </section>
        </div>

        {/* PRODUCTS */}
        <section className="dashboard-soft-section customer-fresh-section">
          <div className="customer-fresh-header">
            <SectionHeader
              eyebrow="Picked this week"
              title="Fresh this week"
              action="Browse all produce"
            />

            <p>
              Seasonal produce available from farmers around your favourite
              markets.
            </p>
          </div>

          <div className="dashboard-product-grid">
            {dashboardData.products.slice(0, 4).map((product) => (
              <DashboardProductCard product={product} key={product.slug} />
            ))}
          </div>
        </section>

        {/* MARKETS + NOTIFICATIONS */}
        <div className="dashboard-two-column customer-bottom-row customer-section-grid">
          <section className="customer-panel">
            <SectionHeader
              eyebrow="Find your next stop"
              title="Nearby markets"
              action="Explore markets"
            />

            <div className="dashboard-market-grid">
              {dashboardData.markets.slice(0, 2).map((market) => (
                <MarketCardSmall market={market} key={market.slug} />
              ))}
            </div>
          </section>

          <section className="customer-panel customer-notifications-panel">
            <SectionHeader
              eyebrow="Good to know"
              title="Recent notifications"
              action="Mark all read"
            />

            <div className="notification-list">
              {customerNotifications.map((item) => (
                <NotificationItem item={item} key={item.title} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
