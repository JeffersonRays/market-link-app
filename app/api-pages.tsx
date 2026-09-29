"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, apiData } from "../lib/api";
import { Footer, Header, PageIntro } from "./components";
import MarketMap from "./map/MarketMap";

type Row = Record<string, unknown> & { id: number };
type Inventory = Row & {
  product_id: number;
  product_name: string;
  unit: string;
  business_name: string;
  market_name: string;
  market_id: number;
  farmer_id: number;
  price: number;
  available_quantity: number;
  stock_status: string;
  pickup_slot_id: number | null;
  pickup_date: string | null;
  pickup_start_time: string | null;
  pickup_end_time: string | null;
  image_url?: string | null;
  profile_image_url?: string | null;
};

function ListingImage({
  src,
  alt,
  initials,
}: {
  src: unknown;
  alt: string;
  initials: string;
}) {
  return src ? (
    <div className="directory-card-image">
      <img src={String(src)} alt={alt} loading="lazy" />
    </div>
  ) : (
    <div
      className="directory-card-image directory-card-placeholder"
      aria-label={`${alt} image unavailable`}
    >
      <span>{initials}</span>
      <i aria-hidden="true">✳</i>
    </div>
  );
}

function useRows<T extends Row>(path: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    apiData<T[] | { data: T[] }>(path)
      .then((result) => setRows(Array.isArray(result) ? result : result.data))
      .catch((cause) =>
        setError(
          cause instanceof Error ? cause.message : "Could not load data.",
        ),
      );
  }, [path]);
  return { rows, error, search, setSearch };
}

