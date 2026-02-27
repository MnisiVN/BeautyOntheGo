"use client";

import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Calendar,
  Heart,
  MapPin,
  Edit3,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAppStore } from "@/lib/store";
import { mockBookings } from "@/lib/mock-data";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Personal Information", href: "/profile/edit" },
      { icon: MapPin, label: "Saved Addresses", href: "/profile/addresses" },
      { icon: CreditCard, label: "Payment Methods", href: "/profile/payment-methods" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", href: "/profile/notifications" },
      { icon: Heart, label: "Favorites", href: "/profile/favorites" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: HelpCircle, label: "Help & Support", href: "/help" },
      { icon: Shield, label: "Privacy & Security", href: "/privacy" },
      { icon: Settings, label: "App Settings", href: "/settings" },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, bookings, setCurrentView } = useAppStore();

  const completedBookings = bookings.filter(
    (b) => b.clientId === currentUser.id && b.status === "completed"
  ).length;

  const totalSpent = bookings
    .filter((b) => b.clientId === currentUser.id && b.status === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="gradient-primary px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-bold text-xl">Profile</h1>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl border-4 border-white/30 bg-white/20"
            />
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
              <Edit3 className="w-3.5 h-3.5 text-pink-500" />
            </button>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">{currentUser.name}</h2>
            <p className="text-white/70 text-sm">{currentUser.email}</p>
            <p className="text-white/70 text-sm">{currentUser.phone}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-5 -mt-4 bg-white rounded-2xl shadow-lg p-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold gradient-text">{bookings.filter(b => b.clientId === currentUser.id).length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Bookings</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <p className="text-2xl font-bold gradient-text">{completedBookings}</p>
          <p className="text-xs text-gray-500 mt-0.5">Completed</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <p className="text-2xl font-bold gradient-text">4.9</p>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Rating</p>
        </div>
      </div>

      {/* Switch to Specialist */}
      <div className="mx-5 mt-4">
        <button
          onClick={() => {
            setCurrentView("specialist");
            router.push("/specialist-dashboard");
          }}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">
                Become a Specialist
              </p>
              <p className="text-xs text-gray-500">
                Offer your beauty services
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Menu Sections */}
      <div className="px-5 mt-4 space-y-4">
        {MENU_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {section.title}
            </p>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${
                      i < section.items.length - 1 ? "border-b border-gray-50" : ""
                    }`}
                  >
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5 text-gray-600" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-700 text-left">
                      {item.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-4.5 h-4.5 text-red-500" />
            </div>
            <span className="flex-1 text-sm font-medium text-red-500 text-left">
              Sign Out
            </span>
          </button>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-gray-400 pb-4">
          GlowUp v1.0.0 · Made with 💕
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
