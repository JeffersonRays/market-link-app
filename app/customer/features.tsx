"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, apiData } from "../../lib/api";
import { ProtectedPage } from "../dashboard/ProtectedPage";

type Row = Record<string, unknown> & { id: number };
type Stock = Row & {
  product_id: number;
  product_name: string;
  unit: string;
  business_name: string;
  market_name: string;
  price: number;
  available_quantity: number;
  farmer_market_id: number;
  pickup_slot_id: number | null;
  pickup_date: string | null;
  pickup_start_time: string | null;
  pickup_end_time: string | null;
};

function Shell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <ProtectedPage role="customer">
      {(user) => (
        <main className="page-content">
          <div className="container">
            <p className="eyebrow">Customer workspace · {user.first_name}</p>
            <h1>{title}</h1>
            {children}
          </div>
        </main>
      )}
    </ProtectedPage>
  );
}

export function CheckoutPage() {
  const search = useSearchParams();
  const inventoryId = Number(search.get("inventory"));
  const [item, setItem] = useState<Stock | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (!inventoryId) return;
    apiData<Stock>(`/inventory/${inventoryId}`)
      .then((stock) => {
        setItem(stock);
        if (!stock.pickup_slot_id)
          setError("No pickup window is currently available for this stock.");
      })
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : "Could not load checkout.",
        ),
      );
  }, [inventoryId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!item?.pickup_slot_id) return;
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const order = await apiData<Row>("/orders", {
        method: "POST",
        body: JSON.stringify({
          pickup_slot_id: item.pickup_slot_id,
          farmer_market_id: item.farmer_market_id,
          customer_notes: form.get("notes") || null,
          items: [{ inventory_id: item.id, quantity: qty }],
        }),
      });
      setMessage(
        `Order placed. Your pickup code is ${String(order.pickup_confirmation_code)}.`,
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not place this order.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell title="Reserve for pickup">
      {message ? (
        <section className="api-card">
          <h2>Order confirmed</h2>
          <p>{message}</p>
          <Link href="/customer/orders" className="button">
            View my orders
          </Link>
        </section>
      ) : (
        <>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          {item && (
            <form className="api-form" onSubmit={submit}>
              <h2>{item.product_name}</h2>
              <p>
                {item.business_name} · {item.market_name}
              </p>
              <p>
                ₦{Number(item.price).toLocaleString()} / {item.unit}
              </p>
              {item.pickup_slot_id && (
                <p>
                  Pickup:{" "}
                  <strong>
                    {String(item.pickup_date)} ·{" "}
                    {String(item.pickup_start_time).slice(0, 5)}–
                    {String(item.pickup_end_time).slice(0, 5)}
                  </strong>
                </p>
              )}
              <label>
                Quantity
                <input
                  type="number"
                  min={1}
                  max={Number(item.available_quantity)}
                  value={qty}
                  onChange={(event) => setQty(Number(event.target.value))}
                  required
                />
              </label>
              <label>
                Note for the farmer
                <textarea name="notes" maxLength={500} />
              </label>
              <p>
                Total:{" "}
                <strong>₦{(Number(item.price) * qty).toLocaleString()}</strong>
              </p>
              <button
                className="button"
                disabled={busy || !item.pickup_slot_id}
              >
                {busy ? "Placing order…" : "Confirm reservation"}
              </button>
            </form>
          )}
        </>
      )}
    </Shell>
  );
}

