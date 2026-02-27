"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, XCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAppStore } from "@/lib/store";
import { currentSpecialist } from "@/lib/mock-data";
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
  { label: "Pending", statuses: ["pending"] },
  { label: "Confirmed", statuses: ["confirmed", "paid"] },
  { label: "Completed", statuses: ["completed"] },
  { label: "Declined", statuses: ["declined", "cancelled"] },
];

export default function SpecialistBookingsPage() {
  const router = useRouter();
  const { bookings, updateBookingStatus, addNotification } = useAppStore();
  const [activeTab, setActiveTab] = useState(0);

  const specialist = currentSpecialist;
  const specialistBookings = bookings.filter((b) => b.specialistId === specialist.id);

  const filteredBookings =
    STATUS_TABS[activeTab].statuses.length === 0
      ? specialistBookings
      : specialistBookings.filter((b) =>
          STATUS_TABS[activeTab].statuses.includes(b.status)
        );

  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleConfirm = (bookingId: string) => {
    updateBookingStatus(bookingId, "confirmed");
    addNotification({
      id: `n_${Math.random().toString(36).slice(2, 10)}`,
      userId: "client1",
      title: "Booking Confirmed! 🎉",
      message: `${specialist.name} confirmed your booking. Please complete payment to finalize.`,
      type: "booking",
      read: false,
      createdAt: new Date().toISOString(),
      bookingId,
    });
  };

  const handleDecline = (bookingId: string) => {
    updateBookingStatus(bookingId, "declined");
  };

  const handleComplete = (bookingId: string) => {
    updateBookingStatus(bookingId, "completed");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-gray-900 text-xl">All Bookings</h1>
        </div>

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
            <p className="text-5xl mb-4">📋</p>
            <h3 className="font-bold text-gray-900 text-lg mb-2">No bookings</h3>
            <p className="text-gray-500 text-sm">
              No bookings in this category yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <div
                  className={`px-4 py-2 flex items-center justify-between ${getStatusColor(booking.status)}`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {getStatusLabel(booking.status)}
                  </span>
                  <span className="text-xs">{formatShortDate(booking.date)}</span>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={booking.clientAvatar}
                      alt={booking.clientName}
                      className="w-12 h-12 rounded-xl bg-pink-50"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{booking.clientName}</p>
                      <div className="flex items-center gap-1.5">
                        <span>{getCategoryIcon(booking.service.category)}</span>
                        <p className="text-sm text-gray-600">{booking.service.name}</p>
                      </div>
                    </div>
                    <p className="font-bold text-pink-600">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-pink-400" />
                      {formatShortDate(booking.date)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {formatTime(booking.time)}
                    </div>
                  </div>

                  {booking.address && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      {booking.address}
                    </div>
                  )}

                  {/* Actions based on status */}
                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecline(booking.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleConfirm(booking.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </button>
                    </div>
                  )}

                  {(booking.status === "confirmed" || booking.status === "paid") && (
                    <button
                      onClick={() => handleComplete(booking.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Completed
                    </button>
                  )}
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
