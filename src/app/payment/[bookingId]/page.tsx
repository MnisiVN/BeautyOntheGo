"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Lock,
  CheckCircle,
  Shield,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatShortDate, formatTime, getCategoryIcon } from "@/lib/utils";

type PaymentMethod = "card" | "mobile_money" | "bank_transfer";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings, updateBookingStatus, addNotification, currentUser } = useAppStore();

  const booking = bookings.find((b) => b.id === params.bookingId);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Booking not found</p>
      </div>
    );
  }

  const serviceFee = booking.totalAmount * 0.05;
  const total = booking.totalAmount + serviceFee;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));

    const now = new Date().toISOString();
    // eslint-disable-next-line react-hooks/purity
    const txnId = Math.random().toString(36).slice(2, 10).toUpperCase();
    setTransactionId(txnId);
    updateBookingStatus(booking.id, "paid");
    addNotification({
      // eslint-disable-next-line react-hooks/purity
      id: `n_${Math.random().toString(36).slice(2, 10)}`,
      userId: currentUser.id,
      title: "Payment Successful! ✅",
      message: `Payment of ${formatCurrency(total)} for ${booking.service.name} with ${booking.specialistName} was successful.`,
      type: "payment",
      read: false,
      createdAt: now,
      bookingId: booking.id,
    });

    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 text-sm mb-2">
            {formatCurrency(total)} paid to {booking.specialistName}
          </p>
          <p className="text-gray-400 text-xs mb-8">
            Your appointment is confirmed for {formatShortDate(booking.date)} at{" "}
            {formatTime(booking.time)}
          </p>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono font-bold text-gray-700">
              TXN_{transactionId}
            </p>
          </div>

          <Button fullWidth size="lg" onClick={() => router.push("/bookings")}>
            View My Bookings
          </Button>
          <button
            onClick={() => router.push("/")}
            className="mt-3 text-gray-500 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
          <div>
            <h1 className="font-bold text-gray-900">Complete Payment</h1>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-500" />
              <p className="text-xs text-green-600">Secure Payment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
            <img
              src={booking.specialistAvatar}
              alt={booking.specialistName}
              className="w-10 h-10 rounded-xl bg-pink-50"
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {booking.specialistName}
              </p>
              <p className="text-xs text-gray-500">{booking.service.name}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {getCategoryIcon(booking.service.category)} {booking.service.name}
              </span>
              <span className="text-gray-900">{formatCurrency(booking.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service fee (5%)</span>
              <span className="text-gray-900">{formatCurrency(serviceFee)}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-pink-600 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
          <div className="space-y-2">
            {[
              { id: "card" as PaymentMethod, icon: CreditCard, label: "Credit / Debit Card" },
              { id: "mobile_money" as PaymentMethod, icon: Smartphone, label: "Mobile Money" },
              { id: "bank_transfer" as PaymentMethod, icon: Building2, label: "Bank Transfer" },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === method.id
                      ? "border-pink-400 bg-pink-50"
                      : "border-gray-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      paymentMethod === method.id ? "bg-pink-100" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        paymentMethod === method.id ? "text-pink-600" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <span
                    className={`font-medium text-sm ${
                      paymentMethod === method.id ? "text-pink-700" : "text-gray-700"
                    }`}
                  >
                    {method.label}
                  </span>
                  {paymentMethod === method.id && (
                    <CheckCircle className="w-5 h-5 text-pink-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Form */}
        {paymentMethod === "card" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
            <h3 className="font-semibold text-gray-900">Card Details</h3>

            {/* Card Preview */}
            <div className="gradient-primary rounded-2xl p-4 text-white">
              <div className="flex justify-between items-start mb-6">
                <div className="w-8 h-6 bg-white/30 rounded" />
                <CreditCard className="w-6 h-6 text-white/70" />
              </div>
              <p className="font-mono text-lg tracking-widest mb-4">
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between">
                <div>
                  <p className="text-white/60 text-xs">Card Holder</p>
                  <p className="font-semibold text-sm">{cardName || "YOUR NAME"}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Expires</p>
                  <p className="font-semibold text-sm">{expiry || "MM/YY"}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-mono border border-gray-200 focus:border-pink-400 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-pink-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-pink-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-pink-400 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Money Form */}
        {paymentMethod === "mobile_money" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
            <h3 className="font-semibold text-gray-900">Mobile Money</h3>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="+1 555 000 0000"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm border border-gray-200 focus:border-pink-400 outline-none"
              />
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-700">
                You will receive a prompt on your phone to authorize the payment of{" "}
                <strong>{formatCurrency(total)}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Bank Transfer */}
        {paymentMethod === "bank_transfer" && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
            <h3 className="font-semibold text-gray-900">Bank Transfer Details</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Bank Name", value: "GlowUp Payments Bank" },
                { label: "Account Name", value: "GlowUp Services LLC" },
                { label: "Account Number", value: "1234567890" },
                { label: "Routing Number", value: "021000021" },
                { label: "Reference", value: booking.id.toUpperCase() },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-2 justify-center text-xs text-gray-400">
          <Shield className="w-4 h-4 text-green-500" />
          <span>256-bit SSL encrypted · PCI DSS compliant</span>
        </div>
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 px-5 py-4 z-50">
        <Button
          fullWidth
          size="lg"
          loading={isProcessing}
          onClick={handlePayment}
        >
          <Lock className="w-4 h-4" />
          Pay {formatCurrency(total)}
        </Button>
      </div>
    </div>
  );
}
