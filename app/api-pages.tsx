"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, apiData } from "../lib/api";
import { Footer, Header, PageIntro } from "./components";

type Row = Record<string, unknown> & { id: number };
type Inventory = Row & {
  product_id: number;
  product_name: string;
  unit: string;
  business_name: string;
  market_name: string;
  price: number;
  available_quantity: number;
  stock_status: string;
};

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
}: {
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        <PageIntro eyebrow="MarketLink directory" title={title} text={intro} />
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
            className="api-card"
            href={`/markets/${market.id}`}
            key={market.id}
          >
            <small>{String(market.operating_days || "Market schedule")}</small>
            <h2>{String(market.name)}</h2>
            <p>{String(market.address)}</p>
            <span className="text-link">View market →</span>
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
            className="api-card"
            href={`/farmers/${farmer.id}`}
            key={farmer.id}
          >
            <small>
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
      <div className="api-card-grid">
        {visible.map((item) => (
          <article className="api-card" key={item.id}>
            <small>
              {item.business_name} · {item.market_name}
            </small>
            <h2>{item.product_name}</h2>
            <p>
              ₦{Number(item.price).toLocaleString()} / {item.unit}
            </p>
            <p>
              {item.available_quantity} available · {item.stock_status}
            </p>
            <Link className="text-link" href={`/products/${item.product_id}`}>
              Product details →
            </Link>
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
  const name = String(record.name || record.business_name || "MarketLink");
  return (
    <PageFrame
      title={name}
      intro={String(
        record.description ||
          record.business_description ||
          record.address ||
          "Local food, direct from the people who grow and make it.",
      )}
    >
      <p className="api-detail-meta">
        {String(record.address || record.category_name || record.unit || "")}
      </p>
      {kind !== "market" && <FavoriteButton kind={kind} id={record.id} />}
      <div className="api-card-grid">
        {related.map((item) => {
          const label = String(
            item.name ||
              item.business_name ||
              item.product_name_snapshot ||
              item.comment ||
              "Details",
          );
          const href =
            kind === "market"
              ? `/farmers/${item.id}`
              : kind === "farmer"
                ? `/products/${item.id}`
                : "#reviews";
          const content = (
            <>
              <h2>{label}</h2>
              <p>
                {String(
                  item.business_description ||
                    item.category_name ||
                    item.comment ||
                    item.address ||
                    "",
                )}
              </p>
            </>
          );
          return kind === "product" ? (
            <article className="api-card" key={String(item.id)}>{content}</article>
          ) : (
            <Link className="api-card" href={href} key={String(item.id)}>{content}</Link>
          );
        })}
      </div>
      {kind === "product" && (
        <section className="api-detail-block">
          <h2>Available stock</h2>
          <InventoryForProduct productId={record.id} />
        </section>
      )}
      {kind === "farmer" && (
        <section className="api-detail-block">
          <h2>Markets</h2>
          <RelatedList endpoint={`/farmers/${record.id}/markets`} />
        </section>
      )}
      {kind === "market" && (
        <section className="api-detail-block">
          <h2>Products at this market</h2>
          <RelatedList endpoint={`/markets/${record.id}/products`} products />
        </section>
      )}
    </PageFrame>
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
  useEffect(() => {
    apiData<Inventory[]>("/inventory")
      .then((items) =>
        setRows(items.filter((item) => item.product_id === productId)),
      )
      .catch(() => setRows([]));
  }, [productId]);
  return (
    <div className="api-card-grid">
      {rows.map((item) => (
        <article className="api-card" key={item.id}>
          <h3>{item.market_name}</h3>
          <p>
            ₦{Number(item.price).toLocaleString()} / {item.unit} ·{" "}
            {item.available_quantity} available
          </p>
          <Link
            className="button"
            href={`/customer/checkout?inventory=${item.id}`}
          >
            Reserve for pickup
          </Link>
        </article>
      ))}
    </div>
  );
}
