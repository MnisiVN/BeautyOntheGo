"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Trash2,
  CheckCircle,
  MapPin,
  Clock,
  Star,
  DollarSign,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { currentSpecialist } from "@/lib/mock-data";
import { formatCurrency, formatDuration, getCategoryIcon } from "@/lib/utils";

export default function SpecialistProfilePage() {
  const router = useRouter();
  const specialist = currentSpecialist;
  const [isAvailable, setIsAvailable] = useState(specialist.isAvailable);
  const [activeTab, setActiveTab] = useState<"profile" | "services" | "earnings">("profile");

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white font-bold text-xl">My Profile</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-20 h-20 rounded-2xl border-4 border-white/30 bg-white/20"
            />
            {specialist.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{specialist.name}</h2>
            <p className="text-white/70 text-sm">{specialist.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={specialist.rating} size="sm" showValue />
              <span className="text-white/60 text-xs">({specialist.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="mx-5 -mt-4 bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">Available for Bookings</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isAvailable ? "Clients can see and book you" : "Hidden from clients"}
          </p>
        </div>
        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`w-14 h-7 rounded-full transition-all ${
            isAvailable ? "bg-green-400" : "bg-gray-300"
          }`}
        >
          <span
            className={`block w-6 h-6 bg-white rounded-full shadow transition-transform mt-0.5 mx-0.5 ${
              isAvailable ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Tabs */}
      <div className="mx-5 mt-4">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {(["profile", "services", "earnings"] as const).map((tab) => (
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

      <div className="mx-5 mt-4 space-y-4">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
                <p className="text-xl font-bold gradient-text">{specialist.yearsExperience}+</p>
                <p className="text-xs text-gray-500">Years Exp.</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
                <p className="text-xl font-bold gradient-text">{specialist.reviewCount}</p>
                <p className="text-xs text-gray-500">Reviews</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
                <p className="text-xl font-bold gradient-text">{formatCurrency(specialist.priceRange.min)}</p>
                <p className="text-xs text-gray-500">From</p>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Bio</h3>
                <button className="text-pink-500">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{specialist.bio}</p>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Specialties</h3>
                <button className="text-pink-500">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialist.specialties.map((sp) => (
                  <Badge key={sp} variant="default">{sp}</Badge>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  Service Area
                </h3>
                <button className="text-pink-500">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">{specialist.location.address}</p>
              <p className="text-sm text-gray-600">{specialist.location.city}</p>
            </div>

            {/* Portfolio */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Portfolio</h3>
                <button className="flex items-center gap-1 text-pink-500 text-sm font-medium">
                  <Plus className="w-4 h-4" />
                  Add Photo
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {specialist.portfolio.map((img, i) => (
                  <div key={i} className="relative flex-shrink-0">
                    <img
                      src={img}
                      alt={`Portfolio ${i + 1}`}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                <button className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 flex-shrink-0">
                  <Plus className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-400">Add</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{specialist.services.length} services</p>
              <Button size="sm" variant="secondary">
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
            </div>
            {specialist.services.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getCategoryIcon(service.category)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                      <div className="flex items-center gap-2 mt-2">
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
                    <div className="flex gap-1 mt-1">
                      <button className="text-xs text-blue-500 font-medium">Edit</button>
                      <span className="text-gray-300">·</span>
                      <button className="text-xs text-red-500 font-medium">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Earnings Tab */}
        {activeTab === "earnings" && (
          <>
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Earnings Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-green-600 font-medium">This Month</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">$0</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium">Total Earned</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">$120</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Payout Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bank Account</p>
                    <p className="text-xs text-gray-500">••••••7890</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <Button size="sm" variant="outline" fullWidth>
                  <Plus className="w-4 h-4" />
                  Add Payout Method
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
