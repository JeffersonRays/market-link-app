"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, apiData, patchBody } from "../lib/api";
import { ProtectedPage } from "./dashboard/ProtectedPage";

type Row = Record<string, unknown> & { id: number };
type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};
type Config = {
  title: string;
  endpoint: string;
  list?: boolean;
  fields?: Field[];
  note?: string;
};

const farmerConfig: Record<string, Config> = {
  products: {
    title: "Products",
    endpoint: "/farmer/products",
    fields: [
      { name: "name", label: "Product name", required: true },
      {
        name: "category_id",
        label: "Category ID",
        type: "number",
        required: true,
      },
      { name: "unit", label: "Unit", required: true },
      { name: "description", label: "Description" },
      { name: "image_url", label: "Image URL", type: "url" },
    ],
  },
  inventory: {
    title: "Weekly inventory",
    endpoint: "/farmer/inventory",
    fields: [
      {
        name: "product_id",
        label: "Product ID",
        type: "number",
        required: true,
      },
      {
        name: "farmer_market_id",
        label: "My market membership ID",
        type: "number",
        required: true,
      },
      {
        name: "week_start_date",
        label: "Week starting",
        type: "date",
        required: true,
      },
      { name: "price", label: "Price (₦)", type: "number", required: true },
      {
        name: "stock_quantity",
        label: "Quantity",
        type: "number",
        required: true,
      },
      {
        name: "stock_status",
        label: "Status",
        options: ["available", "sold_out", "unavailable"].map((value) => ({
          value,
          label: value,
        })),
      },
      { name: "notes", label: "Notes" },
    ],
  },
  markets: {
    title: "My markets",
    endpoint: "/farmers/me/markets",
    fields: [
      { name: "market_id", label: "Market ID", type: "number", required: true },
      { name: "stall_name", label: "Stall name" },
      { name: "stall_number", label: "Stall number" },
      {
        name: "operating_days",
        label: "Operating days (comma separated)",
        required: true,
      },
      { name: "pickup_start_time", label: "Pickup starts", type: "time" },
      { name: "pickup_end_time", label: "Pickup ends", type: "time" },
    ],
  },
  "pickup-slots": {
    title: "Pickup slots",
    endpoint: "/farmer/pickup-slots",
    fields: [
      {
        name: "farmer_market_id",
        label: "Market membership ID",
        type: "number",
        required: true,
      },
      { name: "pickup_date", label: "Date", type: "date", required: true },
      { name: "start_time", label: "Starts", type: "time", required: true },
      { name: "end_time", label: "Ends", type: "time", required: true },
      { name: "capacity", label: "Order capacity", type: "number" },
    ],
  },
  "stock-templates": {
    title: "Weekly stock templates",
    endpoint: "/farmer/stock-templates",
    fields: [
      {
        name: "product_id",
        label: "Product ID",
        type: "number",
        required: true,
      },
      {
        name: "farmer_market_id",
        label: "Market membership ID",
        type: "number",
        required: true,
      },
      {
        name: "default_price",
        label: "Default price",
        type: "number",
        required: true,
      },
      { name: "default_quantity", label: "Default quantity", type: "number" },
    ],
  },
  orders: {
    title: "Orders",
    endpoint: "/orders/farmer",
    note: "Use the order actions to update the customer.",
  },
  reviews: {
    title: "Reviews",
    endpoint: "profile-reviews",
    note: "Reply to customer feedback.",
  },
};
const adminConfig: Record<string, Config> = {
  farmers: { title: "Farmers", endpoint: "/admin/farmers" },
  customers: { title: "Customers", endpoint: "/admin/customers" },
  orders: { title: "Orders", endpoint: "/admin/orders" },
  markets: {
    title: "Markets",
    endpoint: "/markets",
    fields: [
      { name: "name", label: "Market name", required: true },
      { name: "address", label: "Address", required: true },
      { name: "description", label: "Description" },
      {
        name: "operating_days",
        label: "Operating days (comma separated)",
        required: true,
      },
      { name: "open_time", label: "Opens", type: "time" },
      { name: "close_time", label: "Closes", type: "time" },
      { name: "latitude", label: "Latitude", type: "number" },
      { name: "longitude", label: "Longitude", type: "number" },
    ],
  },
  categories: {
    title: "Categories",
    endpoint: "/categories",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug", required: true },
      { name: "description", label: "Description" },
    ],
  },
  announcements: {
    title: "Announcements",
    endpoint: "/admin/announcements",
    list: false,
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "message", label: "Message", required: true },
      {
        name: "audience",
        label: "Audience",
        options: ["all", "customers", "farmers"].map((value) => ({
          value,
          label: value,
        })),
      },
      { name: "starts_at", label: "Starts at", type: "datetime-local" },
      { name: "ends_at", label: "Ends at", type: "datetime-local" },
    ],
  },
};

