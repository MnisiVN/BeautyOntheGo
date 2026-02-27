"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Share2,
  Heart,
  ChevronRight,
  Calendar,
  MessageCircle,
  Shield,
} from "lucide-react";
import { mockSpecialists, mockReviews } from "@/lib/mock-data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import {
  formatCurrency,
  formatDuration,
  getCategoryIcon,
  getCategoryLabel,
} from "@/lib/utils";

const DAY_LABELS = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export default function SpecialistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"services" | "reviews" | "about">("services");
  const [liked, setLiked] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const specialist = mockSpecialists.find((s) => s.id === params.id);
  const reviews = mockReviews.filter((r) => r.specialistId === params.id);

  if (!specialist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <h2 className="font-bold text-gray-900 mb-2">Specialist not found</h2>
          <button
            onClick={() => router.back()}
            className="text-pink-600 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    if (selectedService) {
      router.push(`/booking/${specialist.id}?service=${selectedService}`);
    } else {
      router.push(`/booking/${specialist.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero */}
      <div className="relative">
        <div className="gradient-primary h-48" />

        {/* Back & Actions */}
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 ${liked ? "fill-red-400 text-red-400" : "text-white"}`}
              />
            </button>
            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="mx-5 -mt-16 bg-white rounded-3xl shadow-lg p-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={specialist.avatar}
                alt={specialist.name}
                className="w-20 h-20 rounded-2xl object-cover bg-pink-50 border-4 border-white shadow-md"
              />
              {specialist.isAvailable && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white pulse-dot" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-gray-900 text-lg">{specialist.name}</h1>
                {specialist.verified && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {specialist.specialties.slice(0, 2).join(" · ")}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-gray-900 text-sm">
                    {specialist.rating}
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({specialist.reviewCount})
                  </span>
                </div>
                <span className="text-gray-300">·</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-gray-500 text-xs">
                    {specialist.location.city}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">
                {specialist.yearsExperience}+
              </p>
              <p className="text-xs text-gray-500">Years Exp.</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="font-bold text-gray-900 text-lg">
                {specialist.reviewCount}
              </p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-lg">
                {formatCurrency(specialist.priceRange.min)}
              </p>
              <p className="text-xs text-gray-500">From</p>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Badge */}
      <div className="mx-5 mt-3">
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${
            specialist.isAvailable
              ? "bg-green-50 border border-green-200"
              : "bg-gray-50 border border-gray-200"
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              specialist.isAvailable ? "bg-green-400 pulse-dot" : "bg-gray-400"
            }`}
          />
          <p
            className={`text-sm font-medium ${
              specialist.isAvailable ? "text-green-700" : "text-gray-500"
            }`}
          >
            {specialist.isAvailable
              ? "Available for bookings today"
              : "Not available today"}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-5 mt-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {(["services", "reviews", "about"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-5 mt-4">
        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-3">
            {specialist.services.map((service) => (
              <button
                key={service.id}
                onClick={() =>
                  setSelectedService(
                    selectedService === service.id ? null : service.id
                  )
                }
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  selectedService === service.id
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">
                      {getCategoryIcon(service.category)}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" size="sm">
                          {getCategoryLabel(service.category)}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatDuration(service.duration)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600 text-lg">
                      {formatCurrency(service.price)}
                    </p>
                    {selectedService === service.id && (
                      <span className="text-xs text-pink-500 font-medium">Selected ✓</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {/* Rating Summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold gradient-text">
                    {specialist.rating}
                  </p>
                  <StarRating rating={specialist.rating} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">
                    {specialist.reviewCount} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : star === 5 ? 80 : star === 4 ? 15 : 5;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-3">{star}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-amber-400 h-1.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Review List */}
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={review.clientAvatar}
                      alt={review.clientName}
                      className="w-10 h-10 rounded-full bg-pink-50"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {review.clientName}
                      </p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="ml-auto text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">⭐</p>
                <p className="text-gray-500 text-sm">No reviews yet</p>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-4">
            {/* Bio */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{specialist.bio}</p>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {specialist.specialties.map((sp) => (
                  <Badge key={sp} variant="default">{sp}</Badge>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-500" />
                Weekly Availability
              </h3>
              <div className="space-y-2">
                {Object.entries(specialist.availability).map(([day, slots]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-10">
                      {DAY_LABELS[day as keyof typeof DAY_LABELS]}
                    </span>
                    {slots.length > 0 ? (
                      <div className="flex gap-2">
                        {(slots as import("@/lib/types").TimeSlot[]).map((slot, i) => (
                          <span
                            key={i}
                            className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded-lg font-medium"
                          >
                            {slot.start} - {slot.end}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not available</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-500" />
                Service Area
              </h3>
              <p className="text-sm text-gray-600">{specialist.location.address}</p>
              <p className="text-sm text-gray-600">{specialist.location.city}</p>
            </div>

            {/* Trust & Safety */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Trust & Safety
              </h3>
              <div className="space-y-2">
                {specialist.verified && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Identity Verified</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Background Check Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Licensed Professional</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio */}
      {specialist.portfolio.length > 0 && activeTab === "about" && (
        <div className="mx-5 mt-4">
          <h3 className="font-semibold text-gray-900 mb-3">Portfolio</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {specialist.portfolio.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Portfolio ${i + 1}`}
                className="w-28 h-28 rounded-2xl object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      {/* Book Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-50">
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 border-2 border-gray-200 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-gray-500" />
          </button>
          <Button
            fullWidth
            size="lg"
            onClick={handleBookNow}
            disabled={!specialist.isAvailable}
          >
            {specialist.isAvailable
              ? selectedService
                ? "Book Selected Service"
                : "Book Appointment"
              : "Not Available"}
          </Button>
        </div>
      </div>
    </div>
  );
}
