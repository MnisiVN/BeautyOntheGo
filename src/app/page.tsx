"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  MapPin,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { SpecialistCard } from "@/components/SpecialistCard";
import { useAppStore } from "@/lib/store";
import { mockSpecialists } from "@/lib/mock-data";
import { getCategoryIcon, getCategoryLabel, SERVICE_CATEGORIES } from "@/lib/utils";
import type { ServiceCategory } from "@/lib/types";

const featuredCategories: ServiceCategory[] = ["hair", "nails", "makeup", "massage", "skincare", "lashes"];

export default function HomePage() {
  const { currentUser, notifications, currentView, setCurrentView } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const isSpecialistView = currentView === "specialist";

  const topRatedSpecialists = mockSpecialists
    .filter((s) => s.isAvailable)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const filteredSpecialists = selectedCategory
    ? mockSpecialists.filter((s) =>
        s.services.some((svc) => svc.category === selectedCategory)
      )
    : mockSpecialists.slice(0, 4);

  if (isSpecialistView) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Specialist Mode</h2>
          <p className="text-gray-500 text-sm mb-6">
            You&apos;re viewing as a specialist. Switch to client mode to browse.
          </p>
          <button
            onClick={() => setCurrentView("client")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Switch to Client View
          </button>
          <div className="mt-4">
            <Link
              href="/specialist-dashboard"
              className="text-pink-600 font-medium text-sm"
            >
              Go to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white/80 text-sm">Good morning 👋</p>
            <h1 className="text-white font-bold text-xl">{currentUser.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications" className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link href="/profile">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20"
              />
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <Link href="/browse">
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-lg">
            <Search className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm flex-1">
              Search specialists, services...
            </span>
            <div className="flex items-center gap-1 bg-pink-50 px-2 py-1 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-pink-600 text-xs font-medium">Atlanta</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Categories - Horizontal scroll */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-base">Services</h2>
            <Link href="/browse" className="text-pink-600 text-sm font-medium flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {featuredCategories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all min-w-[90px] ${
                  selectedCategory === category
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <span className="text-xs font-medium text-gray-700">
                  {getCategoryLabel(category)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Specialists */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-base">
              {selectedCategory
                ? `${getCategoryLabel(selectedCategory)} Specialists`
                : "Featured Specialists"}
            </h2>
            <Link href="/browse" className="text-pink-600 text-sm font-medium flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-10 p-2">
            {filteredSpecialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
