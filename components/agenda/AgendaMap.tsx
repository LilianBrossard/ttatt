"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corriger le problème des icônes Leaflet par défaut avec Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Props {
  lat: number;
  lng: number;
  popupText?: string;
}

export default function AgendaMap({ lat, lng, popupText }: Props) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-primary/20">
      <MapContainer 
        center={[lat, lng]} 
        zoom={14} 
        style={{ width: "100%", height: "100%", minHeight: "250px" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-filter"
        />
        <Marker position={[lat, lng]}>
          {popupText && (
            <Popup>
              <div className="font-semibold text-background">{popupText}</div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
