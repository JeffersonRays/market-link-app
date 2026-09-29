"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiData,
  getToken,
  roleHome,
  saveSession,
  type User,
} from "../../lib/api";
import { Footer, Header, Icon } from "../components";
import { useSession } from "../auth/useSession";

export default function JoinPage() {
  const router = useRouter();
  const { ready, user } = useSession();
  const [role, setRole] = useState<"customer" | "farmer" | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!ready || !user || !token) return;
    let active = true;
    apiData<User>("/auth/me")
      .then((currentUser) => {
        if (!active) return;
        saveSession(currentUser, token);
        router.replace(roleHome(currentUser.role));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [ready, router, user?.id, user?.role]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!role) return;
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const [first_name, ...last] = String(values.full_name || "")
      .trim()
      .split(/\s+/);
    const payload: Record<string, FormDataEntryValue | string> = {
      ...values,
      first_name,
      last_name: last.join(" ") || first_name,
    };
    delete payload.full_name;
    form.delete("full_name");
    form.set("first_name", first_name);
    form.set("last_name", last.join(" ") || first_name);
    if (role === "farmer") {
      const image = form.get("image");
      if (!(image instanceof File) || !image.name) form.delete("image");
    }
    try {
      const result = await apiData<{ user: User; token: string }>(
        `/auth/register/${role}`,
        {
          method: "POST",
          body: role === "farmer" ? form : JSON.stringify(payload),
        },
      );
      saveSession(result.user, result.token);
      router.replace(roleHome(result.user.role));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not create the account.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main className="auth-page join-page">
        <div className="container join-layout">
          <section className="join-heading">
            <p className="eyebrow">Make room at the table</p>
            <h1>Join a better way to shop local.</h1>
            <p>
              MarketLink brings customers and farmers together around the best
              part of the week: the market.
            </p>
          </section>
          <section className="join-card">
            {role === null ? (
              <>
                <div className="auth-card-heading">
                  <p className="eyebrow">Create your account</p>
                  <h2>How will you use MarketLink?</h2>
                  <p>Choose the path that fits you best.</p>
                </div>
                <div className="join-options">
                  <button
                    className="join-option join-option-customer"
                    type="button"
                    onClick={() => setRole("customer")}
                  >
                    <span className="join-option-icon">
                      <Icon name="bag" size={22} />
                    </span>
                    <span>
                      <strong>I&apos;m here to shop</strong>
                      <small>Discover markets and reserve fresh food.</small>
                    </span>
                    <Icon name="arrow" size={18} />
                  </button>
                  <button
                    className="join-option join-option-farmer"
                    type="button"
                    onClick={() => setRole("farmer")}
                  >
                    <span className="join-option-icon">
                      <Icon name="leaf" size={22} />
                    </span>
                    <span>
                      <strong>I&apos;m here to sell</strong>
                      <small>Share weekly stock with local customers.</small>
                    </span>
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
                <p className="auth-switch">
                  Already a member? <Link href="/sign-in">Sign in</Link>
                </p>
              </>
            ) : (
              <>
                <div className="auth-card-heading">
                  <button
                    className="join-back"
                    type="button"
                    onClick={() => {
                      setRole(null);
                      setError("");
                    }}
                  >
                    <Icon name="arrow" size={14} /> Change selection
                  </button>
                  <p className="eyebrow">Join as a {role}</p>
                  <h2>Let&apos;s get you started.</h2>
                </div>
                <form className="auth-form join-form" onSubmit={submit}>
                  <label>
                    Full name
                    <input
                      name="full_name"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>
                  <label>
                    Phone number
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+234…"
                      required
                    />
                  </label>
                  <label>
                    Address
                    <input
                      name="address"
                      autoComplete="street-address"
                      placeholder="Your address"
                      required
                    />
                  </label>
                  {role === "farmer" && (
                    <>
                      <label>
                        Farm or stall name
                        <input name="business_name" required />
                      </label>
                      <label>
                        About your business
                        <textarea
                          name="business_description"
                          maxLength={5000}
                        />
                      </label>
                      <label>
                        Business profile image
                        <input
                          name="image"
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                        />
                      </label>
                    </>
                  )}
                  <label>
                    Create a password
                    <input
                      name="password"
                      type="password"
                      minLength={6}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      required
                    />
                  </label>
                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <button className="button auth-submit" disabled={busy}>
                    {busy
                      ? "Creating account…"
                      : role === "farmer"
                        ? "Join as a farmer"
                        : "Sign up as a customer"}{" "}
                    <Icon name="arrow" size={16} />
                  </button>
                </form>
                <p className="auth-legal">
                  Farmer accounts need approval before they can sell.
                </p>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
