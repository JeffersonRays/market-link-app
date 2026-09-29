"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api, apiData, jsonBody, patchBody } from "../lib/api";
import { ProtectedPage } from "./dashboard/ProtectedPage";
import LocationPicker from "./map/LocationPicker";
import { DashboardEmptyState } from "./dashboard/EmptyState";

type Row = Record<string, unknown> & { id: number };
type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  latitudeName?: string;
  longitudeName?: string;
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
        label: "Category",
        type: "select",
        required: true,
      },
      { name: "unit", label: "Unit", required: true },
      { name: "description", label: "Description" },
      { name: "image", label: "Product photo", type: "file" },
    ],
  },
  inventory: {
    title: "Stock and pickup",
    endpoint: "/farmer/inventory",
    note: "Add stock and a pickup date together. Leave the times blank to use this market’s saved pickup hours, or enter a different window. MarketLink opens the pickup time automatically.",
    fields: [
      {
        name: "product_id",
        label: "Product",
        type: "select",
        required: true,
      },
      {
        name: "farmer_market_id",
        label: "Market",
        type: "select",
        required: true,
      },
      {
        name: "pickup_date",
        label: "Pickup date",
        type: "date",
        required: true,
      },
      {
        name: "start_time",
        label: "Pickup starts (optional override)",
        type: "time",
      },
      {
        name: "end_time",
        label: "Pickup ends (optional override)",
        type: "time",
      },
      { name: "price", label: "Price (₦)", type: "number", required: true },
      {
        name: "stock_quantity",
        label: "Quantity",
        type: "number",
        required: true,
      },
      { name: "notes", label: "Notes" },
    ],
  },
  markets: {
    title: "My markets",
    endpoint: "/farmers/me/markets",
    fields: [
      { name: "market_id", label: "Market", type: "select", required: true },
      { name: "stall_name", label: "Stall name" },
      { name: "stall_number", label: "Stall number" },
      { name: "stall_description", label: "Stall details", type: "textarea" },
      {
        name: "operating_days",
        label: "Operating days",
        type: "days",
        required: true,
      },
      { name: "pickup_start_time", label: "Pickup starts", type: "time" },
      { name: "pickup_end_time", label: "Pickup ends", type: "time" },
      {
        name: "stall_location",
        label: "Stall location",
        type: "location",
        latitudeName: "stall_latitude",
        longitudeName: "stall_longitude",
      },
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
      { name: "image", label: "Market profile image (optional)", type: "file" },
      { name: "address", label: "Address", required: true },
      { name: "description", label: "Description" },
      {
        name: "operating_days",
        label: "Operating days (comma separated)",
        required: true,
      },
      { name: "open_time", label: "Opens", type: "time" },
      { name: "close_time", label: "Closes", type: "time" },
      {
        name: "market_location",
        label: "Market location",
        type: "location",
        latitudeName: "latitude",
        longitudeName: "longitude",
      },
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
    if (field.type === "file") continue;
    if (field.type === "location") {
      const latitude = form.get(field.latitudeName || "");
      const longitude = form.get(field.longitudeName || "");
      if (
        latitude != null &&
        latitude !== "" &&
        longitude != null &&
        longitude !== ""
      ) {
        result[field.latitudeName!] = Number(latitude);
        result[field.longitudeName!] = Number(longitude);
      }
      continue;
    }
    if (field.type === "days") {
      result[field.name] = form
        .getAll(field.name)
        .map((day) => String(day).toLowerCase());
      continue;
    }
    const raw = form.get(field.name);
    if (raw == null || raw === "") continue;
    if (field.type === "number") result[field.name] = Number(raw);
    else if (field.name === "operating_days")
      result[field.name] = String(raw)
        .split(",")
        .map((day) => day.trim().toLowerCase())
        .filter(Boolean);
    else if (
      (field.name === "starts_at" || field.name === "ends_at") &&
      typeof raw === "string"
    )
      result[field.name] = raw.replace("T", " ");
    else result[field.name] = raw;
  }
  return result;
}