function PageFrame({
  title,
  intro,
  children,
  hideIntro = false,
}: {
  title: string;
  intro: string;
  children?: React.ReactNode;
  hideIntro?: boolean;
}) {
  return (
    <>
      <Header />
      <main>
        {!hideIntro && (
          <PageIntro
            eyebrow="MarketLink directory"
            title={title}
            text={intro}
          />
        )}
        <section className="page-content">
          <div className="container">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function MarketsDirectory() {
  const { rows, error, search, setSearch } = useRows<Row>("/markets?limit=100");
  const visible = rows.filter((row) =>
    `${row.name} ${row.address}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <PageFrame
      title="Find a farmers market near you"
      intro="Explore local markets and see where farmers are selling."
    >
      <input
        className="directory-input"
        placeholder="Search markets"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <div className="api-card-grid">
        {visible.map((market) => (
          <Link
            className="api-card directory-card"
            href={`/markets/${market.id}`}
            key={market.id}
          >
            <ListingImage
              src={market.image_url}
              alt={String(market.name)}
              initials="MK"
            />
            <div className="directory-card-content">
              <small className="directory-card-kicker">
                {String(market.operating_days || "Market schedule")}
              </small>
              <h2>{String(market.name)}</h2>
              <p>{String(market.address)}</p>
              <span className="text-link">View market →</span>
            </div>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}

export function FarmersDirectory() {
  const { rows, error, search, setSearch } = useRows<Row>("/farmers?limit=100");
  const visible = rows.filter((row) =>
    `${row.business_name} ${row.first_name} ${row.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <PageFrame
      title="Meet the farmers behind your food"
      intro="Browse approved local growers, bakers, and food makers."
    >
      <input
        className="directory-input"
        placeholder="Search farmers"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <div className="api-card-grid">
        {visible.map((farmer) => (
          <Link
            className="api-card directory-card"
            href={`/farmers/${farmer.id}`}
            key={farmer.id}
          >
            <ListingImage
              src={farmer.profile_image_url}
              alt={String(farmer.business_name)}
              initials={String(farmer.business_name || "F")
                .slice(0, 2)
                .toUpperCase()}
            />
            <div className="directory-card-content">
              <small className="directory-card-kicker">
                {String(farmer.first_name || "Local farmer")}{" "}
                {String(farmer.last_name || "")}
              </small>
              <h2>{String(farmer.business_name)}</h2>
              <p>
                {String(
                  farmer.business_description ||
                    "Local produce, available for market pickup.",
                )}
              </p>
              <span className="text-link">View farmer →</span>
            </div>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}

export function ProductsDirectory() {
  const {
    rows: inventory,
    error,
    search,
    setSearch,
  } = useRows<Inventory>("/inventory");
  const visible = inventory.filter((item) =>
    `${item.product_name} ${item.business_name} ${item.market_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <PageFrame
      title="Fresh from local farmers"
      intro="Browse this week’s stock and reserve it for collection at the market."
    >
      <input
        className="directory-input"
        placeholder="Search products, farmers, or markets"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      {!error && visible.length === 0 && (
        <p>
          No stock is available yet. Farmers can list stock and a pickup time
          together from their dashboard.
        </p>
      )}
      <div className="api-card-grid">
        {visible.map((item) => (
          <article className="api-card directory-card" key={item.id}>
            <ListingImage
              src={item.image_url}
              alt={String(item.product_name)}
              initials={String(item.product_name || "P")
                .slice(0, 2)
                .toUpperCase()}
            />
            <div className="directory-card-content">
              <small className="directory-card-kicker">
                {item.business_name} · {item.market_name}
              </small>
              <h2>{item.product_name}</h2>
              <p>
                ₦{Number(item.price).toLocaleString()} / {item.unit}
              </p>
              <p>
                {item.available_quantity} available · {item.stock_status}
              </p>
              {item.pickup_slot_id ? (
                <p>
                  Pickup {String(item.pickup_date)} ·{" "}
                  {String(item.pickup_start_time).slice(0, 5)}–
                  {String(item.pickup_end_time).slice(0, 5)}
                </p>
              ) : (
                <p>No pickup window is currently available.</p>
              )}
              <Link className="text-link" href={`/products/${item.product_id}`}>
                Product details →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}

export function PublicDetail({
  kind,
  id,
}: {
  kind: "market" | "farmer" | "product";
  id: string;
}) {
  const [record, setRecord] = useState<Row | null>(null);
  const [related, setRelated] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [recordId, setRecordId] = useState<number | null>(
    Number.isInteger(Number(id)) ? Number(id) : null,
  );
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let resolvedId = recordId;
        if (resolvedId === null) {
          const collection =
            kind === "market"
              ? "/markets?limit=100"
              : kind === "farmer"
                ? "/farmers?limit=100"
                : "/products?limit=100";

          const results = await apiData<Row[] | { data: Row[] }>(collection);
          const list = Array.isArray(results) ? results : results.data;

          const slug = (value: unknown) =>
            String(value || "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
          const match = list.find(
            (item) =>
              slug(kind === "farmer" ? item.business_name : item.name) === id,
          );
          resolvedId = match?.id ?? null;
          if (resolvedId === null)
            throw new Error(
              "Could not find this listing. Browse the directory and try again.",
            );
          if (!cancelled) setRecordId(resolvedId);
        }
        const path =
          kind === "market"
            ? `/markets/${resolvedId}`
            : kind === "farmer"
              ? `/farmers/${resolvedId}`
              : `/products/${resolvedId}`;
        const data = await apiData<Row>(path);
        const list = Array.isArray(data) ? data : data;

        if (!cancelled) setRecord(data);
      } catch (cause) {
        if (!cancelled)
          setError(
            cause instanceof Error ? cause.message : "Could not load details.",
          );
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id, kind, recordId]);

  useEffect(() => {
    if (!record) return;
    const route =
      kind === "market"
        ? `/markets/${record.id}/farmers`
        : kind === "farmer"
          ? `/farmers/${record.id}/products`
          : `/products/${record.id}/reviews`;
    apiData<Row[]>(route)
      .then(setRelated)
      .catch(() => setRelated([]));
  }, [kind, record]);

  if (error)
    return (
      <PageFrame title="Could not load this page" intro={error}>
        <Link
          href={`/${kind === "product" ? "products" : `${kind}s`}`}
          className="button"
        >
          Back to browse
        </Link>
      </PageFrame>
    );
  if (!record)
    return (
      <PageFrame title="Loading…" intro="Getting the latest from MarketLink." />
    );
  const marketLocationArr =
    kind === "market"
      ? [
          {
            id: Number(record.id),
            name: String(record.name ?? ""),
            address: String(record.address ?? ""),
            latitude:
              typeof record.latitude === "string" ||
              typeof record.latitude === "number"
                ? record.latitude
                : null,
            longitude:
              typeof record.longitude === "string" ||
              typeof record.longitude === "number"
                ? record.longitude
                : null,
          },
        ]
      : [];
  const name = String(
    record.name || record.business_name || record.product_name || "MarketLink",
  );
  const image = kind === "farmer" ? record.profile_image_url : record.image_url;
  const intro = String(
    record.description ||
      record.business_description ||
      (kind === "product" ? record.category_name : "") ||
      "Fresh food and local people, all in one place.",
  );
  const kindLabel =
    kind === "market"
      ? "Local farmers market"
      : kind === "farmer"
        ? "Meet your farmer"
        : String(record.category_name || "Fresh from the farm");
  return (
    <PageFrame title={name} intro={intro} hideIntro>
      <div className={`public-detail public-detail-${kind}`}>
        <Link
          className="public-detail-back"
          href={`/${kind === "product" ? "products" : `${kind}s`}`}
        >
          <span aria-hidden="true">←</span> Back to{" "}
          {kind === "product" ? "products" : `${kind}s`}
        </Link>
        <section className="public-detail-hero">
          <div className={`public-detail-image${image ? " has-image" : ""}`}>
            {image ? (
              <img src={String(image)} alt={name} />
            ) : (
              <div className="public-detail-image-fallback">
                <span>{name.slice(0, 2).toUpperCase()}</span>
                <i aria-hidden="true">Fresh &amp; local</i>
              </div>
            )}
            <span className="public-detail-image-label">{kindLabel}</span>
          </div>
          <div className="public-detail-intro">
            <p className="public-detail-eyebrow">MarketLink · {kindLabel}</p>
            <h1>{name}</h1>
            {kind === "farmer" && (
              <p className="public-detail-byline">
                {[record.first_name, record.last_name]
                  .filter(Boolean)
                  .join(" ") || "Independent local grower"}
              </p>
            )}
            <p className="public-detail-lead">{intro}</p>
            <div className="public-detail-facts">
              {kind === "market" && (
                <>
                  <span>
                    ⌖ {String(record.address || "Address not listed")}
                  </span>
                  <span>
                    ◷ {String(record.operating_days || "Ask about market days")}
                    {record.open_time
                      ? ` · ${String(record.open_time).slice(0, 5)}`
                      : ""}
                    {record.close_time
                      ? `–${String(record.close_time).slice(0, 5)}`
                      : ""}
                  </span>
                </>
              )}
              {kind === "farmer" && (
                <>
                  <span>✦ Local food producer</span>
                  <span>
                    {related.length} listed product
                    {related.length === 1 ? "" : "s"}
                  </span>
                </>
              )}
              {kind === "product" && (
                <>
                  <span>{String(record.category_name || "Fresh produce")}</span>
                  <span>
                    Sold by {String(record.business_name || "a local farmer")}
                  </span>
                  {record.unit && <span>Per {String(record.unit)}</span>}
                </>
              )}
            </div>
            {kind === "product" && record.farmer_id != null && (
              <Link
                className="public-detail-seller"
                href={`/farmers/${record.farmer_id}`}
              >
                Visit {String(record.business_name || "farmer")}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            )}
            {kind !== "market" && <FavoriteButton kind={kind} id={record.id} />}
          </div>
        </section>

        {kind === "market" && (
          <section className="market-map-section">
            <div className="market-map-heading">
              <div>
                <p className="public-detail-eyebrow">Find your way</p>
                <h2>Market location</h2>
              </div>

              <span className="market-map-address">
                {String(record.address || "Address not available")}
              </span>
            </div>

            <div className="market-map-container">
              <MarketMap markets={marketLocationArr} />
            </div>
          </section>
        )}

        {kind === "product" ? (
          <div className="public-detail-columns">
            <section className="public-detail-section public-detail-description">
              <p className="public-detail-eyebrow">A little more</p>
              <h2>About this product</h2>
              <p>
                {String(
                  record.description ||
                    "Harvested and prepared by a local MarketLink farmer.",
                )}
              </p>
            </section>
            <section className="public-detail-section public-detail-stock">
              <p className="public-detail-eyebrow">Plan your pickup</p>
              <h2>Stock and pickup options</h2>
              <InventoryForProduct productId={record.id} />
            </section>
          </div>
        ) : kind === "farmer" ? (
          <div className="public-detail-columns">
            <section className="public-detail-section">
              <p className="public-detail-eyebrow">From this farm</p>
              <h2>Products</h2>
              <DetailCards
                items={related}
                kind="product"
                empty="This farmer has not listed products yet."
              />
            </section>
            <section className="public-detail-section">
              <p className="public-detail-eyebrow">Find them nearby</p>
              <h2>Markets &amp; pickup</h2>
              <RelatedList endpoint={`/farmers/${record.id}/markets`} />
            </section>
          </div>
        ) : (
          <section className="public-detail-section public-detail-related">
            <p className="public-detail-eyebrow">
              The people behind the stalls
            </p>
            <h2>Farmers at this market</h2>
            <DetailCards
              items={related}
              kind="farmer"
              empty="No farmers are listed at this market yet."
            />
          </section>
        )}

        {kind === "product" && (
          <section
            className="public-detail-section public-detail-reviews"
            id="reviews"
          >
            <p className="public-detail-eyebrow">Community notes</p>
            <h2>Customer reviews</h2>
            {related.length ? (
              <div className="public-review-grid">
                {related.map((review) => (
                  <article
                    className="public-review-card"
                    key={String(review.id)}
                  >
                    <span className="public-review-stars">
                      {"★".repeat(
                        Math.max(0, Math.min(5, Number(review.rating) || 0)),
                      )}
                      {"☆".repeat(
                        5 -
                          Math.max(0, Math.min(5, Number(review.rating) || 0)),
                      )}
                    </span>
                    <p>
                      {String(
                        review.comment ||
                          "A MarketLink customer shared a rating.",
                      )}
                    </p>
                    <small>Verified MarketLink customer</small>
                  </article>
                ))}
              </div>
            ) : (
              <p className="public-detail-empty">
                No reviews yet. Customers can leave a note after pickup.
              </p>
            )}
          </section>
        )}
      </div>
    </PageFrame>
  );
}

function DetailCards({
  items,
  kind,
  empty,
}: {
  items: Row[];
  kind: "farmer" | "product";
  empty: string;
}) {
  if (!items.length) return <p className="public-detail-empty">{empty}</p>;
  return (
    <div className="public-detail-card-grid">
      {items.map((item) => {
        const label = String(
          kind === "farmer"
            ? item.business_name || "Local farmer"
            : item.name || item.product_name || "Farm product",
        );
        const href =
          kind === "farmer" ? `/farmers/${item.id}` : `/products/${item.id}`;
        const image =
          kind === "farmer" ? item.profile_image_url : item.image_url;
        const description = String(
          item.business_description ||
            item.category_name ||
            item.address ||
            "Available from a local MarketLink seller.",
        );
        return (
          <Link
            className="public-detail-card"
            href={href}
            key={String(item.id)}
          >
            <div className="public-detail-card-image">
              {image ? (
                <img src={String(image)} alt={label} loading="lazy" />
              ) : (
                <span>{label.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <small>
                {kind === "farmer"
                  ? "MarketLink farmer"
                  : String(item.category_name || "Farm fresh")}
              </small>
              <h3>{label}</h3>
              <p>{description}</p>
              <span className="public-detail-card-link">
                View details <b aria-hidden="true">→</b>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function FavoriteButton({
  kind,
  id,
}: {
  kind: "farmer" | "product";
  id: number;
}) {
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const path = `/favorites/${kind === "farmer" ? "farmers" : "products"}/${id}`;
  useEffect(() => {
    apiData<Row[]>(`/favorites/${kind === "farmer" ? "farmers" : "products"}`)
      .then((rows) =>
        setSaved(
          rows.some(
            (row) => Number(kind === "farmer" ? row.id : row.id) === id,
          ),
        ),
      )
      .catch(() => {});
  }, [id, kind]);
  async function toggle() {
    setMessage("");
    try {
      await api(path, saved ? { method: "DELETE" } : { method: "POST" });
      setSaved(!saved);
    } catch (cause) {
      setMessage(
        cause instanceof Error
          ? cause.message
          : "Sign in to save this listing.",
      );
    }
  }
  return (
    <div className="api-favorite">
      <button onClick={toggle}>
        {saved ? "Remove from favorites" : `Save this ${kind}`}
      </button>
      {message && <small role="status">{message}</small>}
    </div>
  );
}

function RelatedList({
  endpoint,
  products = false,
}: {
  endpoint: string;
  products?: boolean;
}) {
  const { rows, error } = useRows<Row>(endpoint);
  return error ? (
    <p>{error}</p>
  ) : (
    <div className="api-card-grid">
      {rows.map((row) => (
        <Link
          className="api-card"
          href={products ? `/products/${row.id}` : `/markets/${row.market_id}`}
          key={row.id}
        >
          <h3>{String(row.name || row.market_name || row.business_name)}</h3>
          <p>{String(row.address || row.category_name || "")}</p>
        </Link>
      ))}
    </div>
  );
}

function InventoryForProduct({ productId }: { productId: number }) {
  const [rows, setRows] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    setError("");
    apiData<Inventory[]>("/inventory")
      .then((items) =>
        setRows(items.filter((item) => Number(item.product_id) === productId)),
      )
      .catch((cause) => {
        setRows([]);
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load availability.",
        );
      })
      .finally(() => setLoading(false));
  }, [productId]);
  return (
    <div className="api-card-grid">
      {loading && <p>Loading availability…</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && rows.length === 0 && (
        <p>
          No stock is listed for this product yet. Check back after the farmer
          adds weekly inventory.
        </p>
      )}
      {!loading &&
        !error &&
        rows.map((item) => (
          <article className="api-card" key={item.id}>
            <h3>{item.market_name}</h3>
            <p>
              ₦{Number(item.price).toLocaleString()} / {item.unit} ·{" "}
              {item.available_quantity} available
            </p>
            {item.pickup_slot_id ? (
              <>
                <p>
                  Pickup {String(item.pickup_date)} ·{" "}
                  {String(item.pickup_start_time).slice(0, 5)}–
                  {String(item.pickup_end_time).slice(0, 5)}
                </p>
                <Link
                  className="button"
                  href={`/customer/checkout?inventory=${item.id}`}
                >
                  Reserve for pickup
                </Link>
              </>
            ) : (
              <p>No pickup window is currently available for this stock.</p>
            )}
          </article>
        ))}
    </div>
  );
}
