"use client";

import { CheckCircle } from "lucide-react";
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
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 card-hover mb-3">
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover mb-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={specialist.avatar}
              alt={specialist.name}
              className="w-16 h-16 rounded-2xl object-cover bg-pink-50"
            />
            {specialist.isAvailable && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white pulse-dot" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-gray-900 text-base truncate">{specialist.name}</h3>
              {specialist.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {specialist.specialties.join(" · ")}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={specialist.rating} size="sm" showValue />
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{specialist.yearsExperience} yrs exp</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-gray-400 text-xs">From</p>
            <p className="text-pink-600 font-bold text-lg">
              {formatCurrency(specialist.priceRange.min)}
            </p>
          </div>
        </div>

        {/* Services preview */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
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
        </div>
      </div>
    </Link>
  );
}
