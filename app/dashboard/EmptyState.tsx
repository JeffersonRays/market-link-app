import Link from "next/link";
import { Icon } from "../components";

export function DashboardEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  secondaryHref,
  secondaryLabel,
  icon = "package",
  compact = false,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  icon?: string;
  compact?: boolean;
}) {
  return (
    <section className={`dashboard-empty-state${compact ? " is-compact" : ""}`}>
      <span className="dashboard-empty-icon">
        <Icon name={icon} size={23} />
      </span>
      <div className="dashboard-empty-copy">
        <span className="dashboard-empty-kicker">Nothing here yet</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {((actionHref && actionLabel) || (secondaryHref && secondaryLabel)) && (
        <div className="dashboard-empty-actions">
          {actionHref && actionLabel && (
            <Link className="button button-dark" href={actionHref}>
              {actionLabel}
            </Link>
          )}
          {secondaryHref && secondaryLabel && (
            <Link className="dashboard-empty-secondary" href={secondaryHref}>
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
