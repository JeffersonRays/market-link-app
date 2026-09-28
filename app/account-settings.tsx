"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiData, patchBody, type User, api } from "../lib/api";
import { ProtectedPage } from "./dashboard/ProtectedPage";

type FarmerProfile = { business_name: string; business_description?: string; profile_image_url?: string };

export function AccountSettings({ role }: { role: "customer" | "farmer" | "admin" }) {
  const [user, setUser] = useState<User | null>(null); const [farmer, setFarmer] = useState<FarmerProfile | null>(null); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  useEffect(() => {
    apiData<User>("/users/me").then(setUser).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load your profile."));
    if (role === "farmer") apiData<FarmerProfile>("/farmers/me").then(setFarmer).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load farmer profile."));
  }, [role]);
  async function save(event: FormEvent<HTMLFormElement>, path: string) { event.preventDefault(); setError(""); setMessage(""); const values = Object.fromEntries([...new FormData(event.currentTarget).entries()].filter(([, value]) => value !== "")); try { await api(path, patchBody(values)); setMessage("Profile updated."); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not update your profile."); } }
  return <ProtectedPage role={role}>{() => <main className="page-content"><div className="container"><p className="eyebrow">Account settings</p><h1>Your profile</h1>{error && <p role="alert" className="form-error">{error}</p>}{message && <p role="status">{message}</p>}
    {user && <form className="api-form" onSubmit={(event) => save(event, "/users/me")}><h2>Personal details</h2><label>First name<input name="first_name" defaultValue={user.first_name} required /></label><label>Last name<input name="last_name" defaultValue={user.last_name} required /></label><label>Email<input value={user.email} readOnly /></label><label>Phone<input name="phone" defaultValue={user.phone} required /></label><label>Address<input name="address" defaultValue={user.address} required /></label><button className="button">Save personal details</button></form>}
    {farmer && <form className="api-form" onSubmit={(event) => save(event, "/farmers/me")}><h2>Business profile</h2><label>Business name<input name="business_name" defaultValue={farmer.business_name} required /></label><label>Description<textarea name="business_description" defaultValue={farmer.business_description || ""} maxLength={5000} /></label><label>Profile image URL<input name="profile_image_url" type="url" defaultValue={farmer.profile_image_url || ""} /></label><button className="button">Save business profile</button></form>}
  </div></main>}</ProtectedPage>;
}
