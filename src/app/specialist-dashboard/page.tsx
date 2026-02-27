"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Bell,
  Settings,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/Badge";
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

export default function SpecialistDashboardPage() {
  const router = useRouter();
  const { bookings, updateBookingStatus, addNotification, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const specialist = currentSpecialist;

  // Get bookings for this specialist
  const specialistBookings = bookings.filter(
    (b) => b.specialistId === specialist.id
  );

  const pendingBookings = specialistBookings.filter((b) => b.status === "pending");
  const confirmedBookings = specialistBookings.filter((b) => b.status === "confirmed" || b.status === "paid");
  const completedBookings = specialistBookings.filter((b) => b.status === "completed");

  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const thisMonthEarnings = completedBookings
    .filter((b) => {
      const bookingDate = new Date(b.date);
      const now = new Date();
      return (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleConfirm = (bookingId: string, _clientName: string) => {
    updateBookingStatus(bookingId, "confirmed");
    addNotification({
      // eslint-disable-next-line react-hooks/purity
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
    addNotification({
      // eslint-disable-next-line react-hooks/purity
      id: `n_${Math.random().toString(36).slice(2, 10)}`,
      userId: "client1",
      title: "Booking Declined",
      message: `${specialist.name} is unable to accept your booking request. Please try another specialist.`,
      type: "booking",
      read: false,
      createdAt: new Date().toISOString(),
      bookingId,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm">Welcome back 👋</p>
            <h1 className="text-white font-bold text-xl">{specialist.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/specialist-dashboard/notifications")}
              className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <p className="text-white font-bold text-xl">{pendingBookings.length}</p>
            <p className="text-white/70 text-xs">Pending</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <p className="text-white font-bold text-xl">{confirmedBookings.length}</p>
            <p className="text-white/70 text-xs">Confirmed</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-3 text-center">
            <p className="text-white font-bold text-xl">{completedBookings.length}</p>
            <p className="text-white/70 text-xs">Completed</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Earnings Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Earnings</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(thisMonthEarnings)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalEarnings)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{specialist.rating}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{specialist.reviewCount}</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingBookings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">
                Pending Requests
                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingBookings.length}
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {pendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-yellow-200 overflow-hidden shadow-sm"
                >
                  <div className="bg-yellow-50 px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-700 uppercase">
                      New Request
                    </span>
                    <span className="text-xs text-yellow-600">
                      {formatShortDate(booking.createdAt)}
                    </span>
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

                    {booking.notes && (
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 mb-3">
                        📝 {booking.notes}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecline(booking.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-semibold text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleConfirm(booking.id, booking.clientName)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Bookings */}
        {confirmedBookings.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900">Upcoming</h2>
              <button
                onClick={() => router.push("/specialist-dashboard/bookings")}
                className="text-pink-600 text-sm font-medium flex items-center gap-1"
              >
                See all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {confirmedBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.clientAvatar}
                      alt={booking.clientName}
                      className="w-10 h-10 rounded-xl bg-pink-50"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {booking.clientName}
                      </p>
                      <p className="text-xs text-gray-500">{booking.service.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-700">
                        {formatShortDate(booking.date)}
                      </p>
                      <p className="text-xs text-gray-500">{formatTime(booking.time)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Availability Toggle */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Availability Status</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {specialist.isAvailable
                  ? "You're visible to clients"
                  : "You're hidden from clients"}
              </p>
            </div>
            <div
              className={`w-14 h-7 rounded-full transition-all cursor-pointer ${
                specialist.isAvailable ? "bg-green-400" : "bg-gray-300"
              }`}
            >
              <span
                className={`block w-6 h-6 bg-white rounded-full shadow transition-transform mt-0.5 mx-0.5 ${
                  specialist.isAvailable ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
