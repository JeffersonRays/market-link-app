"use client";

import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

export type MarketMapItem = {
  id: number;
  name: string;
  address: string;
  latitude: string | number | null;
  longitude: string | number | null;
  distance_km?: number;
};

type MarketMapProps = {
  markets: MarketMapItem[];
  userLocation?: [number, number] | null;
};

const defaultCenter: [number, number] = [6.5244, 3.3792];

const marketIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width: 28px;
        height: 28px;
        background: #153F2D;
        border: 4px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,.25);
      "
    ></div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

export default function MarketMapInner({
  markets,
  userLocation,
}: MarketMapProps) {
  const validMarkets = markets.filter(
    (market) => market.latitude != null && market.longitude != null,
  );

  const center: [number, number] =
    userLocation ??
    (validMarkets.length > 0
      ? [Number(validMarkets[0].latitude), Number(validMarkets[0].longitude)]
      : defaultCenter);

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validMarkets.map((market) => (
        <Marker
          key={market.id}
          position={[Number(market.latitude), Number(market.longitude)]}
          icon={marketIcon}
        >
          <Popup>
            <div>
              <strong>{market.name}</strong>

              <p>{market.address}</p>

              {market.distance_km != null && (
                <p>{market.distance_km} km away</p>
              )}

              <a href={`/markets/${market.id}`}>View market</a>
            </div>
          </Popup>
        </Marker>
      ))}

      {userLocation && (
        <CircleMarker center={userLocation} radius={8}>
          <Popup>Your location</Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
