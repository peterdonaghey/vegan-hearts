"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { places, type Place, type PlaceType } from "@/lib/places";

const MARKER_COLORS: Record<PlaceType, string> = {
  sanctuary: "#c0392b",
  restaurant: "#e67e22",
  shop: "#2980b9",
  project: "#8e44ad",
  accommodation: "#16a085",
};

const TYPE_ICONS: Record<PlaceType, string> = {
  sanctuary: "🏠",
  restaurant: "🍽",
  shop: "🛒",
  project: "🌿",
  accommodation: "🛌",
};

const TYPE_LABELS: Record<PlaceType, string> = {
  sanctuary: "Animal Sanctuary",
  restaurant: "Vegan Restaurant",
  shop: "Vegan Shop",
  project: "Vegan Project",
  accommodation: "Accommodation",
};

interface Props {
  /** Height of the map container. Default "500px" */
  height?: string;
  /** Show the filter bar. Default true */
  showFilter?: boolean;
  /** Show the legend. Default true */
  showLegend?: boolean;
  /** Initial center point. Default opens to fit all places */
  center?: [number, number];
  /** Initial zoom. Default auto-fits */
  zoom?: number;
  /** Additional CSS classes */
  className?: string;
}

export default function SanctuaryMap({
  height = "500px",
  showFilter = true,
  showLegend = true,
  center,
  zoom,
  className = "",
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [activeFilter, setActiveFilter] = useState<PlaceType | "all">("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? places
        : places.filter((p) => p.type === activeFilter),
    [activeFilter]
  );

  // Initialise map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: center ?? [40, -3],
      zoom: zoom ?? 6,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render markers when filter changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (filtered.length === 0) return;

    const bounds: [number, number][] = [];

    filtered.forEach((p) => {
      const color = MARKER_COLORS[p.type] || "#999";
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 8,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      });

      const icon = TYPE_ICONS[p.type] || "";
      const imgHtml = p.image
        ? `<img src="${p.image}" style="width:100%;max-height:120px;object-fit:cover;border-radius:4px;margin:4px 0" />`
        : "";
      const tagsHtml = p.tags
        ?.map((t) => `#${t}`)
        .join(" ");

      marker.bindPopup(`
        <div style="min-width:180px">
          <h3 style="margin:0 0 2px;font-size:1rem">${icon} ${p.name}</h3>
          <span style="display:inline-block;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.3px;padding:1px 6px;border-radius:3px;color:#fff;background:${color};margin-bottom:4px">${p.type}</span>
          ${imgHtml}
          <p style="margin:4px 0;font-size:0.8rem;color:#555;line-height:1.4">${p.description}</p>
          <p style="font-size:0.75rem;color:#888;margin:2px 0">${p.address}</p>
          ${p.website ? `<p style="margin:4px 0"><a href="${p.website}" target="_blank" style="color:#2d5a27;font-size:0.8rem">Visit website →</a></p>` : ""}
          ${tagsHtml ? `<p style="font-size:0.7rem;color:#aaa;margin:2px 0">${tagsHtml}</p>` : ""}
        </div>
      `);

      marker.on("mouseover", () => marker.setRadius(11));
      marker.on("mouseout", () => marker.setRadius(8));

      marker.addTo(map);
      markersRef.current.push(marker);
      bounds.push([p.lat, p.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [filtered]);

  // Type counts for filter buttons
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: places.length };
    places.forEach((p) => {
      c[p.type] = (c[p.type] || 0) + 1;
    });
    return c;
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Filter bar */}
      {showFilter && (
        <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-1.5">
          {(["all", "sanctuary", "project", "accommodation"] as const).map(
            (type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                  activeFilter === type
                    ? "bg-vh-green text-white border-vh-green shadow-sm"
                    : "bg-white/90 text-gray-700 border-gray-200 hover:bg-white hover:shadow-sm"
                }`}
              >
                {type === "all"
                  ? `All (${counts.all})`
                  : `${TYPE_LABELS[type as PlaceType]} (${counts[type] || 0})`}
              </button>
            )
          )}
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-6 left-3 z-[1000] bg-white/90 rounded-lg px-3 py-2 text-xs shadow leading-relaxed">
          {(["sanctuary", "project", "accommodation"] as const).map(
            (type) => (
              <div key={type} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: MARKER_COLORS[type] }}
                />
                {TYPE_LABELS[type]}
              </div>
            )
          )}
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-xl overflow-hidden"
      />
    </div>
  );
}

export { places } from "@/lib/places";
