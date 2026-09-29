"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { api, apiData, patchBody } from "../../../lib/api";

type Profile = {
  id: number;
  business_name: string;
  business_description?: string | null;
  profile_image_url?: string | null;
  approval_status?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
};
type Market = {
  id: number;
  market_name: string;
  address?: string;
  stall_name?: string | null;
  stall_number?: string | null;
  stall_description?: string | null;
  stall_latitude?: number | null;
  stall_longitude?: number | null;
  operating_days?: string;
  pickup_start_time?: string | null;
  pickup_end_time?: string | null;
};

export default function FarmerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      apiData<Profile>("/farmers/me"),
      apiData<Market[]>("/farmers/me/markets"),
    ])
      .then(([farmer, farmerMarkets]) => {
        if (!active) return;
        setProfile(farmer);
        setMarkets(farmerMarkets);
        setName(farmer.business_name || "");
        setFirstName(farmer.first_name || "");
        setLastName(farmer.last_name || "");
        setDescription(farmer.business_description || "");
        setPreview(farmer.profile_image_url || "");
      })
      .catch((cause) =>
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load your farm profile.",
        ),
      );
    return () => {
      active = false;
    };
  }, []);

  function choosePhoto(file: File | null) {
    setPhoto(file);
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(
      file ? URL.createObjectURL(file) : profile?.profile_image_url || "",
    );
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (photo) {
        const form = new FormData();
        form.set("business_name", name);
        form.set("business_description", description);
        form.set("first_name", firstName);
        form.set("last_name", lastName);
        form.set("image", photo);
        await api("/farmers/me", { method: "PATCH", body: form });
      } else {
        await api(
          "/farmers/me",
          patchBody({
            business_name: name,
            business_description: description,
            first_name: firstName,
            last_name: lastName,
          }),
        );
      }
      const updated = await apiData<Profile>("/farmers/me");
      setProfile(updated);
      setName(updated.business_name || "");
      setFirstName(updated.first_name || "");
      setLastName(updated.last_name || "");
      setDescription(updated.business_description || "");
      setPreview(updated.profile_image_url || "");
      setPhoto(null);
      setMessage("Your farm profile has been saved.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save your profile.",
      );
    } finally {
      setBusy(false);
    }
  }

  const completed = [
    profile?.business_name,
    profile?.business_description,
    profile?.profile_image_url,
    profile?.email,
    profile?.phone,
    profile?.address,
  ].filter(Boolean).length;
  const completion = Math.round((completed / 6) * 100);

  return (
    <div className="farmer-profile-page">
      <div className="farmer-profile-heading">
        <div>
          <p className="eyebrow">Farm management</p>
          <h1>Farm profile</h1>
          <p>Manage the public details customers use to recognise your farm.</p>
        </div>
        <button
          className="button button-dark"
          form="farmer-profile-form"
          disabled={busy}
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="farmer-profile-message" role="status">
          {message}
        </p>
      )}
      <div className="farmer-profile-grid">
        <aside className="farmer-profile-summary">
          <div className="farmer-profile-cover">
            <span>Fresh from your farm</span>
          </div>
          <div className="farmer-profile-avatar">
            {preview ? (
              <img src={preview} alt="Farm profile" />
            ) : (
              <span>{name.slice(0, 2).toUpperCase() || "FM"}</span>
            )}
          </div>
          <div className="farmer-profile-summary-body">
            <h2>{name || "Your farm name"}</h2>
            <span
              className={`farmer-approval-pill ${profile?.approval_status === "approved" ? "approved" : "pending"}`}
            >
              {(profile?.approval_status || "Pending review").replaceAll(
                "_",
                " ",
              )}
            </span>
            <div className="farmer-profile-progress">
              <div>
                <strong>Profile details</strong>
                <span>{completion}%</span>
              </div>
              <span className="farmer-profile-progress-track">
                <span style={{ width: `${completion}%` }} />
              </span>
              <small>
                Complete your farm information to help customers shop with
                confidence.
              </small>
            </div>
            <dl className="farmer-contact-details">
              <div>
                <dt>Account contact</dt>
                <dd>
                  {[profile?.first_name, profile?.last_name]
                    .filter(Boolean)
                    .join(" ") || "Not provided"}
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{profile?.email || "Not provided"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{profile?.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{profile?.address || "Not provided"}</dd>
              </div>
            </dl>
          </div>
        </aside>
        <form
          id="farmer-profile-form"
          className="farmer-profile-form"
          onSubmit={save}
        >
          <div className="farmer-profile-form-heading">
            <span>YOUR FARM</span>
            <h2>Public profile</h2>
            <p>These details are saved to your farmer profile.</p>
          </div>
          <div className="farmer-profile-name-fields">
            <label className="farmer-profile-field">
              Your first name
              <input
                required
                maxLength={80}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
              />
            </label>
            <label className="farmer-profile-field">
              Your last name
              <input
                required
                maxLength={80}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
              />
            </label>
          </div>
          <label className="farmer-profile-field">
            Farm or business name
            <input
              required
              maxLength={150}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Green Valley Farm"
            />
          </label>
          <label className="farmer-profile-field">
            About your farm
            <textarea
              maxLength={5000}
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Share what you grow and how you farm."
            />
            <small>{description.length}/5000 characters</small>
          </label>
          <label className="farmer-profile-field">
            Farm profile photo
            <span className="farmer-profile-upload">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) =>
                  choosePhoto(event.target.files?.[0] || null)
                }
              />
              <span>
                {photo?.name ||
                  "Choose a JPEG, PNG, WebP, or GIF image (up to 5 MB)"}
              </span>
            </span>
          </label>
        </form>
      </div>
      <section className="farmer-markets-profile">
        <div className="farmer-markets-heading">
          <div>
            <span>YOUR SELLING LOCATIONS</span>
            <h2>Markets &amp; pickup locations</h2>
            <p>
              Market and stall details currently linked to your farmer account.
            </p>
          </div>
          <Link className="button" href="/farmer/markets">
            Manage markets
          </Link>
        </div>
        {markets.length ? (
          <div className="farmer-market-profile-list">
            {markets.map((market) => (
              <article key={market.id}>
                <div className="farmer-market-pin">⌖</div>
                <div className="farmer-market-profile-info">
                  <h3>{market.market_name}</h3>
                  <p>{market.address || "Market address not listed"}</p>
                  <div className="farmer-market-meta">
                    {market.stall_name && (
                      <span>
                        {market.stall_name}
                        {market.stall_number ? ` · ${market.stall_number}` : ""}
                      </span>
                    )}
                    <span>
                      {String(market.operating_days || "Days not set")
                        .split(",")
                        .map((day) => day.trim())
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    {market.pickup_start_time && (
                      <span>
                        Pickup {market.pickup_start_time.slice(0, 5)}
                        {market.pickup_end_time
                          ? `–${market.pickup_end_time.slice(0, 5)}`
                          : ""}
                      </span>
                    )}
                  </div>
                  {market.stall_description && (
                    <p>{market.stall_description}</p>
                  )}
                </div>
                <div className="farmer-market-coordinate">
                  {market.stall_latitude != null &&
                  market.stall_longitude != null ? (
                    <>
                      <strong>Stall location</strong>
                      <span>
                        {Number(market.stall_latitude).toFixed(5)},{" "}
                        {Number(market.stall_longitude).toFixed(5)}
                      </span>
                    </>
                  ) : (
                    <span>Stall coordinates not set</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="farmer-market-empty">
            No markets linked yet. Add your market and stall location from the
            Markets page.
          </div>
        )}
      </section>
    </div>
  );
}
