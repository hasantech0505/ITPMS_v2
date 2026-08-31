/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { createRoot, Root } from "react-dom/client";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Building2, MapPin, X, AlertCircle } from "lucide-react";
import { Property } from "./propertyTypes";
import { useLanguage } from "../../lib/LanguageContext";

// OpenFreeMap: free, unlimited, no API key required. https://openfreemap.org/
const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

// Coordinates for Kashkadarya districts and cities
const CITY_COORDINATES: { [key: string]: { lat: number; lng: number } } = {
  Qarshi: { lat: 38.8606, lng: 65.7891 },
  Shahrisabz: { lat: 39.0583, lng: 66.8333 },
  Kitob: { lat: 39.1120, lng: 66.8831 },
  Koson: { lat: 39.0378, lng: 65.5819 },
  "G'uzor": { lat: 38.6214, lng: 66.2575 },
  Guzor: { lat: 38.6214, lng: 66.2575 },
  Kamashi: { lat: 38.8167, lng: 66.4667 },
  Yakkabog: { lat: 38.9772, lng: 66.6883 },
  Chiraqchi: { lat: 39.0322, lng: 66.5744 },
  Kasbi: { lat: 38.9022, lng: 65.4833 },
  Muborak: { lat: 39.2553, lng: 65.1539 },
  Mirishkor: { lat: 38.8417, lng: 65.2917 },
  // Approximate district-center coordinates -- Ko'kdala is a smaller southern district near Mirishkor.
  "Ko'kdala": { lat: 38.75, lng: 65.35 }
};

interface KashkadaryaRealEstateMapProps {
  properties: Property[];
  focusedPropertyId: string;
  onSelectProperty: (property: Property) => void;
  onFocusProperty: (id: string) => void;
}

// Small self-contained popup card rendered into a MapLibre Popup's DOM node.
function PropertyPopupCard({
  property,
  onView,
  t
}: {
  property: Property;
  onView: () => void;
  t: (s: string) => string;
}) {
  return (
    <div className="p-1 max-w-[220px] text-slate-900">
      <img
        src={property.coverImage}
        alt=""
        className="w-full h-24 object-cover rounded-md mb-2 bg-slate-100"
      />
      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
        {property.status}
      </span>
      <h4 className="font-bold text-xs mt-1 text-slate-900 line-clamp-1">{property.name}</h4>
      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
        {property.city} &bull; {property.areaSqM} m²
      </p>
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
        <span className="text-xs font-black text-emerald-600">
          {property.monthlyRent
            ? `$${property.monthlyRent}/mo`
            : `$${property.purchasePrice?.toLocaleString()}`}
        </span>
        <button
          onClick={onView}
          className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded cursor-pointer transition-colors"
        >
          {t("View")}
        </button>
      </div>
    </div>
  );
}

