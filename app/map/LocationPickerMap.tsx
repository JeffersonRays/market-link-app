"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

const defaultCenter: [number, number] = [6.5244, 3.3792];
const pinIcon = L.divIcon({
  className: "location-picker-pin-icon",
  html: "<span></span>",
  iconSize: [30, 38],
  iconAnchor: [15, 38],
});

function MapClick({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (event) => onChange(event.latlng.lat, event.latlng.lng),
  });
  return null;
}

function Recenter({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position)
      map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 0.45 });
  }, [map, position]);
  return null;
}

export default function LocationPickerMap({
  position,
  onChange,
}: {
  position: [number, number] | null;
  onChange: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={position || defaultCenter}
      zoom={position ? 15 : 11}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClick onChange={onChange} />
      <Recenter position={position} />
      {position && <Marker position={position} icon={pinIcon} />}
    </MapContainer>
  );
}
