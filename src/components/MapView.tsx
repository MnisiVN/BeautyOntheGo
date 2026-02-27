"use client";

import { useEffect, useRef, useState } from "react";
import type { Specialist } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Star, X, MapPin, CheckCircle } from "lucide-react";

interface MapViewProps {
  specialists: Specialist[];
}

export function MapView({ specialists }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default icon issue
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [33.749, -84.388],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add zoom control to top right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add markers for each specialist
      specialists.forEach((specialist) => {
        const isAvailable = specialist.isAvailable;

        const markerHtml = `
          <div style="
            background: ${isAvailable ? "linear-gradient(135deg, #d946a8, #7c3aed)" : "#9ca3af"};
            color: white;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            border: 2px solid white;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span style="font-size: 14px;">${specialist.services[0] ? getEmojiForCategory(specialist.services[0].category) : "💅"}</span>
            <span>$${specialist.priceRange.min}</span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: "",
          iconAnchor: [40, 20],
        });

        const marker = L.marker(
          [specialist.location.lat, specialist.location.lng],
          { icon: customIcon }
        ).addTo(map);

        marker.on("click", () => {
          setSelectedSpecialist(specialist);
        });
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [specialists]);

  return (
    <div className="relative w-full h-full">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />

      <div ref={mapRef} className="w-full h-full" />

      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}

      {/* Selected Specialist Card */}
      {selectedSpecialist && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 slide-up z-[1000]">
          <button
            onClick={() => setSelectedSpecialist(null)}
            className="absolute top-3 right-3 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedSpecialist.avatar}
                alt={selectedSpecialist.name}
                className="w-14 h-14 rounded-xl object-cover bg-pink-50"
              />
              {selectedSpecialist.isAvailable && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-gray-900">{selectedSpecialist.name}</h3>
                {selectedSpecialist.verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {selectedSpecialist.specialties.slice(0, 2).join(" · ")}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold text-gray-700">
                    {selectedSpecialist.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-400">·</span>
                <div className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span className="text-xs text-gray-500">
                    {selectedSpecialist.location.city}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">From</p>
              <p className="font-bold text-pink-600">
                {formatCurrency(selectedSpecialist.priceRange.min)}
              </p>
            </div>
          </div>

          <Link
            href={`/specialist/${selectedSpecialist.id}`}
            className="mt-3 block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center py-2.5 rounded-xl font-semibold text-sm"
          >
            View Profile & Book
          </Link>
        </div>
      )}
    </div>
  );
}

function getEmojiForCategory(category: string): string {
  const map: Record<string, string> = {
    hair: "✂️",
    nails: "💅",
    makeup: "💄",
    skincare: "🧴",
    massage: "💆",
    eyebrows: "👁️",
    lashes: "👁️",
    waxing: "✨",
    other: "💫",
  };
  return map[category] || "💫";
}
