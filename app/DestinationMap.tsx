"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export type MapPlace = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  coordinates: [number, number];
  mapQuery: string;
  kind: "home" | "destination" | "stopover";
};

const holidayHome = "17 Rue du Moulin, 10700 Saint-Remy-sous-Barbuise, France";

function routeUrl(place: MapPlace) {
  if (place.kind === "home") {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(holidayHome)}`;
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(holidayHome)}&destination=${encodeURIComponent(place.mapQuery)}&travelmode=driving`;
}

export default function DestinationMap({ places }: { places: MapPlace[] }) {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | undefined;

    void (async () => {
      const L = await import("leaflet");
      if (disposed || !mapElement.current) return;

      map = L.map(mapElement.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const bounds = L.latLngBounds(places.map((place) => place.coordinates));

      for (const place of places) {
        const markerLabel = place.kind === "home" ? "⌂" : place.number;
        const icon = L.divIcon({
          className: "map-marker-shell",
          html: `<span class="map-pin map-pin-${place.kind}">${markerLabel}</span>`,
          iconSize: [38, 46],
          iconAnchor: [19, 45],
          popupAnchor: [0, -40],
        });

        const popup = document.createElement("div");
        popup.className = "map-popup";

        const eyebrow = document.createElement("small");
        eyebrow.textContent = place.kind === "home" ? "Euer Ausgangspunkt" : place.kind === "stopover" ? "Reisestopp" : `Ziel ${place.number}`;

        const title = document.createElement("strong");
        title.textContent = place.title;

        const subtitle = document.createElement("span");
        subtitle.textContent = place.subtitle;

        const links = document.createElement("div");
        links.className = "map-popup-links";

        if (place.kind === "destination") {
          const detailLink = document.createElement("a");
          detailLink.href = `#trip-${place.id}`;
          detailLink.textContent = "Zum Tagesplan";
          links.append(detailLink);
        } else if (place.kind === "stopover") {
          const detailLink = document.createElement("a");
          detailLink.href = "#stopover-title";
          detailLink.textContent = "Zum Stopp";
          links.append(detailLink);
        }

        const mapsLink = document.createElement("a");
        mapsLink.href = routeUrl(place);
        mapsLink.target = "_blank";
        mapsLink.rel = "noreferrer";
        mapsLink.textContent = place.kind === "home" ? "In Google Maps" : "Route in Google Maps";
        links.append(mapsLink);

        popup.append(eyebrow, title, subtitle, links);
        L.marker(place.coordinates, { icon, title: place.title }).addTo(map).bindPopup(popup, { maxWidth: 260 });
      }

      map.fitBounds(bounds, { padding: [32, 32] });
    })();

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [places]);

  return <div className="map-canvas" ref={mapElement} role="region" aria-label="Übersichtskarte mit Ferienhaus, Ausflugszielen und Reisestopp" />;
}
