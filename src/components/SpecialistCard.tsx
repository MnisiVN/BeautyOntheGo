"use client";

import { MapPin, Clock, CheckCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { formatCurrency, getCategoryIcon } from "@/lib/utils";
import type { Specialist } from "@/lib/types";
import Link from "next/link";

interface SpecialistCardProps {
  specialist: Specialist;
  compact?: boolean;
}

export function SpecialistCard({ specialist, compact = false }: SpecialistCardProps) {
  if (compact) {
    return (
      <Link href={`/specialist/${specialist.id}`}>
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 card-hover">
          <div className="relative flex-shrink-0">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-14 h-14 rounded-xl object-cover bg-pink-50"
            />
            {specialist.isAvailable && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white pulse-dot" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-semibold text-gray-900 text-sm truncate">{specialist.name}</p>
              {specialist.verified && (
                <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {specialist.specialties.slice(0, 2).join(" · ")}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={specialist.rating} size="sm" showValue />
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-pink-600 font-medium">
                From {formatCurrency(specialist.priceRange.min)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/specialist/${specialist.id}`}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
        {/* Header with gradient */}
        <div className="gradient-primary p-4 pb-8 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={specialist.avatar}
                  alt={specialist.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 bg-white/20"
                />
                {specialist.isAvailable && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white pulse-dot" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-white text-base">{specialist.name}</h3>
                  {specialist.verified && (
                    <CheckCircle className="w-4 h-4 text-blue-200" />
                  )}
                </div>
                <p className="text-white/80 text-xs mt-0.5">
                  {specialist.yearsExperience} years experience
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span className="text-white text-xs font-semibold">{specialist.rating}</span>
                  <span className="text-white/70 text-xs">({specialist.reviewCount})</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">From</p>
              <p className="text-white font-bold text-lg">
                {formatCurrency(specialist.priceRange.min)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 -mt-4">
          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {specialist.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="default" size="sm">
                {specialty}
              </Badge>
            ))}
            {specialist.specialties.length > 3 && (
              <Badge variant="outline" size="sm">
                +{specialist.specialties.length - 3}
              </Badge>
            )}
          </div>

          {/* Services preview */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {specialist.services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="flex-shrink-0 bg-gray-50 rounded-xl px-3 py-2 text-center"
              >
                <p className="text-lg">{getCategoryIcon(service.category)}</p>
                <p className="text-xs font-medium text-gray-700 mt-0.5 whitespace-nowrap">
                  {service.name}
                </p>
                <p className="text-xs text-pink-600 font-semibold">
                  {formatCurrency(service.price)}
                </p>
              </div>
            ))}
          </div>

          {/* Location & availability */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span>{specialist.location.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span
                className={
                  specialist.isAvailable ? "text-green-600 font-medium" : "text-gray-400"
                }
              >
                {specialist.isAvailable ? "Available today" : "Not available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
