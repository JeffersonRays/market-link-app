"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "../../lib/api";
import { Icon, Logo } from "../components";

type Role = "customer" | "farmer" | "admin";

const navByRole: Record<Role, { label: string; icon: string; href: string }[]> = {
  customer: [
    { label: "Overview", icon: "home", href: "/customer/dashboard" },
    { label: "My orders", icon: "package", href: "/customer/orders" },
    { label: "Favorites", icon: "heart", href: "/customer/favorites" },
    { label: "Notifications", icon: "bell", href: "/customer/notifications" },
  ],
  farmer: [
    { label: "Dashboard", icon: "home", href: "/farmer/dashboard" },
    { label: "Orders", icon: "package", href: "/farmer/orders" },
    { label: "Products", icon: "leaf", href: "/farmer/products" },
    { label: "Weekly inventory", icon: "chart", href: "/farmer/inventory" },
    { label: "Markets", icon: "storefront", href: "/farmer/markets" },
    { label: "Pickup slots", icon: "calendar", href: "/farmer/pickup-slots" },
    { label: "Reviews", icon: "star", href: "/farmer/reviews" },
  ],
  admin: [
    { label: "Overview", icon: "home", href: "/admin/dashboard" },
    { label: "Farmers", icon: "users", href: "/admin/farmers" },
    { label: "Customers", icon: "users", href: "/admin/customers" },
    { label: "Orders", icon: "package", href: "/admin/orders" },
    { label: "Markets", icon: "storefront", href: "/admin/markets" },
    { label: "Categories", icon: "package", href: "/admin/categories" },
    { label: "Announcements", icon: "bell", href: "/admin/announcements" },
  ],
};

const roleLabels: Record<Role, string> = {
  customer: "Customer space",
  farmer: "Farmer workspace",
  admin: "Platform overview",
};

export function DashboardShell({
  role,
  name,
  initials,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  role: Role;
  name: string;
  initials: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`dashboard-app dashboard-${role}`}>
      <DashboardSidebar
        role={role}
        name={name}
        open={open}
        onClose={() => setOpen(false)}
        pathname={pathname}
      />
      {open && (
        <button
          className="dashboard-sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="dashboard-main-shell">
        <DashboardHeader
          name={name}
          initials={initials}
          onMenu={() => setOpen(true)}
          role={role}
          pathname={pathname}
        />
        <main className="dashboard-main">
          <div className="dashboard-container">
            {title && (
              <div className="dashboard-page-heading">
                <div>
                  <p className="eyebrow">{eyebrow}</p>
                  <h1>{title}</h1>
                  <p>{subtitle}</p>
                </div>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardSidebar({
  role,
  name,
  open,
  onClose,
  pathname,
}: {
  role: Role;
  name: string;
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const router = useRouter();
  const roleName = role === "admin" ? "Administrator" : role;

  return (
    <aside className={`dashboard-sidebar ${open ? "is-open" : ""}`}>
      <div className="dashboard-sidebar-top">
        <Logo />
        <button
          className="dashboard-sidebar-close"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="dashboard-farm-switch">
        <span className="farm-switch-avatar">
          <Icon
            name={role === "farmer" ? "leaf" : role === "admin" ? "shield" : "users"}
            size={19}
          />
        </span>
        <span>
          <strong>
            {role === "farmer" ? "My farm" : role === "admin" ? "MarketLink Admin" : "My account"}
          </strong>
          <small>{roleName} account</small>
        </span>
      </div>
      <div className="dashboard-role-label">
        {role === "farmer" ? "Farm management" : roleLabels[role]}
      </div>
      <nav className="dashboard-nav">
        {navByRole[role].map((item) => (
          <Link
            className={`dashboard-nav-link ${pathname === item.href || (item.href !== `/${role}/dashboard` && pathname.startsWith(`${item.href}/`)) ? "active" : ""}`}
            href={item.href}
            key={item.label}
            onClick={onClose}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="dashboard-sidebar-bottom">
        <div className="dashboard-help-card">
          <span>?</span>
          <strong>Need some help?</strong>
          <small>Visit the MarketLink help center</small>
          <Link href="/contact" onClick={onClose}>Get support</Link>
        </div>
        <Link
          className={`dashboard-nav-link ${pathname.startsWith(`/${role}/settings`) ? "active" : ""}`}
          href={`/${role}/settings`}
          onClick={onClose}
        >
          <Icon name="settings" size={18} />
          <span>Settings</span>
        </Link>
        <button
          className="dashboard-nav-link"
          onClick={() => {
            clearSession();
            router.replace("/sign-in");
          }}
        >
          <Icon name="external" size={18} />
          <span>Sign out</span>
        </button>
        <div className="dashboard-sidebar-user">
          <span className="avatar avatar-small">{initialsFor(role)}</span>
          <div>
            <strong>{name}</strong>
            <small>{roleName}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DashboardHeader({
  name,
  initials,
  role,
  onMenu,
  pathname,
}: {
  name: string;
  initials: string;
  role: Role;
  onMenu: () => void;
  pathname: string;
}) {
  const segment = pathname.split("/").filter(Boolean).at(-1) || "dashboard";
  const pageTitle =
    segment === "dashboard"
      ? "Dashboard"
      : segment.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <header className="dashboard-header">
      <div className="dashboard-container dashboard-header-inner">
        <button
          className="dashboard-menu-button"
          onClick={onMenu}
          aria-label="Open navigation"
        >
          <Icon name="menu" size={21} />
        </button>
        <div className="dashboard-mobile-brand"><Logo /></div>
        <div className="dashboard-topbar-title">
          <small>{role === "farmer" ? "Farmer portal" : role === "admin" ? "Admin portal" : "Customer portal"}</small>
          <strong>{pageTitle}</strong>
        </div>
        {role === "customer" && (
          <Link
            className="dashboard-icon-button"
            href="/customer/notifications"
            aria-label="View notifications"
          >
            <Icon name="bell" size={19} />
          </Link>
        )}
        <div className="dashboard-user-menu">
          <span className="avatar">{initials}</span>
          <div>
            <strong>{name}</strong>
            <small>{role === "admin" ? "Administrator" : role === "farmer" ? "Farmer" : "Customer"}</small>
          </div>
        </div>
      </div>
    </header>
  );
}

function initialsFor(role: Role) {
  return role === "customer" ? "CU" : role === "farmer" ? "FA" : "AD";
}