function buildPayload(form: FormData, fields: Field[]) {
  const result: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = form.get(field.name);
    if (raw == null || raw === "") continue;
    if (field.type === "number") result[field.name] = Number(raw);
    else if (field.name === "operating_days")
      result[field.name] = String(raw)
        .split(",")
        .map((day) => day.trim().toLowerCase())
        .filter(Boolean);
    else if ((field.name === "starts_at" || field.name === "ends_at") && typeof raw === "string") result[field.name] = raw.replace("T", " ");
    else result[field.name] = raw;
  }
  return result;
}

export function ManagementPage({
  role,
  section,
}: {
  role: "farmer" | "admin";
  section: string;
}) {
  const config = (role === "farmer" ? farmerConfig : adminConfig)[section];
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [choices, setChoices] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const endpoint = config?.endpoint || "";

  const load = useCallback(async () => {
    if (!config || config.list === false) return;
    try {
      if (endpoint === "profile-reviews") {
        const profile = await apiData<Row>("/farmers/me");
        setRows(await apiData<Row[]>(`/farmers/${profile.id}/reviews`));
      } else setRows(await apiData<Row[]>(endpoint));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load this page.",
      );
    }
  }, [config, endpoint]);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  useEffect(() => {
    async function loadChoices() {
      try {
        if (role === "farmer" && section === "products") {
          const categories = await apiData<Row[]>("/categories");
          setChoices({
            category_id: categories.map((row) => ({
              value: String(row.id),
              label: String(row.name),
            })),
          });
        }
        if (
          role === "farmer" &&
          ["inventory", "pickup-slots", "stock-templates"].includes(section)
        ) {
          const [products, markets] = await Promise.all([
            apiData<Row[]>("/farmer/products"),
            apiData<Row[]>("/farmers/me/markets"),
          ]);
          setChoices({
            product_id: products.map((row) => ({
              value: String(row.id),
              label: String(row.name),
            })),
            farmer_market_id: markets.map((row) => ({
              value: String(row.id),
              label: String(row.market_name),
            })),
          });
        }
        if (role === "farmer" && section === "markets") {
          const markets = await apiData<Row[]>("/markets?limit=100");
          setChoices({
            market_id: markets.map((row) => ({
              value: String(row.id),
              label: `${String(row.name)} · ${String(row.address)}`,
            })),
          });
        }
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load form options.",
        );
      }
    }
    void loadChoices();
  }, [role, section]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!config?.fields) return;
    const formElement = event.currentTarget;
    setBusy(true);
    setError("");
    setMessage("");
    const payload = buildPayload(
      new FormData(formElement),
      config.fields,
    );
    try {
      const path =
        role === "admin"
          ? section === "announcements"
            ? "/admin/announcements"
            : `/admin/${section}`
          : section === "markets"
            ? "/farmers/me/markets"
            : `/farmer/${section}`;
      await api(path, { method: "POST", body: JSON.stringify(payload) });
      setMessage("Saved successfully.");
      formElement.reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function update(path: string, data: unknown) {
    setError("");
    try {
      await api(path, patchBody(data));
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update.");
    }
  }

  if (!config)
    return (
      <main className="page-content">
        <div className="container">
          <h1>Page not found</h1>
        </div>
      </main>
    );
  return (
    <ProtectedPage role={role}>
      {() => (
        <main className="page-content">
          <div className="container">
            <p className="eyebrow">{role} workspace</p>
            <h1>{config.title}</h1>
            <p>{config.note}</p>
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            {message && <p role="status">{message}</p>}
            {section === "orders" && role === "farmer" && (
              <div className="api-list">
                {rows.map((row) => (
                  <article className="api-card" key={row.id}>
                    <small>
                      {String(row.order_reference)} · {String(row.status)}
                    </small>
                    <h2>
                      {String(row.customer_first_name)}{" "}
                      {String(row.customer_last_name)}
                    </h2>
                    <p>
                      {String(row.market_name)} · {String(row.pickup_date)} · ₦
                      {Number(row.total_amount).toLocaleString()}
                    </p>
                    <OrderActions order={row} onUpdate={update} />
                  </article>
                ))}
              </div>
            )}
            {role === "farmer" &&
              [
                "products",
                "inventory",
                "markets",
                "pickup-slots",
                "stock-templates",
              ].includes(section) && (
                <div className="api-list">
                  {rows.map((row) => (
                    <article className="api-card" key={row.id}>
                      <h2>
                        {String(
                          row.name ||
                            row.product_name ||
                            row.market_name ||
                            row.product_name,
                        )}
                      </h2>
                      <p>
                        {String(
                          row.category_name ||
                            row.stock_status ||
                            row.approval_status ||
                            row.pickup_date ||
                            "",
                        )}
                      </p>
                      <FarmerEditForm section={section} row={row} onSaved={load} />
                      <div className="api-actions">
                        {section === "products" && (
                          <button
                            onClick={() =>
                              update(`/farmer/products/${row.id}/status`, {
                                is_active: !row.is_active,
                              })
                            }
                          >
                            {row.is_active ? "Deactivate" : "Activate"}
                          </button>
                        )}
                        {section === "inventory" && (
                          <button
                            onClick={() =>
                              update(`/farmer/inventory/${row.id}`, {
                                stock_status:
                                  row.stock_status === "unavailable"
                                    ? "available"
                                    : "unavailable",
                              })
                            }
                          >
                            {row.stock_status === "unavailable"
                              ? "Mark available"
                              : "Mark unavailable"}
                          </button>
                        )}
                        {section === "markets" && (
                          <button
                            onClick={() =>
                              update(
                                `/farmers/me/markets/${row.id}/selling-status`,
                                { is_selling_today: !row.is_selling_today },
                              )
                            }
                          >
                            {row.is_selling_today
                              ? "Stop selling today"
                              : "Selling today"}
                          </button>
                        )}
                        {section === "pickup-slots" && (
                          <button
                            onClick={() =>
                              update(`/farmer/pickup-slots/${row.id}/status`, {
                                is_active: !row.is_active,
                              })
                            }
                          >
                            {row.is_active ? "Close slot" : "Open slot"}
                          </button>
                        )}
                        {section === "stock-templates" && (
                          <button
                            onClick={async () => {
                              try {
                                await api(`/farmer/stock-templates/${row.id}`, {
                                  method: "DELETE",
                                });
                                await load();
                              } catch (cause) {
                                setError(
                                  cause instanceof Error
                                    ? cause.message
                                    : "Could not remove template.",
                                );
                              }
                            }}
                          >
                            Archive template
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            {section === "farmers" && role === "admin" && (
              <div className="api-list">
                {rows.map((row) => (
                  <article className="api-card" key={row.id}>
                    <small>{String(row.approval_status)}</small>
                    <h2>{String(row.business_name)}</h2>
                    <p>
                      {String(row.first_name)} {String(row.last_name)} ·{" "}
                      {String(row.email)}
                    </p>
                    <div className="api-actions">
                      <button
                        onClick={() =>
                          update(`/admin/farmers/${row.id}/approval`, {
                            approval_status: "approved",
                          })
                        }
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          update(`/admin/farmers/${row.id}/approval`, {
                            approval_status: "rejected",
                          })
                        }
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          update(`/admin/farmers/${row.id}/approval`, {
                            approval_status: "suspended",
                          })
                        }
                      >
                        Suspend
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {section === "customers" && role === "admin" && (
              <div className="api-list">
                {rows.map((row) => (
                  <article className="api-card" key={row.id}>
                    <small>{String(row.account_status)}</small>
                    <h2>
                      {String(row.first_name)} {String(row.last_name)}
                    </h2>
                    <p>
                      {String(row.email)} · {String(row.phone)}
                    </p>
                    <select
                      aria-label="Account status"
                      value={String(row.account_status)}
                      onChange={(event) =>
                        update(`/admin/customers/${row.id}/status`, {
                          account_status: event.target.value,
                        })
                      }
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="deactivated">Deactivated</option>
                    </select>
                  </article>
                ))}
              </div>
            )}
            {section === "reviews" && role === "farmer" && (
              <div className="api-list">
                {rows.map((row) => (
                  <article className="api-card" key={row.id}>
                    <h2>Rating: {String(row.rating)} / 5</h2>
                    <p>{String(row.comment)}</p>
                    <ReplyForm
                      id={row.id}
                      onReply={async (id, text) => {
                        try {
                          await api(`/farmer/reviews/${id}/response`, {
                            method: "POST",
                            body: JSON.stringify({ farmer_response: text }),
                          });
                          setMessage("Reply posted.");
                        } catch (cause) {
                          setError(
                            cause instanceof Error
                              ? cause.message
                              : "Could not reply.",
                          );
                        }
                      }}
                    />
                  </article>
                ))}
              </div>
            )}
            {section === "orders" && role === "admin" && (
              <div className="api-list">
                {rows.map((row) => (
                  <article className="api-card" key={row.id}>
                    <small>
                      {String(row.order_reference)} · {String(row.status)}
                    </small>
                    <h2>
                      {String(row.customer_first_name)}{" "}
                      {String(row.customer_last_name)} ·{" "}
                      {String(row.business_name)}
                    </h2>
                    <p>
                      ₦{Number(row.total_amount).toLocaleString()} ·{" "}
                      {String(row.created_at)}
                    </p>
                  </article>
                ))}
              </div>
            )}
            {section === "markets" && role === "admin" && (
              <div className="api-list">
                {rows.map((row) => (
                  <article className="api-card" key={row.id}>
                    <h2>{String(row.name)}</h2>
                    <p>
                      {String(row.address)} · {String(row.status)}
                    </p>
                    <button
                      onClick={() =>
                        update(`/admin/markets/${row.id}`, {
                          status:
                            row.status === "active" ? "inactive" : "active",
                        })
                      }
                    >
                      Deactivate market
                    </button>
                  </article>
                ))}
              </div>
            )}
            {section === "categories" && role === "admin" && (
              <div className="api-list">
                {rows.map((row) => (
                  <article className="api-card" key={row.id}>
                    <h2>{String(row.name)}</h2>
                    <p>
                      {String(row.slug)} ·{" "}
                      {String(row.is_active ? "Active" : "Inactive")}
                    </p>
                    <button
                      onClick={() =>
                        update(`/admin/categories/${row.id}`, {
                          is_active: !row.is_active,
                        })
                      }
                    >
                      Deactivate
                    </button>
                  </article>
                ))}
              </div>
            )}
            {config.fields && (
              <form
                className="api-form"
                onSubmit={create}
              >
                <h2>Add {config.title.toLowerCase()}</h2>
                {config.fields.map((field) => {
                  const options = choices[field.name] || field.options;
                  return (
                  <label key={field.name}>
                    {field.label}
                    {options ? (
                      <select name={field.name} required={field.required}>
                        <option value="">Choose</option>
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea name={field.name} required={field.required} />
                    ) : (
                      <input
                        name={field.name}
                        type={field.type || "text"}
                        required={field.required}
                      />
                    )}
                  </label>
                  );
                })}
                <button className="button" disabled={busy}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </form>
            )}
            {rows.length === 0 && !config.fields && !error && (
              <p>No records to show yet.</p>
            )}
            <p className="api-back">
              <Link href={`/${role}/dashboard`}>← Back to dashboard</Link>
            </p>
          </div>
        </main>
      )}
    </ProtectedPage>
  );
}

function OrderActions({
  order,
  onUpdate,
}: {
  order: Row;
  onUpdate: (path: string, body: unknown) => void;
}) {
  const id = order.id;
  if (order.status === "placed")
    return (
      <div className="api-actions">
        <button onClick={() => onUpdate(`/orders/farmer/${id}/accept`, {})}>
          Accept
        </button>
        <button onClick={() => onUpdate(`/orders/farmer/${id}/decline`, {})}>
          Decline
        </button>
      </div>
    );
  if (order.status === "accepted")
    return (
      <button onClick={() => onUpdate(`/orders/farmer/${id}/ready`, {})}>
        Mark ready for pickup
      </button>
    );
  if (order.status === "ready_for_pickup") return <PickupForm id={id} />;
  return null;
}

function PickupForm({ id }: { id: number }) {
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await api(`/orders/farmer/${id}/confirm-pickup`, {
        method: "POST",
        body: JSON.stringify({ confirmation_code: form.get("code") }),
      });
      window.location.reload();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not confirm pickup.",
      );
    }
  }
  return (
    <form onSubmit={submit} className="api-inline-form">
      <label>
        Pickup code
        <input name="code" required />
      </label>
      <button>Confirm pickup</button>
      {error && <small role="alert">{error}</small>}
    </form>
  );
}

function ReplyForm({
  id,
  onReply,
}: {
  id: number;
  onReply: (id: number, text: string) => void;
}) {
  return (
    <form
      className="api-inline-form"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const text = String(form.get("reply") || "");
        if (text.trim()) onReply(id, text);
      }}
    >
      <label>
        Reply
        <textarea name="reply" required maxLength={5000} />
      </label>
      <button>Send reply</button>
    </form>
  );
}

function FarmerEditForm({
  section,
  row,
  onSaved,
}: {
  section: string;
  row: Row;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");
  const fields: Field[] =
    section === "products"
      ? [
          { name: "name", label: "Name" },
          { name: "unit", label: "Unit" },
          { name: "description", label: "Description" },
        ]
      : section === "inventory"
        ? [
            { name: "price", label: "Price", type: "number" },
            { name: "stock_quantity", label: "Quantity", type: "number" },
            {
              name: "stock_status",
              label: "Stock status",
              options: ["available", "sold_out", "unavailable"].map(
                (value) => ({ value, label: value }),
              ),
            },
            { name: "notes", label: "Notes" },
          ]
        : section === "markets"
          ? [
              { name: "stall_name", label: "Stall name" },
              { name: "stall_number", label: "Stall number" },
              { name: "operating_days", label: "Operating days" },
            ]
          : section === "pickup-slots"
            ? [
                { name: "pickup_date", label: "Date", type: "date" },
                { name: "start_time", label: "Starts", type: "time" },
                { name: "end_time", label: "Ends", type: "time" },
                { name: "capacity", label: "Capacity", type: "number" },
              ]
            : [
                { name: "default_price", label: "Default price", type: "number" },
                {
                  name: "default_quantity",
                  label: "Default quantity",
                  type: "number",
                },
              ];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {};
    for (const field of fields) {
      const value = form.get(field.name);
      if (value == null || value === "") continue;
      body[field.name] =
        field.type === "number"
          ? Number(value)
          : field.name === "operating_days"
            ? String(value)
                .split(",")
                .map((day) => day.trim().toLowerCase())
                .filter(Boolean)
            : value;
    }
    try {
      const path =
        section === "markets"
          ? `/farmers/me/markets/${row.id}`
          : `/farmer/${section}/${row.id}`;
      await api(path, patchBody(body));
      setError("");
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save changes.");
    }
  }

  return (
    <form className="api-inline-form" onSubmit={submit}>
      {fields.map((field) => (
        <label key={field.name}>
          {field.label}
          {field.options ? (
            <select name={field.name} defaultValue={String(row[field.name] || "")}>
              {field.options.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type || "text"}
              defaultValue={
                field.name === "operating_days"
                  ? String(row[field.name] || "").replaceAll(",", ", ")
                  : String(row[field.name] ?? "")
              }
            />
          )}
        </label>
      ))}
      <button>Save changes</button>
      {error && <small role="alert">{error}</small>}
    </form>
  );
}
