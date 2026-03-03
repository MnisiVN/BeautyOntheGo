"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Star, MapPin } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { SpecialistCard } from "@/components/SpecialistCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { mockSpecialists } from "@/lib/mock-data";
import { getCategoryIcon, getCategoryLabel, SERVICE_CATEGORIES } from "@/lib/utils";
import type { ServiceCategory } from "@/lib/types";

const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "reviews", label: "Most Reviews" },
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);

  const filteredSpecialists = useMemo(() => {
    let results = [...mockSpecialists];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.specialties.some((sp) => sp.toLowerCase().includes(query)) ||
          s.services.some((svc) => svc.name.toLowerCase().includes(query)) ||
          s.location.city.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      results = results.filter((s) =>
        s.services.some((svc) => svc.category === selectedCategory)
      );
    }

    // Rating filter
    if (minRating > 0) {
      results = results.filter((s) => s.rating >= minRating);
    }

    // Availability filter
    if (availableOnly) {
      results = results.filter((s) => s.isAvailable);
    }

    // Price filter
    results = results.filter((s) => s.priceRange.min <= maxPrice);

    // Sort
    switch (sortBy) {
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "price_low":
        results.sort((a, b) => a.priceRange.min - b.priceRange.min);
        break;
      case "price_high":
        results.sort((a, b) => b.priceRange.max - a.priceRange.max);
        break;
      case "reviews":
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return results;
  }, [searchQuery, selectedCategory, sortBy, minRating, availableOnly, maxPrice]);

  const activeFilterCount = [
    selectedCategory,
    minRating > 0,
    availableOnly,
    maxPrice < 500,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory(null);
    setMinRating(0);
    setAvailableOnly(false);
    setMaxPrice(500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 sticky top-0 z-40 shadow-sm">
        <h1 className="font-bold text-gray-900 text-xl mb-4">Find Specialists</h1>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-3">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              showFilters || activeFilterCount > 0
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Category pills - horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-5 px-5">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            All
          </button>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 px-5 py-5 space-y-5">
          {/* Sort */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Sort By</p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    sortBy === opt.value
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Minimum Rating: {minRating > 0 ? `${minRating}+` : "Any"}
            </p>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    minRating === rating
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {rating === 0 ? (
                    "Any"
                  ) : (
                    <>
                      <Star className="w-3 h-3" />
                      {rating}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Max Price: ${maxPrice === 500 ? "Any" : maxPrice}
            </p>
            <input
              type="range"
              min={25}
              max={500}
              step={25}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>$25</span>
              <span>$500+</span>
            </div>
          </div>

          {/* Available Only */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Available Today Only</p>
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`w-12 h-6 rounded-full transition-all ${
                availableOnly ? "bg-pink-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${
                  availableOnly ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-pink-600 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filteredSpecialists.length}</span>{" "}
            specialists found
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-pink-600 font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>

        {filteredSpecialists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="font-semibold text-gray-900 mb-1">No specialists found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                clearFilters();
              }}
              className="mt-4 text-pink-600 font-medium text-sm"
            >
              Reset all
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSpecialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
