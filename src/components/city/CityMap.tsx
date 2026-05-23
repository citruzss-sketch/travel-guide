"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CityContent, Locale, MapMarkerCategory } from "@/types/content";
import { useT } from "@/components/providers/LocaleProvider";

const CATEGORY_COLORS: Record<MapMarkerCategory, string> = {
  airport: "#3b82f6",
  beach: "#06b6d4",
  food: "#f97316",
  sight: "#a855f7",
  district: "#22c55e",
  transport: "#eab308",
};

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

interface CityMapProps {
  city: CityContent;
  locale: Locale;
}

export default function CityMap({ city, locale }: CityMapProps) {
  const t = useT();
  const center = city.coordinates ?? { lat: 12.24, lng: 109.19 };
  const markers = city.mapMarkers ?? [];

  const icons = useMemo(() => {
    const map = new Map<MapMarkerCategory, L.DivIcon>();
    (Object.keys(CATEGORY_COLORS) as MapMarkerCategory[]).forEach((cat) => {
      map.set(cat, createIcon(CATEGORY_COLORS[cat]));
    });
    return map;
  }, []);

  if (!markers.length) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
        {t("map.noMarkers")}
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <div className="flex flex-wrap gap-2 border-b border-border bg-surface px-4 py-3">
        {(Object.keys(CATEGORY_COLORS) as MapMarkerCategory[]).map((cat) => (
          <span
            key={cat}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: CATEGORY_COLORS[cat] }}
            />
            {t(`map.category.${cat}`)}
          </span>
        ))}
      </div>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        scrollWheelZoom={false}
        className="z-0 h-[min(60vh,480px)] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={icons.get(marker.category) ?? icons.get("sight")!}
          >
            <Popup>
              <div className="min-w-[160px] text-sm">
                <p className="font-bold text-stone-900">
                  {marker.title[locale]}
                </p>
                {marker.description && (
                  <p className="mt-1 text-stone-600">
                    {marker.description[locale]}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