function managementEmptyState(
  role: "farmer" | "admin",
  section: string,
  hasForm: boolean,
) {
  if (hasForm) {
    const label =
      section === "markets"
        ? "market"
        : section === "pickup-slots"
          ? "pickup slot"
          : section === "stock-templates"
            ? "stock template"
            : section === "inventory"
              ? "inventory record"
              : section === "categories"
                ? "category"
                : "market";
    return {
      title: `Your ${label === "category" ? "categories" : label === "inventory record" ? "weekly inventory" : `${label}s`} will appear here`,
      description: `Add your first ${label} using the form below. Your saved details will stay together in this workspace.`,
      actionHref: "#management-form",
      actionLabel: `Add ${label}`,
      icon:
        section === "markets"
          ? "storefront"
          : section === "categories"
            ? "leaf"
            : "calendar",
    };
  }
  if (section === "orders")
    return {
      title:
        role === "farmer"
          ? "Your first order is still ahead"
          : "No orders have arrived yet",
      description:
        role === "farmer"
          ? "When a customer orders from your farm, you’ll find the order and pickup details here."
          : "New customer orders will appear here as soon as they are placed.",
      actionHref: role === "farmer" ? "/farmer/products" : "/admin/dashboard",
      actionLabel: role === "farmer" ? "Manage products" : "Back to overview",
      icon: "package",
    };
  if (section === "reviews")
    return {
      title: "Your customer feedback will show here",
      description:
        "After customers review an order, you’ll be able to read and reply to their feedback here.",
      actionHref: "/farmer/profile",
      actionLabel: "Update farm profile",
      icon: "star",
    };
  if (section === "farmers")
    return {
      title: "No farmer applications yet",
      description: "New farmer applications will appear here for your review.",
      actionHref: "/admin/dashboard",
      actionLabel: "Back to overview",
      icon: "users",
    };
  if (section === "customers")
    return {
      title: "No customer accounts yet",
      description:
        "Customer accounts will appear here as people join MarketLink.",
      actionHref: "/admin/dashboard",
      actionLabel: "Back to overview",
      icon: "users",
    };
  return {
    title: "Nothing to show yet",
    description:
      "New activity and records will appear here when they are available.",
    actionHref: `/${role}/dashboard`,
    actionLabel: "Back to dashboard",
    icon: "chart",
  };
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
  const [loading, setLoading] = useState(true);
  const [choices, setChoices] = useState<
    Record<string, { value: string; label: string }[]>
  >({});
  const endpoint = config?.endpoint || "";

  const load = useCallback(async () => {
    if (!config || config.list === false) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (endpoint === "profile-reviews") {
        const profile = await apiData<Row>("/farmers/me");
        setRows(await apiData<Row[]>(`/farmers/${profile.id}/reviews`));
      } else setRows(await apiData<Row[]>(endpoint));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load this page.",
      );
    } finally {
      setLoading(false);
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
    const payload = buildPayload(new FormData(formElement), config.fields);
    if (role === "farmer" && section === "inventory") {
      const pickupDate = String(payload.pickup_date || "");
      if (pickupDate) {
        const monday = new Date(`${pickupDate}T00:00:00Z`);
        const weekday = (monday.getUTCDay() + 6) % 7;
        monday.setUTCDate(monday.getUTCDate() - weekday);
        payload.week_start_date = monday.toISOString().slice(0, 10);
      }
    }
    const missingDays = config.fields.some(
      (field) =>
        field.type === "days" &&
        field.required &&
        !(payload[field.name] as string[] | undefined)?.length,
    );
    if (missingDays) {
      setError("Choose at least one operating day.");
      setBusy(false);
      return;
    }
    try {
      const path =
        role === "admin"
          ? section === "announcements"
            ? "/admin/announcements"
            : `/admin/${section}`
          : section === "markets"
            ? "/farmers/me/markets"
            : `/farmer/${section}`;
      const hasFileField = config.fields.some((field) => field.type === "file");
      const multipart = hasFileField ? new FormData(formElement) : null;
      if (multipart) {
        const image = multipart.get("image");
        if (!(image instanceof File) || !image.name) multipart.delete("image");
      }
      await api(path, {
        method: "POST",
        body: multipart || JSON.stringify(payload),
      });
      setMessage("Saved successfully.");
      formElement.reset();
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function update(
    path: string,
    data: unknown,
    method: "PATCH" | "POST" = "PATCH",
  ) {
    setError("");
    try {
      await api(path, method === "POST" ? jsonBody(data) : patchBody(data));
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
            {section === "products" && role === "farmer" && (
              <FarmerProducts rows={rows} onUpdate={update} onSaved={load} />
            )}
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
              section !== "products" &&
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
                            "",
                        )}
                        {section === "inventory" &&
                          typeof row.pickup_date === "string" && (
                            <>
                              {" "}
                              · Pickup {String(row.pickup_date)}{" "}
                              {String(row.pickup_start_time || "").slice(0, 5)}–
                              {String(row.pickup_end_time || "").slice(0, 5)}
                            </>
                          )}
                      </p>
                      <FarmerEditForm
                        section={section}
                        row={row}
                        onSaved={load}
                      />
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
                    <AdminMarketEditForm row={row} onSaved={load} />
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
            {!loading &&
              rows.length === 0 &&
              !error &&
              config.list !== false &&
              section !== "products" && (
                <DashboardEmptyState
                  {...managementEmptyState(
                    role,
                    section,
                    Boolean(config.fields),
                  )}
                />
              )}
            {config.fields && (
              <form id="management-form" className="api-form" onSubmit={create}>
                <h2>Add {config.title.toLowerCase()}</h2>
                {config.fields.map((field) => {
                  const options = choices[field.name] || field.options;
                  if (field.type === "location")
                    return (
                      <LocationPicker
                        key={field.name}
                        label={field.label}
                        latitudeName={field.latitudeName!}
                        longitudeName={field.longitudeName!}
                      />
                    );
                  if (field.type === "days")
                    return (
                      <fieldset className="api-days-field" key={field.name}>
                        <legend>{field.label}</legend>
                        <div className="api-day-options">
                          {[
                            "monday",
                            "tuesday",
                            "wednesday",
                            "thursday",
                            "friday",
                            "saturday",
                            "sunday",
                          ].map((day) => (
                            <label className="api-day-option" key={day}>
                              <input
                                type="checkbox"
                                name={field.name}
                                value={day}
                              />
                              {day.slice(0, 3)}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    );
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
                          step={field.type === "number" ? "any" : undefined}
                          accept={
                            field.type === "file"
                              ? "image/jpeg,image/png,image/webp,image/gif"
                              : undefined
                          }
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
            <p
              className={`api-back ${rows.length === 0 && !loading && !error ? "api-back-empty" : ""}`}
            >
              <Link href={`/${role}/dashboard`}>← Back to dashboard</Link>
            </p>
          </div>
        </main>
      )}
    </ProtectedPage>
  );
}

function FarmerProducts({
  rows,
  onUpdate,
  onSaved,
}: {
  rows: Row[];
  onUpdate: (path: string, data: unknown) => void;
  onSaved: () => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [productCategories, setProductCategories] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    apiData<Row[]>("/categories")
      .then((items) =>
        setProductCategories(
          items.map((item) => ({
            value: String(item.id),
            label: String(item.name),
          })),
        ),
      )
      .catch(() => undefined);
  }, []);
  const categories = [
    ...new Set(rows.map((row) => String(row.category_name || "Other"))),
  ];
  const filtered = rows.filter((row) => {
    const matchesText = `${row.name || ""} ${row.category_name || ""}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return (
      matchesText &&
      (category === "all" || String(row.category_name || "Other") === category)
    );
  });
  const active = rows.filter((row) => Boolean(row.is_active)).length;
  const inactive = rows.length - active;

  return (
    <section
      className="farmer-products-workspace"
      aria-label="Product catalogue"
    >
      <div className="farmer-product-summary">
        <article>
          <span>Products in catalogue</span>
          <strong>{rows.length}</strong>
          <small>Across your farm catalogue</small>
        </article>
        <article>
          <span>Active listings</span>
          <strong>{active}</strong>
          <small>Visible to customers</small>
        </article>
        <article>
          <span>Paused listings</span>
          <strong>{inactive}</strong>
          <small>Can be activated any time</small>
        </article>
      </div>
      <div className="farmer-product-panel">
        <div className="farmer-product-toolbar">
          <div>
            <h2>Your products</h2>
            <p>Keep names, categories, units, and product photos up to date.</p>
          </div>
          <div className="farmer-product-filters">
            <label className="farmer-product-search">
              <span className="sr-only">Search products</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your catalogue"
              />
            </label>
            <label>
              <span className="sr-only">Filter by category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {categories.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {filtered.length ? (
          <div className="farmer-product-table-wrap">
            <table className="farmer-product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Listing</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="farmer-product-identity">
                        {row.image_url ? (
                          <img src={String(row.image_url)} alt="" />
                        ) : (
                          <span
                            className="farmer-product-placeholder"
                            aria-hidden="true"
                          >
                            ✿
                          </span>
                        )}
                        <div>
                          <strong>
                            {String(row.name || "Unnamed product")}
                          </strong>
                          <small>
                            {String(row.description || "Farm fresh produce")}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{String(row.category_name || "Uncategorised")}</td>
                    <td>{String(row.unit || "—")}</td>
                    <td>
                      <span
                        className={`farmer-product-status ${row.is_active ? "is-active" : "is-paused"}`}
                      >
                        {row.is_active ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td>
                      <div className="farmer-product-manage">
                        <FarmerEditForm
                          section="products"
                          row={row}
                          onSaved={onSaved}
                          categories={productCategories}
                        />
                        <button
                          className="farmer-product-toggle"
                          onClick={() =>
                            onUpdate(`/farmer/products/${row.id}/status`, {
                              is_active: !row.is_active,
                            })
                          }
                        >
                          {row.is_active ? "Pause" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="farmer-product-empty">
            <strong>
              {rows.length
                ? "No matching products"
                : "Your catalogue is ready for its first product"}
            </strong>
            <span>
              {rows.length
                ? "Try another product name or category."
                : "Use the product form below to add a listing with its API-backed details."}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function OrderActions({
  order,
  onUpdate,
}: {
  order: Row;
  onUpdate: (path: string, body: unknown, method?: "PATCH" | "POST") => void;
}) {
  const id = order.id;
  if (order.status === "placed")
    return (
      <div className="api-actions">
        <button
          onClick={() => onUpdate(`/orders/farmer/${id}/accept`, {}, "POST")}
        >
          Accept
        </button>
        <button
          onClick={() => onUpdate(`/orders/farmer/${id}/decline`, {}, "POST")}
        >
          Decline
        </button>
      </div>
    );
  if (order.status === "accepted")
    return (
      <button
        onClick={() => onUpdate(`/orders/farmer/${id}/ready`, {}, "POST")}
      >
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
  categories = [],
}: {
  section: string;
  row: Row;
  onSaved: () => void;
  categories?: { value: string; label: string }[];
}) {
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const fields: Field[] =
    section === "products"
      ? [
          { name: "name", label: "Name" },
          { name: "category_id", label: "Category", options: categories },
          { name: "unit", label: "Unit" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "image", label: "Replace product image", type: "file" },
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
              { name: "stall_description", label: "Stall details" },
              { name: "operating_days", label: "Operating days", type: "days" },
              {
                name: "pickup_start_time",
                label: "Pickup starts",
                type: "time",
              },
              { name: "pickup_end_time", label: "Pickup ends", type: "time" },
              {
                name: "stall_location",
                label: "Stall location",
                type: "location",
                latitudeName: "stall_latitude",
                longitudeName: "stall_longitude",
              },
            ]
          : section === "pickup-slots"
            ? [
                { name: "pickup_date", label: "Date", type: "date" },
                { name: "start_time", label: "Starts", type: "time" },
                { name: "end_time", label: "Ends", type: "time" },
                { name: "capacity", label: "Capacity", type: "number" },
              ]
            : [
                {
                  name: "default_price",
                  label: "Default price",
                  type: "number",
                },
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
      if (field.type === "file") continue;
      if (field.type === "location") {
        const latitude = form.get(field.latitudeName || "");
        const longitude = form.get(field.longitudeName || "");
        if (
          latitude != null &&
          latitude !== "" &&
          longitude != null &&
          longitude !== ""
        ) {
          body[field.latitudeName!] = Number(latitude);
          body[field.longitudeName!] = Number(longitude);
        }
        continue;
      }
      if (field.type === "days") {
        body[field.name] = form
          .getAll(field.name)
          .map((day) => String(day).toLowerCase());
        continue;
      }
      const value = form.get(field.name);
      if (value == null || value === "") continue;
      body[field.name] = field.type === "number" ? Number(value) : value;
    }
    try {
      const path =
        section === "markets"
          ? `/farmers/me/markets/${row.id}`
          : `/farmer/${section}/${row.id}`;
      const image = form.get("image");
      const multipart = image instanceof File && image.name ? form : null;
      await api(
        path,
        multipart ? { method: "PATCH", body: multipart } : patchBody(body),
      );
      setError("");
      onSaved();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save changes.",
      );
    }
  }

  const form = (
    <form className="api-inline-form" onSubmit={submit}>
      {fields.map((field) =>
        field.type === "location" ? (
          <LocationPicker
            key={field.name}
            label={field.label}
            latitudeName={field.latitudeName!}
            longitudeName={field.longitudeName!}
            initialLatitude={row[field.latitudeName!]}
            initialLongitude={row[field.longitudeName!]}
          />
        ) : field.type === "days" ? (
          <fieldset className="api-days-field" key={field.name}>
            <legend>{field.label}</legend>
            <div className="api-day-options">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <label className="api-day-option" key={day}>
                  <input
                    type="checkbox"
                    name={field.name}
                    value={day}
                    defaultChecked={String(row[field.name] || "")
                      .split(",")
                      .includes(day)}
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <label key={field.name}>
            {field.label}
            {field.options ? (
              <select
                name={field.name}
                defaultValue={String(row[field.name] || "")}
              >
                {field.options.map((option) => (
                  <option value={option.value} key={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                defaultValue={String(row[field.name] ?? "")}
              />
            ) : (
              <input
                name={field.name}
                type={field.type || "text"}
                step={field.type === "number" ? "any" : undefined}
                accept={
                  field.type === "file"
                    ? "image/jpeg,image/png,image/webp,image/gif"
                    : undefined
                }
                defaultValue={
                  field.type === "file"
                    ? undefined
                    : field.name === "operating_days"
                      ? String(row[field.name] || "").replaceAll(",", ", ")
                      : String(row[field.name] ?? "")
                }
              />
            )}
          </label>
        ),
      )}
      <button>Save changes</button>
      {error && <small role="alert">{error}</small>}
    </form>
  );
  if (section === "products")
    return (
      <details className="farmer-product-edit">
        <summary>Edit details</summary>
        {form}
      </details>
    );
  if (section === "markets")
    return (
      <details
        className="farmer-product-edit"
        onToggle={(event) => setEditOpen(event.currentTarget.open)}
      >
        <summary>Edit stall &amp; location</summary>
        {editOpen && form}
      </details>
    );
  return form;
}

function AdminMarketEditForm({
  row,
  onSaved,
}: {
  row: Row;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const body: Record<string, unknown> = {
      name: form.get("name"),
      address: form.get("address"),
    };
    const latitude = form.get("latitude");
    const longitude = form.get("longitude");
    if (latitude && longitude) {
      body.latitude = Number(latitude);
      body.longitude = Number(longitude);
    }
    try {
      const image = form.get("image");
      if (image instanceof File && image.name) {
        const multipart = new FormData();
        Object.entries(body).forEach(([key, value]) =>
          multipart.set(key, String(value)),
        );
        multipart.set("image", image);
        await api(`/admin/markets/${row.id}`, {
          method: "PATCH",
          body: multipart,
        });
      } else {
        await api(`/admin/markets/${row.id}`, patchBody(body));
      }
      onSaved();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not update the market.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <details
      className="admin-market-edit"
      onToggle={(event) => setEditOpen(event.currentTarget.open)}
    >
      <summary>Edit market details or pin</summary>
      {editOpen && (
        <form className="api-inline-form" onSubmit={submit}>
          <label>
            Market name
            <input name="name" required defaultValue={String(row.name || "")} />
          </label>
          <label>
            Market address
            <input
              name="address"
              required
              defaultValue={String(row.address || "")}
            />
          </label>
          <label>
            Market profile image (optional)
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
          </label>
          <LocationPicker
            label="Market location"
            latitudeName="latitude"
            longitudeName="longitude"
            initialLatitude={row.latitude}
            initialLongitude={row.longitude}
          />
          <button disabled={busy}>{busy ? "Saving…" : "Save market"}</button>
          {error && <small role="alert">{error}</small>}
        </form>
      )}
    </details>
  );
}
