"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  MapPin,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Star,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { SpecialistCard } from "@/components/SpecialistCard";
import { Badge } from "@/components/ui/Badge";
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
      <div className="gradient-primary px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
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
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
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

      {/* View toggle */}
      <div className="px-5 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Viewing as:</p>
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setCurrentView("client")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                !isSpecialistView
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Client
            </button>
            <button
              onClick={() => setCurrentView("specialist")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isSpecialistView
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              Specialist
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-6">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">Services</h2>
            <Link href="/browse" className="text-pink-600 text-sm font-medium flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {featuredCategories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
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

        {/* Top Rated Banner */}
        <section>
          <div className="gradient-primary rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white/80 text-xs font-medium">TOP RATED</span>
              </div>
              <h3 className="text-white font-bold text-base">
                Best Specialists Near You
              </h3>
              <p className="text-white/70 text-xs mt-0.5">
                Verified professionals at your doorstep
              </p>
            </div>
            <div className="flex -space-x-2">
              {topRatedSpecialists.map((s) => (
                <img
                  key={s.id}
                  src={s.avatar}
                  alt={s.name}
                  className="w-10 h-10 rounded-full border-2 border-white bg-white/20"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Specialists */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">
              {selectedCategory
                ? `${getCategoryLabel(selectedCategory)} Specialists`
                : "Featured Specialists"}
            </h2>
            <Link href="/browse" className="text-pink-600 text-sm font-medium flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {filteredSpecialists.map((specialist) => (
              <SpecialistCard key={specialist.id} specialist={specialist} />
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
            <p className="text-2xl font-bold gradient-text">50+</p>
            <p className="text-xs text-gray-500 mt-0.5">Specialists</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
            <div className="flex items-center justify-center gap-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <p className="text-2xl font-bold gradient-text">4.9</p>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Avg Rating</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
            <p className="text-2xl font-bold gradient-text">1K+</p>
            <p className="text-xs text-gray-500 mt-0.5">Bookings</p>
          </div>
        </section>

        {/* Promo Banner */}
        <section>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4">
            <Badge variant="default" size="sm" className="bg-white/20 text-white mb-2">
              🎉 New User Offer
            </Badge>
            <h3 className="text-white font-bold text-base">
              Get 20% off your first booking!
            </h3>
            <p className="text-white/80 text-xs mt-1 mb-3">
              Use code: GLOWUP20 at checkout
            </p>
            <Link
              href="/browse"
              className="inline-block bg-white text-pink-600 text-sm font-bold px-4 py-2 rounded-xl"
            >
              Book Now
            </Link>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
