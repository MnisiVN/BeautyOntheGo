"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, ChevronRight, Star } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import {
  formatCurrency,
  formatShortDate,
  formatTime,
  getStatusColor,
  getStatusLabel,
  getCategoryIcon,
} from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";

const STATUS_TABS: { label: string; statuses: BookingStatus[] }[] = [
  { label: "All", statuses: [] },
  { label: "Upcoming", statuses: ["pending", "confirmed", "payment_pending", "paid"] },
  { label: "Completed", statuses: ["completed"] },
  { label: "Cancelled", statuses: ["declined", "cancelled"] },
];

export default function BookingsPage() {
  const router = useRouter();
  const { bookings, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);

  const clientBookings = bookings.filter((b) => b.clientId === currentUser.id);

  const filteredBookings =
    STATUS_TABS[activeTab].statuses.length === 0
      ? clientBookings
      : clientBookings.filter((b) =>
          STATUS_TABS[activeTab].statuses.includes(b.status)
        );

  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <h1 className="font-bold text-gray-900 text-xl mb-4">My Bookings</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === i
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        {sortedBookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📅</p>
            <h3 className="font-bold text-gray-900 text-lg mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Book your first beauty appointment today!
            </p>
            <Button onClick={() => router.push("/browse")}>
              Browse Specialists
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                {/* Status Bar */}
                <div
                  className={`px-4 py-2 flex items-center justify-between ${getStatusColor(booking.status)}`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {getStatusLabel(booking.status)}
                  </span>
                  <span className="text-xs">
                    {formatShortDate(booking.createdAt)}
                  </span>
                </div>

                <div className="p-4">
                  {/* Specialist Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={booking.specialistAvatar}
                      alt={booking.specialistName}
                      className="w-12 h-12 rounded-xl bg-pink-50"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{booking.specialistName}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">
                          {getCategoryIcon(booking.service.category)}
                        </span>
                        <p className="text-sm text-gray-600">{booking.service.name}</p>
                      </div>
                    </div>
                    <p className="font-bold text-pink-600">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      {formatShortDate(booking.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {formatTime(booking.time)}
                    </div>
                    <div className="flex items-center gap-1 flex-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        fullWidth
                        onClick={() => router.push(`/payment/${booking.id}`)}
                      >
                        Pay Now
                      </Button>
                    )}
                    {booking.status === "completed" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        fullWidth
                        onClick={() => router.push(`/review/${booking.id}`)}
                      >
                        <Star className="w-4 h-4" />
                        Leave Review
                      </Button>
                    )}
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {}}
                      >
                        Cancel
                      </Button>
                    )}
                    <button
                      onClick={() => router.push(`/booking-detail/${booking.id}`)}
                      className="flex items-center gap-1 text-xs text-gray-500 ml-auto"
                    >
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
