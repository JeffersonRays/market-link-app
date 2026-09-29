"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./LocationPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="location-picker-map-loading">Loading map…</div>
  ),
});

type Place = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  latitudeName: string;
  longitudeName: string;
  initialLatitude?: unknown;
  initialLongitude?: unknown;
  label?: string;
};

const GEOCODING_SEARCH_URL = (
  process.env.NEXT_PUBLIC_GEOCODING_SEARCH_URL ||
  "https://nominatim.openstreetmap.org/search"
).replace(/\/$/, "");
let lastSearchAt = 0;
const placeCache = new Map<string, Place[]>();

export default function LocationPicker({
  latitudeName,
  longitudeName,
  initialLatitude,
  initialLongitude,
  label = "Location",
}: Props) {
  const initialLat =
    initialLatitude == null || initialLatitude === ""
      ? null
      : Number(initialLatitude);
  const initialLng =
    initialLongitude == null || initialLongitude === ""
      ? null
      : Number(initialLongitude);
  const initialPosition =
    initialLat != null &&
    initialLng != null &&
    Number.isFinite(initialLat) &&
    Number.isFinite(initialLng)
      ? ([initialLat, initialLng] as [number, number])
      : null;
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition,
  );
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    const searchText = query.trim();
    if (!searchText) {
      setError("Enter an address, place, or landmark to search.");
      return;
    }
    const cacheKey = searchText.toLocaleLowerCase();
    const cached = placeCache.get(cacheKey);
    if (cached) {
      setPlaces(cached);
      setError(
        cached.length
          ? ""
          : "No matching locations found. Try a nearby landmark or a more specific address.",
      );
      return;
    }
    const wait = 1100 - (Date.now() - lastSearchAt);
    if (wait > 0) {
      setError("Please wait a moment before searching again.");
      return;
    }
    lastSearchAt = Date.now();
    setBusy(true);
    setError("");
    setPlaces([]);
    try {
      const params = new URLSearchParams({
        q: searchText,
        format: "jsonv2",
        limit: "5",
        addressdetails: "1",
      });
      const response = await fetch(
        `${GEOCODING_SEARCH_URL}?${params.toString()}`,
        {
          headers: { Accept: "application/json" },
          referrerPolicy: "strict-origin-when-cross-origin",
        },
      );
      if (!response.ok)
        throw new Error(
          "The location search is unavailable right now. You can still choose a point on the map.",
        );
      const results = (await response.json()) as Place[];
      if (placeCache.size >= 100) placeCache.clear();
      placeCache.set(cacheKey, results);
      if (!results.length) {
        setError(
          "No matching locations found. Try a nearby landmark or a more specific address.",
        );
        return;
      }
      setPlaces(results);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not search for that location.",
      );
    } finally {
      setBusy(false);
    }
  }

  function choose(place: Place) {
    const lat = Number(place.lat);
    const lng = Number(place.lon);
    setPosition([lat, lng]);
    setQuery(place.display_name);
    setPlaces([]);
    setError("");
  }

  return (
    <section className="location-picker" aria-label={`${label} picker`}>
      <div className="location-picker-heading">
        <strong>{label}</strong>
        <span>
          Search an address (sent to OpenStreetMap), then adjust the pin on the
          map if needed.
        </span>
      </div>
      <div className="location-picker-search" role="search">
        <label className="sr-only" htmlFor={`${latitudeName}-search`}>
          Search an address or place
        </label>
        <input
          id={`${latitudeName}-search`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void search();
            }
          }}
          placeholder="Street, market, landmark, or area"
          autoComplete="off"
        />
        <button type="button" onClick={() => void search()} disabled={busy}>
          {busy ? "Searching…" : "Find location"}
        </button>
      </div>
      {error && (
        <p className="location-picker-error" role="status">
          {error}
        </p>
      )}
      {places.length > 0 && (
        <div
          className="location-picker-results"
          role="list"
          aria-label="Search results"
        >
          {places.map((place) => (
            <button
              type="button"
              role="listitem"
              key={place.place_id}
              onClick={() => choose(place)}
            >
              {place.display_name}
            </button>
          ))}
        </div>
      )}
      <div className="location-picker-map">
        <LocationMap
          position={position}
          onChange={(lat, lng) => setPosition([lat, lng])}
        />
      </div>
      <div className="location-picker-coordinates">
        {position ? (
          <>
            <span>
              <strong>Selected coordinates</strong>
              <small>Click the map to move the pin.</small>
            </span>
            <code>
              {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </code>
          </>
        ) : (
          <span>Choose a search result or click the map to set a pin.</span>
        )}
      </div>
      <p className="location-picker-attribution">
        Search and map data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          OpenStreetMap contributors
        </a>
        .
      </p>
      <input type="hidden" name={latitudeName} value={position?.[0] ?? ""} />
      <input type="hidden" name={longitudeName} value={position?.[1] ?? ""} />
    </section>
  );
}
