"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  MapPin,
  ChevronRight,
  CheckCircle,
  User,
} from "lucide-react";
import { mockSpecialists } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/lib/store";
import {
  formatCurrency,
  formatDuration,
  getCategoryIcon,
  generateTimeSlots,
  getDayName,
  formatTime,
} from "@/lib/utils";
import type { Booking, Service } from "@/lib/types";

const STEPS = ["Service", "Date & Time", "Address", "Confirm"];

function generateNext14Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addBooking, addNotification, currentUser } = useAppStore();

  const specialist = mockSpecialists.find((s) => s.id === params.specialistId);
  const preselectedServiceId = searchParams.get("service");

  const [step, setStep] = useState(preselectedServiceId ? 1 : 0);
  const [selectedService, setSelectedService] = useState<Service | null>(
    preselectedServiceId
      ? specialist?.services.find((s) => s.id === preselectedServiceId) || null
      : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!specialist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Specialist not found</p>
      </div>
    );
  }

  const availableDays = generateNext14Days();

  const getAvailableSlots = (date: Date) => {
    const dayName = getDayName(date);
    const daySlots = specialist.availability[dayName];
    if (!daySlots || daySlots.length === 0) return [];

    const allSlots: string[] = [];
    daySlots.forEach((slot) => {
      const slots = generateTimeSlots(slot.start, slot.end, 30);
      allSlots.push(...slots);
    });
    return allSlots;
  };

  const isDayAvailable = (date: Date) => {
    const dayName = getDayName(date);
    const slots = specialist.availability[dayName];
    return slots && slots.length > 0;
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !address) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    // eslint-disable-next-line react-hooks/purity
    const bookingId = `b_${Math.random().toString(36).slice(2, 10)}`;
    const now = new Date().toISOString();
    const newBooking: Booking = {
      id: bookingId,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientAvatar: currentUser.avatar,
      specialistId: specialist.id,
      specialistName: specialist.name,
      specialistAvatar: specialist.avatar,
      service: selectedService,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      status: "pending",
      notes,
      address,
      totalAmount: selectedService.price,
      createdAt: now,
      updatedAt: now,
    };

    addBooking(newBooking);
    addNotification({
      // eslint-disable-next-line react-hooks/purity
      id: `n_${Math.random().toString(36).slice(2, 10)}`,
      userId: currentUser.id,
      title: "Booking Request Sent! 📅",
      message: `Your booking request for ${selectedService.name} with ${specialist.name} has been sent. Waiting for confirmation.`,
      type: "booking",
      read: false,
      createdAt: now,
      bookingId,
    });

    setIsSubmitting(false);
    router.push(`/booking-confirmation/${bookingId}`);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedService;
      case 1: return !!selectedDate && !!selectedTime;
      case 2: return address.trim().length > 5;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="font-bold text-gray-900">Book Appointment</h1>
            <p className="text-xs text-gray-500">with {specialist.name}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 ${
                    i < step ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`text-[10px] font-medium ${
                i === step ? "text-pink-600" : "text-gray-400"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Step 0: Select Service */}
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="font-bold text-gray-900 text-lg">Choose a Service</h2>
            {specialist.services.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedService(service)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  selectedService?.id === service.id
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getCategoryIcon(service.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDuration(service.duration)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-pink-600 text-lg">
                      {formatCurrency(service.price)}
                    </p>
                    {selectedService?.id === service.id && (
                      <CheckCircle className="w-5 h-5 text-pink-500 ml-auto mt-1" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Select Date & Time</h2>

            {/* Date Picker */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1 text-pink-500" />
                Choose Date
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDays.map((date) => {
                  const isAvailable = isDayAvailable(date);
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl min-w-[60px] transition-all ${
                        isSelected
                          ? "bg-pink-500 text-white"
                          : isAvailable
                          ? "bg-white border border-gray-200 text-gray-700"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-[10px] font-medium uppercase">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span className="text-lg font-bold">{date.getDate()}</span>
                      <span className="text-[10px]">
                        {date.toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      {isToday && (
                        <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? "text-white/80" : "text-pink-500"}`}>
                          Today
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1 text-pink-500" />
                  Available Times
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {getAvailableSlots(selectedDate).map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "bg-pink-500 text-white"
                          : "bg-white border border-gray-200 text-gray-700"
                      }`}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Your Address</h2>
            <p className="text-sm text-gray-500">
              The specialist will come to this address
            </p>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-pink-500" />
                <p className="font-semibold text-gray-900">Service Location</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200 focus:border-pink-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Atlanta"
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200 focus:border-pink-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="30301"
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200 focus:border-pink-400 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Special Instructions (optional)
                  </label>
                  <textarea
                    placeholder="Apartment number, gate code, parking instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-gray-200 focus:border-pink-400 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Saved Addresses */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Saved Addresses</p>
              <button
                onClick={() => setAddress("123 Client Street, Atlanta, GA 30301")}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200"
              >
                <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-pink-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Home</p>
                  <p className="text-xs text-gray-500">123 Client Street, Atlanta, GA</p>
                </div>
                <Badge variant="default" size="sm" className="ml-auto">Default</Badge>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedService && selectedDate && selectedTime && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">Confirm Booking</h2>

            {/* Specialist */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={specialist.avatar}
                  alt={specialist.name}
                  className="w-12 h-12 rounded-xl bg-pink-50"
                />
                <div>
                  <p className="font-semibold text-gray-900">{specialist.name}</p>
                  <p className="text-xs text-gray-500">
                    {specialist.specialties[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
              <h3 className="font-semibold text-gray-900">Booking Details</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-lg">{getCategoryIcon(selectedService.category)}</span>
                  <span className="text-sm">{selectedService.name}</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(selectedService.price)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-pink-400" />
                <span className="text-sm">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-pink-400" />
                <span className="text-sm">
                  {formatTime(selectedTime)} ({formatDuration(selectedService.duration)})
                </span>
              </div>

              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-pink-400 mt-0.5" />
                <span className="text-sm">{address}</span>
              </div>

              {notes && (
                <div className="flex items-start gap-2 text-gray-600">
                  <User className="w-4 h-4 text-pink-400 mt-0.5" />
                  <span className="text-sm">{notes}</span>
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{selectedService.name}</span>
                  <span className="text-gray-900">{formatCurrency(selectedService.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">{formatCurrency(selectedService.price * 0.05)}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-pink-600 text-lg">
                    {formatCurrency(selectedService.price * 1.05)}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-sm text-blue-700">
                <strong>How it works:</strong> Your booking request will be sent to{" "}
                {specialist.name}. Once confirmed, you&apos;ll be prompted to complete
                payment to finalize your appointment.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-50">
        {step < 3 ? (
          <Button
            fullWidth
            size="lg"
            disabled={!canProceed()}
            onClick={() => setStep(step + 1)}
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            fullWidth
            size="lg"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Send Booking Request
          </Button>
        )}
      </div>
    </div>
  );
}
