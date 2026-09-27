"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Farmer, Market, Product, farmers, products } from "./data";
import { clearSession, roleHome } from "../lib/api";
import { useSession } from "./auth/useSession";

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    heart: (
      <path d="M20.8 8.7c0 5.2-8.8 10.3-8.8 10.3S3.2 13.9 3.2 8.7a4.5 4.5 0 0 1 8.8-1.4 4.5 4.5 0 0 1 8.8 1.4Z" />
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    star: (
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4C10 4 5 8 5 15c0 2.5 1.8 4 4 4 7 0 11-5 11-15Z" />
        <path d="M4 21c3-5 7-8 12-11" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    package: (
      <>
        <path d="m21 8-9 5-9-5 9-5 9 5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    storefront: (
      <>
        <path d="M3 10h18" />
        <path d="m5 10 1-6h12l1 6" />
        <path d="M4 10v10h16V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 3-4 3 2 5-7" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M20 13.1a2 2 0 0 0 0-2.2l-1-.6a7.9 7.9 0 0 0-.8-1.9l.3-1.1a2 2 0 0 0-1.6-1.6l-1.1.3a7.9 7.9 0 0 0-1.9-.8l-.6-1a2 2 0 0 0-2.2 0l-.6 1a7.9 7.9 0 0 0-1.9.8L7.5 5.7A2 2 0 0 0 5.9 7.3l.3 1.1a7.9 7.9 0 0 0-.8 1.9l-1 .6a2 2 0 0 0 0 2.2l1 .6a7.9 7.9 0 0 0 .8 1.9l-.3 1.1a2 2 0 0 0 1.6 1.6l1.1-.3a7.9 7.9 0 0 0 1.9.8l.6 1a2 2 0 0 0 2.2 0l.6-1a7.9 7.9 0 0 0 1.9-.8l1.1.3a2 2 0 0 0 1.6-1.6l-.3-1.1a7.9 7.9 0 0 0 .8-1.9l1-.6Z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    truck: (
      <>
        <path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" />
        <circle cx="7" cy="19" r="2" />
        <circle cx="17" cy="19" r="2" />
      </>
    ),
    filter: (
      <>
        <path d="M4 6h16M7 12h10M10 18h4" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    external: (
      <>
        <path d="M14 4h6v6" />
        <path d="M20 4 11 13" />
        <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
      </>
    ),
    "chevron-right": <path d="m9 18 6-6-6-6" />,
  };
  return (
    <svg {...common} aria-hidden="true">
      {paths[name] ?? paths.arrow}
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-mark">
        <Image src="/assets/marketlink-logo.png" alt="" width={34} height={34} />
      </span>
      <span>
        Market<span>Link</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { ready, user } = useSession();
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Logo />
        <nav className={`main-nav ${open ? "is-open" : ""}`}>
          <Link href="/markets" onClick={() => setOpen(false)}>
            Markets
          </Link>
          <Link href="/farmers" onClick={() => setOpen(false)}>
            Farmers
          </Link>
          <Link href="/products" onClick={() => setOpen(false)}>
            Products
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
        </nav>
        <div className="nav-actions">
          {ready && (user ? (
            <>
              <Link className="sign-in" href={roleHome(user.role)}>
                My workspace
              </Link>
              <button className="header-sign-out" type="button" onClick={clearSession}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="sign-in" href="/sign-in">Sign in</Link>
              <Link className="button button-small" href="/join">
                Join MarketLink <Icon name="arrow" size={16} />
              </Link>
            </>
          ))}
        </div>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Logo light />
          <p>A better way to shop local, one market at a time.</p>
          <div className="social-row">
            <span>ig</span>
            <span>fb</span>
            <span>in</span>
          </div>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <Link href="/markets">Markets</Link>
          <Link href="/farmers">Farmers</Link>
          <Link href="/products">Products</Link>
        </div>
        <div>
          <p className="footer-label">For farmers</p>
          <Link href="/join">Join MarketLink</Link>
          <Link href="/farmer/dashboard">Farmer workspace</Link>
          <Link href="/contact">Talk to us</Link>
        </div>
        <div>
          <p className="footer-label">Company</p>
          <Link href="/about">About us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/sign-in">Sign in</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2025 MarketLink</span>
        <span>Made for local food people.</span>
      </div>
    </footer>
  );
}

export function Badge({
  children,
  tone = "green",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "muted" | "orange";
  dot?: boolean;
}) {
  return (
    <span className={`badge badge-${tone}`}>
      {dot && <i />} {children}
    </span>
  );
}

export function Rating({
  value,
  reviews,
}: {
  value: number;
  reviews?: number;
}) {
  return (
    <span className="rating">
      <Icon name="star" size={14} />
      <strong>{value.toFixed(1)}</strong>
      {reviews ? <small>({reviews})</small> : null}
    </span>
  );
}

function ImageBlock({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`image-block ${className}`}
      style={{ backgroundImage: `url(${src})` }}
      role="img"
      aria-label={alt}
    />
  );
}

export function MarketCard({
  market,
  compact = false,
}: {
  market: Market;
  compact?: boolean;
}) {
  return (
    <article className={`market-card ${compact ? "market-card-compact" : ""}`}>
      <Link href={`/markets/${market.slug}`}>
        <ImageBlock
          src={market.image}
          alt={market.name}
          className="market-image"
        />
      </Link>
      <div className="card-body">
        <div className="card-topline">
          <Badge tone={market.open ? "green" : "muted"} dot>
            {market.open ? "Open today" : "Next market soon"}
          </Badge>
          <button className="icon-button" aria-label="Save market">
            <Icon name="heart" size={18} />
          </button>
        </div>
        <Link href={`/markets/${market.slug}`}>
          <h3>{market.name}</h3>
        </Link>
        <p className="meta-line">
          <Icon name="pin" size={15} />
          {market.area}
        </p>
        <div className="card-details">
          <span>
            <Icon name="clock" size={15} />
            {market.days}
          </span>
          <span>{market.farmers} farmers</span>
        </div>
        {!compact && <p className="card-description">{market.description}</p>}
        <Link className="text-link" href={`/markets/${market.slug}`}>
          View market <Icon name="arrow" size={15} />
        </Link>
      </div>
    </article>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link href={`/products/${product.slug}`}>
          <ImageBlock
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </Link>
        <button className="favorite-button" aria-label={`Save ${product.name}`}>
          <Icon name="heart" size={18} />
        </button>
        {product.sellingToday && (
          <span className="image-badge">Selling today</span>
        )}
      </div>
      <div className="product-info">
        <Link href={`/products/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-farmer">
          <Link href={`/farmers/${product.farmerSlug}`}>{product.farmer}</Link>{" "}
          <span>·</span> {product.market}
        </p>
        <div className="product-bottom">
          <div>
            <strong>{product.price}</strong>
            <span>{product.unit}</span>
          </div>
          <Badge
            tone={
              product.status === "low"
                ? "amber"
                : product.status === "sold"
                  ? "muted"
                  : "green"
            }
          >
            {product.availability}
          </Badge>
        </div>
      </div>
    </article>
  );
}

export function FarmerCard({ farmer }: { farmer: Farmer }) {
  return (
    <article className="farmer-card">
      <div className="farmer-image-wrap">
        <Link href={`/farmers/${farmer.slug}`}>
          <ImageBlock
            src={farmer.image}
            alt={farmer.name}
            className="farmer-image"
          />
        </Link>
        {farmer.sellingToday && (
          <span className="image-badge">Selling today</span>
        )}
      </div>
      <div className="farmer-info">
        <div className="farmer-heading">
          <div>
            <Link href={`/farmers/${farmer.slug}`}>
              <h3>{farmer.name}</h3>
            </Link>
            <p>{farmer.speciality}</p>
          </div>
          <span
            className="farmer-initials"
            style={{ background: farmer.accent }}
          >
            {farmer.initials}
          </span>
        </div>
        <p className="meta-line">
          <Icon name="pin" size={15} />
          {farmer.markets}
        </p>
        <div className="farmer-bottom">
          <Rating value={farmer.rating} reviews={farmer.reviews} />
          <Link className="text-link" href={`/farmers/${farmer.slug}`}>
            View farmer <Icon name="arrow" size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function MapMock({ title = "Markets around you" }: { title?: string }) {
  return (
    <div className="map-mock">
      <div className="map-grid" />
      <div className="map-road road-a" />
      <div className="map-road road-b" />
      <div className="map-road road-c" />
      <div className="map-water" />
      <span className="map-marker marker-one">
        <Icon name="leaf" size={16} />
      </span>
      <span className="map-marker marker-two">
        <Icon name="leaf" size={16} />
      </span>
      <span className="map-marker marker-three">
        <Icon name="leaf" size={16} />
      </span>
      <div className="map-card">
        <span className="mini-label">NEARBY MARKET</span>
        <strong>{title}</strong>
        <small>
          <Icon name="pin" size={14} /> 1.8 km away · Open today
        </small>
        <Link className="text-link" href="/markets/lekki-farmers-market">
          Explore market <Icon name="arrow" size={14} />
        </Link>
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: string[] }) {
  return (
    <div className="breadcrumbs">
      <Link href="/">Home</Link>
      {items.map((item) => (
        <span key={item}>
          <b>/</b>
          {item}
        </span>
      ))}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <div className="page-intro-copy">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {text && <p>{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function DashboardPlaceholder({
  type,
}: {
  type: "customer" | "farmer" | "admin";
}) {
  return (
    <main className="placeholder-page">
      <div className="placeholder-card">
        <span className="eyebrow">MarketLink {type} area</span>
        <h1>Coming together soon.</h1>
        <p>
          This private workspace is reserved for the next phase of MarketLink.
          The public discovery experience is ready to grow around it.
        </p>
        <Link className="button" href="/">
          Back to MarketLink <Icon name="arrow" size={16} />
        </Link>
      </div>
    </main>
  );
}

export function ProductShelf({
  limit = 3,
  market,
}: {
  limit?: number;
  market?: string;
}) {
  const shown = products
    .filter((product) => !market || product.market === market)
    .slice(0, limit);
  return (
    <div className="product-grid">
      {shown.map((product) => (
        <ProductCard product={product} key={product.slug} />
      ))}
    </div>
  );
}

export function FarmerShelf({ limit = 3 }: { limit?: number }) {
  return (
    <div className="farmer-grid">
      {farmers.slice(0, limit).map((farmer) => (
        <FarmerCard farmer={farmer} key={farmer.slug} />
      ))}
    </div>
  );
}
