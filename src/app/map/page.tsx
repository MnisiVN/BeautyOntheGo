"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { List, Map, Search, SlidersHorizontal } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { SpecialistCard } from "@/components/SpecialistCard";
import { mockSpecialists } from "@/lib/mock-data";
import { getCategoryIcon, getCategoryLabel, SERVICE_CATEGORIES } from "@/lib/utils";
import type { ServiceCategory } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView").then((m) => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpecialists = mockSpecialists.filter((s) => {
    const matchesCategory = !selectedCategory || s.services.some((svc) => svc.category === selectedCategory);
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.specialties.some((sp) => sp.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-3 z-40 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-bold text-gray-900 text-xl">Nearby Specialists</h1>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "map"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5 mb-3">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search specialists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedCategory ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            All
          </button>
          {SERVICE_CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span>{getCategoryIcon(cat)}</span>
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Map or List View */}
      {viewMode === "map" ? (
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          <MapView specialists={filteredSpecialists} />

          {/* Specialist count overlay */}
          <div className="absolute top-3 left-3 bg-white rounded-xl px-3 py-1.5 shadow-md z-[999]">
            <p className="text-xs font-semibold text-gray-700">
              {filteredSpecialists.length} specialists nearby
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 py-4 pb-24">
          <p className="text-sm text-gray-500 mb-2">
            <span className="font-semibold text-gray-900">{filteredSpecialists.length}</span> specialists found
          </p>
          {filteredSpecialists.map((specialist) => (
            <SpecialistCard key={specialist.id} specialist={specialist} />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
