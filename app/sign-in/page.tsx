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

export default function SignInPage() {
  const router = useRouter();
  const { ready, user } = useSession();
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
    setError("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await apiData<{ user: User; token: string }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: form.get("email"),
            password: form.get("password"),
          }),
        },
      );
      saveSession(result.user, result.token);
      router.replace(roleHome(result.user.role));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="container auth-layout">
          <section className="auth-story">
            <div className="auth-story-art">
              <div className="auth-orbit orbit-one" />
              <div className="auth-orbit orbit-two" />
              <div className="auth-art-photo" />
              <div className="auth-art-note">
                <span className="auth-note-icon">
                  <Icon name="leaf" size={18} />
                </span>
                <div>
                  <strong>Fresh this week</strong>
                  <small>From local growers near you</small>
                </div>
              </div>
            </div>
            <p className="eyebrow">Welcome back to the market</p>
            <h1>Your good food list is waiting.</h1>
            <p className="auth-story-copy">
              Sign in to keep track of your favourite farmers, markets, and
              fresh finds.
            </p>
            <Link className="text-link" href="/products">
              Browse fresh produce <Icon name="arrow" size={15} />
            </Link>
          </section>
          <section className="auth-card">
            <div className="auth-card-heading">
              <p className="eyebrow">Sign in</p>
              <h2>Welcome back.</h2>
              <p>Pick up where you left off with MarketLink.</p>
            </div>
            <form className="auth-form" onSubmit={submit}>
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
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
              </label>
              {error && (
                <p role="alert" className="form-error">
                  {error}
                </p>
              )}
              <button className="button auth-submit" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}{" "}
                <Icon name="arrow" size={16} />
              </button>
            </form>
            <p className="auth-switch">
              New to MarketLink? <Link href="/join">Create an account</Link>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
