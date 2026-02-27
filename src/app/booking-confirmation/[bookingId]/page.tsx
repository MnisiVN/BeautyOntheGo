"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Calendar, Clock, MapPin, ArrowRight, Home } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatTime, formatDate, getCategoryIcon } from "@/lib/utils";

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings } = useAppStore();

  const booking = bookings.find((b) => b.id === params.bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <h2 className="font-bold text-gray-900 mb-2">Booking not found</h2>
          <button onClick={() => router.push("/")} className="text-pink-600 font-medium">
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Success Animation */}
      <div className="gradient-primary px-5 pt-16 pb-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-white font-bold text-2xl mb-2">Request Sent! 🎉</h1>
        <p className="text-white/80 text-sm max-w-xs">
          Your booking request has been sent to {booking.specialistName}. You&apos;ll be
          notified once they confirm.
        </p>
      </div>

      <div className="px-5 py-6 space-y-4 flex-1">
        {/* Booking Summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <img
              src={booking.specialistAvatar}
              alt={booking.specialistName}
              className="w-12 h-12 rounded-xl bg-pink-50"
            />
            <div>
              <p className="font-bold text-gray-900">{booking.specialistName}</p>
              <p className="text-xs text-gray-500">{booking.service.name}</p>
            </div>
            <div className="ml-auto">
              <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                Pending
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                <span className="text-base">{getCategoryIcon(booking.service.category)}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Service</p>
                <p className="text-sm font-semibold text-gray-900">{booking.service.name}</p>
              </div>
              <p className="ml-auto font-bold text-pink-600">
                {formatCurrency(booking.totalAmount)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(booking.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatTime(booking.time)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-semibold text-gray-900">{booking.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
          <div className="space-y-3">
            {[
              {
                step: "1",
                title: "Specialist Reviews",
                desc: `${booking.specialistName} will review your request`,
                color: "bg-yellow-100 text-yellow-700",
              },
              {
                step: "2",
                title: "Confirmation",
                desc: "You'll receive a notification when confirmed",
                color: "bg-blue-100 text-blue-700",
              },
              {
                step: "3",
                title: "Make Payment",
                desc: "Complete payment to finalize your booking",
                color: "bg-purple-100 text-purple-700",
              },
              {
                step: "4",
                title: "Enjoy Your Service",
                desc: "Specialist arrives at your location",
                color: "bg-green-100 text-green-700",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.color}`}
                >
                  {item.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking ID */}
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Booking Reference</p>
          <p className="font-mono font-bold text-gray-700 text-sm mt-0.5">
            #{booking.id.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-8 space-y-3">
        <Button
          fullWidth
          size="lg"
          onClick={() => router.push("/bookings")}
        >
          View My Bookings
          <ArrowRight className="w-5 h-5" />
        </Button>
        <Button
          fullWidth
          size="lg"
          variant="outline"
          onClick={() => router.push("/")}
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
