"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiData, type User } from "../../lib/api";
import { Icon } from "../components";
import { DashboardEmptyState } from "./EmptyState";
import { ProtectedPage } from "./ProtectedPage";

type Row = Record<string, unknown> & { id: number };
type Counts = Record<string, number>;

export function LiveOverview({ role }: { role: User["role"] }) {
  const [stats, setStats] = useState<Counts>({});
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (role === "admin") {
          const summary = await apiData<Counts>("/admin/dashboard");
          setStats(summary);
          setItems(await apiData<Row[]>("/admin/orders"));
        } else if (role === "farmer") {
          const [orders, inventory, markets] = await Promise.all([
            apiData<Row[]>("/orders/farmer"),
            apiData<Row[]>("/farmer/inventory"),
            apiData<Row[]>("/farmers/me/markets"),
          ]);
          setStats({
            orders: orders.length,
            pending_orders: orders.filter((row) => row.status === "placed")
              .length,
            stock_lines: inventory.length,
            markets: markets.length,
          });
          setItems(orders.slice(0, 5));
        } else {
          const [orders, farmers, products, notifications] = await Promise.all([
            apiData<Row[]>("/orders"),
            apiData<Row[]>("/favorites/farmers"),
            apiData<Row[]>("/favorites/products"),
            apiData<{ unread_count: number }>("/notifications/unread-count"),
          ]);
          setStats({
            orders: orders.length,
            favorite_farmers: farmers.length,
            favorite_products: products.length,
            unread_notifications: notifications.unread_count,
          });
          setItems(orders.slice(0, 5));
        }
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load your overview.",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [role]);

  const shortcuts: [string, string][] =
    role === "admin"
      ? [
          ["Farmers", "/admin/farmers"],
          ["Customers", "/admin/customers"],
          ["Markets", "/admin/markets"],
          ["Categories", "/admin/categories"],
          ["Announcements", "/admin/announcements"],
        ]
      : role === "farmer"
        ? [
            ["Products", "/farmer/products"],
            ["Weekly inventory", "/farmer/inventory"],
            ["Markets", "/farmer/markets"],
            ["Pickup slots", "/farmer/pickup-slots"],
            ["Reviews", "/farmer/reviews"],
          ]
        : [
            ["Browse produce", "/products"],
            ["Orders", "/customer/orders"],
            ["Favorites", "/customer/favorites"],
            ["Notifications", "/customer/notifications"],
            ["Settings", "/customer/settings"],
          ];

  return (
    <ProtectedPage role={role}>
      {(user) => (
        <section className="live-overview">
          <div className="live-overview-welcome">
            <div>
              <p className="eyebrow">
                {role === "farmer"
                  ? "Farm management"
                  : role === "admin"
                    ? "Platform activity"
                    : "Customer account"}
              </p>
              <h1>
                {role === "admin"
                  ? "Good morning, admin."
                  : `Good morning, ${user.first_name}.`}
              </h1>
              <p>
                {role === "farmer"
                  ? `Here’s what’s happening at ${user.farmer_profile?.business_name || "your farm"} today.`
                  : "Here’s what’s happening in your MarketLink account today."}
              </p>
            </div>
            <div className="live-overview-actions">
              <Link className="button button-dark" href={`/${role}/orders`}>
                Manage orders
              </Link>
              {role === "farmer" && (
                <Link className="button" href="/farmer/products">
                  <span aria-hidden="true">＋</span> Add product
                </Link>
              )}
            </div>
          </div>
          <div className="live-stat-grid">
            {Object.entries(stats)
              .slice(0, 4)
              .map(([key, value], index) => (
                <article
                  className={`api-card live-stat-card live-stat-tone-${index}`}
                  key={key}
                >
                  <span className="live-stat-icon">
                    <Icon
                      name={
                        index === 0
                          ? "chart"
                          : index === 1
                            ? "package"
                            : index === 2
                              ? "clock"
                              : "users"
                      }
                      size={19}
                    />
                  </span>
                  <small>{key.replaceAll("_", " ")}</small>
                  <strong>{Number(value).toLocaleString()}</strong>
                  <span>Current total</span>
                </article>
              ))}
          </div>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="live-overview-grid">
            <section className="api-detail-block live-orders-panel">
              <div className="api-heading-row">
                <div>
                  <h2>
                    {role === "admin"
                      ? "Recent platform orders"
                      : "Recent orders"}
                  </h2>
                  <p>Your latest customer orders</p>
                </div>
                <Link href={`/${role}/orders`}>
                  View all orders <span aria-hidden="true">›</span>
                </Link>
              </div>
              {loading ? (
                <div className="live-orders-loading" role="status">
                  <span className="dashboard-empty-spinner" />
                  Loading recent orders…
                </div>
              ) : items.length ? (
                <div className="live-order-table">
                  <div className="live-order-table-head">
                    <span>Order</span>
                    <span>{role === "farmer" ? "Customer" : "Account"}</span>
                    <span>Pickup</span>
                    <span>Total</span>
                    <span>Status</span>
                  </div>
                  {items.map((row) => (
                    <article className="live-order-row" key={row.id}>
                      <strong>
                        {String(row.order_reference || `Order #${row.id}`)}
                      </strong>
                      <span>
                        {String(
                          role === "admin"
                            ? `${row.customer_first_name || "Customer"} · ${row.business_name || "Farmer"}`
                            : role === "farmer"
                              ? `${row.customer_first_name || "Customer"} ${row.customer_last_name || ""}`
                              : row.business_name || "MarketLink order",
                        )}
                      </span>
                      <span>{String(row.market_name || "Market pickup")}</span>
                      <b>₦{Number(row.total_amount || 0).toLocaleString()}</b>
                      <em>{String(row.status || "Pending")}</em>
                    </article>
                  ))}
                </div>
              ) : !error ? (
                <DashboardEmptyState
                  compact
                  icon="package"
                  title="Your orders will appear here"
                  description={
                    role === "farmer"
                      ? "Add products and weekly stock so customers can start placing orders with your farm."
                      : role === "customer"
                        ? "Browse local produce and place an order for market pickup."
                        : "New customer orders will be listed here as they arrive."
                  }
                  actionHref={
                    role === "farmer"
                      ? "/farmer/products"
                      : role === "customer"
                        ? "/products"
                        : "/admin/dashboard"
                  }
                  actionLabel={
                    role === "farmer"
                      ? "Manage products"
                      : role === "customer"
                        ? "Browse produce"
                        : "Back to overview"
                  }
                />
              ) : null}
            </section>
            <section className="api-detail-block live-shortcuts">
              <div className="api-heading-row">
                <div>
                  <h2>
                    {role === "farmer" ? "Farm at a glance" : "Quick links"}
                  </h2>
                  <p>Go straight to a workspace</p>
                </div>
              </div>
              <div className="api-card-grid">
                {shortcuts.map(([label, href]) => (
                  <Link className="api-card" href={href} key={href}>
                    <h3>{label}</h3>
                    <span>Open →</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      )}
    </ProtectedPage>
  );
}
