"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Send } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";

const REVIEW_PROMPTS = [
  "Professional & skilled",
  "On time",
  "Great results",
  "Clean & hygienic",
  "Friendly",
  "Worth the price",
];

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings, updateBookingStatus } = useAppStore();

  const booking = bookings.find((b) => b.id === params.bookingId);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Booking not found</p>
      </div>
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getRatingLabel = (r: number) => {
    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent!"];
    return labels[r] || "";
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    router.push("/bookings");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="font-bold text-gray-900">Leave a Review</h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Specialist Info */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
          <img
            src={booking.specialistAvatar}
            alt={booking.specialistName}
            className="w-14 h-14 rounded-xl bg-pink-50"
          />
          <div>
            <p className="font-bold text-gray-900">{booking.specialistName}</p>
            <p className="text-sm text-gray-500">{booking.service.name}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="font-semibold text-gray-900 mb-4">How was your experience?</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-125 active:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-all ${
                    star <= (hoveredRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {(hoveredRating || rating) > 0 && (
            <p className="text-lg font-bold gradient-text">
              {getRatingLabel(hoveredRating || rating)}
            </p>
          )}
        </div>

        {/* Quick Tags */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="font-semibold text-gray-900 mb-3">What did you love?</p>
          <div className="flex flex-wrap gap-2">
            {REVIEW_PROMPTS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {selectedTags.includes(tag) ? "✓ " : ""}{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="font-semibold text-gray-900 mb-3">Write a review</p>
          <textarea
            placeholder="Share your experience to help others find great specialists..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200 focus:border-pink-400 outline-none resize-none"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {comment.length}/500
          </p>
        </div>

        {/* Tip */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-sm text-amber-700">
            💡 Your review helps other clients find great specialists and helps
            specialists improve their services.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-50">
        <Button
          fullWidth
          size="lg"
          loading={isSubmitting}
          disabled={rating === 0}
          onClick={handleSubmit}
        >
          <Send className="w-5 h-5" />
          Submit Review
        </Button>
      </div>
    </div>
  );
}