export function OrdersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    apiData<Row[]>("/orders")
      .then(setRows)
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : "Could not load orders.",
        ),
      );
  }, []);
  async function cancel(id: number) {
    try {
      await api("/orders/" + id + "/cancel", { method: "POST" });
      setRows((current) =>
        current.map((row) =>
          row.id === id ? { ...row, status: "cancelled" } : row,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not cancel order.",
      );
    }
  }
  return (
    <Shell title="My orders">
      {error && <p role="alert">{error}</p>}
      <div className="api-list">
        {rows.map((order) => (
          <article className="api-card" key={order.id}>
            <small>
              {String(order.order_reference)} · {String(order.created_at)}
            </small>
            <h2>{String(order.business_name)}</h2>
            <p>
              {String(order.market_name)} · {String(order.status)}
            </p>
            <p>₦{Number(order.total_amount).toLocaleString()}</p>
            <div className="api-actions">
              <Link href={`/customer/orders/${order.id}`} className="button">
                Order details
              </Link>
              {["placed", "accepted"].includes(String(order.status)) && (
                <button
                  className="button button-outline"
                  onClick={() => cancel(order.id)}
                >
                  Cancel order
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}

export function OrderDetailPage({ id }: { id: string }) {
  const [order, setOrder] = useState<Row | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiData<Row>(`/orders/${id}`)
      .then(setOrder)
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : "Could not load order.",
        ),
      );
  }, [id]);
  return (
    <Shell title="Order details">
      {error && <p role="alert">{error}</p>}
      {order && (
        <article className="api-card">
          <h2>
            {String(order.order_reference)} · {String(order.status)}
          </h2>
          <p>
            {String(order.market_name)} · {String(order.pickup_date)}{" "}
            {String(order.start_time)}
          </p>
          <p>
            Pickup code:{" "}
            <strong>{String(order.pickup_confirmation_code)}</strong>
          </p>
          <p>Total ₦{Number(order.total_amount).toLocaleString()}</p>
          <ul>
            {((order.items as Row[]) || []).map((item) => (
              <li key={item.id}>
                {String(item.product_name_snapshot)} × {String(item.quantity)}
              </li>
            ))}
          </ul>
          {["placed", "accepted"].includes(String(order.status)) && (
            <OrderNotes
              orderId={Number(id)}
              initial={String(order.customer_notes || "")}
            />
          )}{" "}
          {order.status === "completed" && <ReviewForm orderId={Number(id)} />}
        </article>
      )}
    </Shell>
  );
}

function OrderNotes({
  orderId,
  initial,
}: {
  orderId: number;
  initial: string;
}) {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api(`/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ customer_notes: form.get("notes") || null }),
      });
      setMessage("Order note updated.");
    } catch (cause) {
      setMessage(
        cause instanceof Error ? cause.message : "Could not update the order.",
      );
    }
  }
  return (
    <form className="api-form" onSubmit={submit}>
      <h3>Update pickup note</h3>
      <label>
        Note for the farmer
        <textarea name="notes" defaultValue={initial} maxLength={500} />
      </label>
      <button className="button">Save note</button>
      <p>{message}</p>
    </form>
  );
}

function ReviewForm({ orderId }: { orderId: number }) {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api("/reviews", {
        method: "POST",
        body: JSON.stringify({
          order_id: orderId,
          review_type: "farmer",
          rating: Number(form.get("rating")),
          comment: form.get("comment"),
        }),
      });
      setMessage("Thanks for your review.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not submit review.",
      );
    }
  }
  return (
    <form className="api-form" onSubmit={submit}>
      <h3>Review this farmer</h3>
      <label>
        Rating
        <select name="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </label>
      <label>
        Comment
        <textarea name="comment" maxLength={5000} />
      </label>
      <button className="button">Submit review</button>
      <p>{message}</p>
    </form>
  );
}

export function FavoritesPage() {
  const [farmers, setFarmers] = useState<Row[]>([]);
  const [products, setProducts] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const reload = () =>
    Promise.all([
      apiData<Row[]>("/favorites/farmers"),
      apiData<Row[]>("/favorites/products"),
    ])
      .then(([f, p]) => {
        setFarmers(f);
        setProducts(p);
      })
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : "Could not load favorites.",
        ),
      );
  useEffect(() => {
    void reload();
  }, []);
  async function remove(path: string) {
    try {
      await api(path, { method: "DELETE" });
      await reload();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not remove favorite.",
      );
    }
  }
  return (
    <Shell title="Favorites">
      {error && <p role="alert">{error}</p>}
      <h2>Farmers</h2>
      <div className="api-card-grid">
        {farmers.map((row) => (
          <article className="api-card" key={row.id}>
            <h3>{String(row.business_name)}</h3>
            <button onClick={() => remove(`/favorites/farmers/${row.id}`)}>
              Remove
            </button>
          </article>
        ))}
      </div>
      <h2>Products</h2>
      <div className="api-card-grid">
        {products.map((row) => (
          <article className="api-card" key={row.id}>
            <h3>{String(row.name)}</h3>
            <button onClick={() => remove(`/favorites/products/${row.id}`)}>
              Remove
            </button>
          </article>
        ))}
      </div>
    </Shell>
  );
}

export function NotificationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const reload = () =>
    apiData<Row[]>("/notifications")
      .then(setRows)
      .catch((cause) =>
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load notifications.",
        ),
      );
  useEffect(() => {
    void reload();
  }, []);
  async function action(path: string) {
    try {
      await api(path, { method: "PATCH" });
      await reload();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not update notifications.",
      );
    }
  }
  return (
    <Shell title="Notifications">
      {error && <p role="alert">{error}</p>}
      <button
        className="button"
        onClick={() => action("/notifications/read-all")}
      >
        Mark all as read
      </button>
      <div className="api-list">
        {rows.map((row) => (
          <article className="api-card" key={row.id}>
            <small>
              {String(row.created_at)} · {row.is_read ? "Read" : "Unread"}
            </small>
            <h2>{String(row.title)}</h2>
            <p>{String(row.message)}</p>
            {!row.is_read && (
              <button onClick={() => action(`/notifications/${row.id}/read`)}>
                Mark read
              </button>
            )}
          </article>
        ))}
      </div>
    </Shell>
  );
}