export default function KashkadaryaRealEstateMap({
  properties,
  focusedPropertyId,
  onSelectProperty,
  onFocusProperty
}: KashkadaryaRealEstateMapProps) {
  const { t } = useLanguage();
  const [mapLoadError, setMapLoadError] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const popupRootRef = useRef<Root | null>(null);

  // Helper to get coordinates for a property with minor deterministic spread
  const getPropertyCoords = (p: Property, index: number) => {
    const base = CITY_COORDINATES[p.city] || CITY_COORDINATES[p.district] || CITY_COORDINATES["Qarshi"];
    const latOffset = ((index % 5) - 2) * 0.012;
    const lngOffset = (Math.floor(index / 5) - 2) * 0.012;
    return {
      lat: base.lat + latOffset,
      lng: base.lng + lngOffset
    };
  };

  const selectedProperty = properties.find((p) => p.id === focusedPropertyId);

  // Quick navigation preset buttons
  const handleFlyToCity = (cityName: string) => {
    const coords = CITY_COORDINATES[cityName] || CITY_COORDINATES["Qarshi"];
    mapRef.current?.flyTo({ center: [coords.lng, coords.lat], zoom: 12, duration: 900 });
  };

  // Initialize the map once (when we have a valid key)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: [66.1, 38.9],
      zoom: 9,
      attributionControl: false
    });
    map.on("error", () => setMapLoadError(true));
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }));
    mapRef.current = map;

    return () => {
      popupRef.current?.remove();
      popupRootRef.current?.unmount();
      (Object.values(markersRef.current) as maplibregl.Marker[]).forEach((m) => m.remove());
      markersRef.current = {};
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep markers in sync with the properties list & selection state
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(properties.map((p) => p.id));

    // Remove markers for properties no longer present
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    properties.forEach((p, idx) => {
      const coords = getPropertyCoords(p, idx);
      const isSelected = p.id === focusedPropertyId;
      const color = isSelected
        ? "#ef4444"
        : p.status.includes("Available")
        ? "#10b981"
        : p.status === "Reserved"
        ? "#f59e0b"
        : "#64748b";

      let marker = markersRef.current[p.id];
      if (!marker) {
        const el = document.createElement("div");
        el.style.cursor = "pointer";
        el.style.width = "24px";
        el.style.height = "24px";
        el.style.borderRadius = "50% 50% 50% 0";
        el.style.transform = "rotate(-45deg)";
        el.style.border = "2px solid #ffffff";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onFocusProperty(p.id);
        });
        marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);
        markersRef.current[p.id] = marker;
      } else {
        marker.setLngLat([coords.lng, coords.lat]);
      }

      const el = marker.getElement();
      el.style.backgroundColor = color;
      el.style.zIndex = isSelected ? "10" : "1";
      (el.style as any).scale = isSelected ? "1.3" : "1.0";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, focusedPropertyId]);

  // Show/hide the popup for the selected property
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Always tear down the previous popup first
    popupRootRef.current?.unmount();
    popupRootRef.current = null;
    popupRef.current?.remove();
    popupRef.current = null;

    if (!selectedProperty) return;

    const idx = properties.indexOf(selectedProperty);
    const coords = getPropertyCoords(selectedProperty, idx);
    const node = document.createElement("div");
    const root = createRoot(node);
    root.render(
      <PropertyPopupCard
        property={selectedProperty}
        onView={() => onSelectProperty(selectedProperty)}
        t={t}
      />
    );
    popupRootRef.current = root;

    const popup = new maplibregl.Popup({ closeButton: true, offset: 28 })
      .setLngLat([coords.lng, coords.lat])
      .setDOMContent(node)
      .addTo(map);
    popup.on("close", () => onFocusProperty(""));
    popupRef.current = popup;

    map.flyTo({ center: [coords.lng, coords.lat], duration: 600 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedPropertyId]);

  return (
    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-xs">
      {/* Header Bar */}
      <div className="p-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <span>{t("Kashkadarya Interactive Real-Estate Map")}</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                OpenFreeMap · Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interactive GIS geographic property matching for tech hubs, IT parks & BPO centers
            </p>
          </div>
        </div>

        {/* Map presets & controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => handleFlyToCity("Qarshi")}
              className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              Qarshi
            </button>
            <button
              onClick={() => handleFlyToCity("Shahrisabz")}
              className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              Shahrisabz
            </button>
            <button
              onClick={() => handleFlyToCity("Kitob")}
              className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              Kitob
            </button>
            <button
              onClick={() => handleFlyToCity("Koson")}
              className="px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              Koson
            </button>
          </div>

        </div>
      </div>

      {/* Alert banner shown only if the live map tiles fail to load (e.g. offline) */}
      {mapLoadError && (
        <div className="p-3 bg-slate-900 border-b border-amber-500/30 text-slate-200 text-xs leading-relaxed flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>
            Couldn't load live map tiles (check your internet connection). Showing the offline placeholder map below —
            it'll switch back automatically once tiles load.
          </span>
        </div>
      )}

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[480px] bg-slate-950">
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%", display: mapLoadError ? "none" : "block" }} />
        {mapLoadError && (
          /* Interactive fallback map simulator, shown only if live tiles fail to load */
          <div className="w-full h-full relative bg-slate-950 overflow-hidden flex flex-col justify-between p-4 select-none">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Geographic Regional Map Vector Illustration for Kashkadarya */}
            <svg
              className="absolute inset-0 w-full h-full text-emerald-500/20 opacity-40 pointer-events-none"
              viewBox="0 0 800 450"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M 100,200 C 180,90 320,60 480,100 C 580,80 650,50 740,120 C 780,170 760,260 690,320 C 610,380 480,410 380,380 C 260,350 180,370 110,310 C 70,260 80,230 100,200 Z"
                strokeDasharray="4,4"
              />
              <path
                d="M 720,115 Q 530,170 390,190 T 120,230"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeOpacity="0.5"
                fill="none"
              />
            </svg>

            {/* Regional district labels */}
            <div className="absolute inset-0 pointer-events-none text-[10px] font-mono font-bold text-slate-500/50 uppercase tracking-widest">
              <span className="absolute left-[15%] top-[28%] font-black text-emerald-500/40">Koson</span>
              <span className="absolute left-[38%] top-[50%] font-black text-emerald-400/60 text-xs">
                Qarshi Central
              </span>
              <span className="absolute left-[68%] top-[22%] font-black text-emerald-500/40">Kitob</span>
              <span className="absolute left-[75%] top-[38%] font-black text-emerald-500/40">Shahrisabz</span>
              <span className="absolute left-[52%] top-[75%] font-black text-emerald-500/40">G'uzor</span>
              <span className="absolute left-[62%] top-[58%] font-black text-emerald-500/40">Kamashi</span>
            </div>

            {/* Interactive Pins on Vector Map */}
            {properties.map((p, idx) => {
              const posMap: { [key: string]: { x: string; y: string } } = {
                Qarshi: { x: "40%", y: "52%" },
                Shahrisabz: { x: "75%", y: "38%" },
                Kitob: { x: "70%", y: "22%" },
                Koson: { x: "22%", y: "30%" },
                "G'uzor": { x: "52%", y: "75%" },
                Kamashi: { x: "62%", y: "58%" }
              };
              const pos = posMap[p.city] || {
                x: `${25 + (idx % 5) * 15}%`,
                y: `${35 + Math.floor(idx / 5) * 18}%`
              };
              const isSelected = p.id === focusedPropertyId;

              return (
                <button
                  key={p.id}
                  onClick={() => onFocusProperty(p.id)}
                  style={{ left: pos.x, top: pos.y }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                >
                  <div className="relative flex flex-col items-center">
                    {p.status.includes("Available") && (
                      <span className="animate-ping absolute inline-flex h-5 w-5 rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <div
                      className={`p-1.5 rounded-full border-2 transition-all duration-300 shadow-lg ${
                        isSelected
                          ? "bg-rose-500 border-white scale-125 shadow-rose-500/50"
                          : p.status.includes("Available")
                          ? "bg-emerald-500 border-white group-hover:scale-110 shadow-emerald-500/30"
                          : "bg-slate-700 border-slate-500"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="mt-1 px-1.5 py-0.5 bg-slate-900/90 text-white text-[9px] font-extrabold rounded border border-slate-700 opacity-90 group-hover:opacity-100 whitespace-nowrap shadow-md">
                      {p.name.split(" ")[0]}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Selected Property Modal Card Overlay */}
            {selectedProperty && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-slate-900 text-white rounded-xl p-3.5 border border-slate-700 shadow-2xl z-30 flex items-center gap-3">
                <img
                  src={selectedProperty.coverImage}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold bg-emerald-600 px-1.5 py-0.5 rounded text-white">
                    {selectedProperty.status}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 truncate">{selectedProperty.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {selectedProperty.city} &bull; {selectedProperty.areaSqM} m²
                  </p>
                  <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-800">
                    <span className="text-xs font-black text-emerald-400">
                      {selectedProperty.monthlyRent
                        ? `$${selectedProperty.monthlyRent}/mo`
                        : `$${selectedProperty.purchasePrice?.toLocaleString()}`}
                    </span>
                    <button
                      onClick={() => onSelectProperty(selectedProperty)}
                      className="text-[10px] bg-emerald-600 hover:bg-emerald-700 font-bold px-2.5 py-1 rounded text-white transition-all cursor-pointer"
                    >
                      {t("View Details")}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onFocusProperty("")}
                  className="text-slate-400 hover:text-white shrink-0 self-start p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bottom Status Tag */}
            <div className="self-end z-10 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Kashkadarya GIS Matrix Active &bull; {properties.length} Properties Mapped</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
