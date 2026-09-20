"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

/** Inline pin so Leaflet never requests its default marker images. */
const pin = L.divIcon({
  className: "",
  html: `<span style="display:block;width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#0F5E5C;border:3px solid #fff;box-shadow:0 2px 6px rgba(14,27,42,.4)"></span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom() < 14 ? 16 : map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
}

export default function MapCanvas({
  lat,
  lng,
  interactive = true,
  height = 320,
  onPick,
}: {
  lat: number;
  lng: number;
  interactive?: boolean;
  height?: number;
  onPick?: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      scrollWheelZoom={false}
      dragging={interactive}
      style={{ height, width: "100%", borderRadius: "0.375rem", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <Recenter lat={lat} lng={lng} />
      <Marker
        position={[lat, lng]}
        icon={pin}
        draggable={interactive}
        eventHandlers={
          interactive && onPick
            ? {
                dragend: (e) => {
                  const p = (e.target as L.Marker).getLatLng();
                  onPick(p.lat, p.lng);
                },
              }
            : undefined
        }
      />
      {interactive && onPick && <ClickHandler onPick={onPick} />}
    </MapContainer>
  );
}
