"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MapPin, Calendar, User, Bell, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  clientOnly?: boolean;
  specialistOnly?: boolean;
}

const clientNavItems: NavItem[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/browse", icon: Search, label: "Browse" },
  { href: "/map", icon: MapPin, label: "Map" },
  { href: "/bookings", icon: Calendar, label: "Bookings" },
  { href: "/profile", icon: User, label: "Profile" },
];

const specialistNavItems: NavItem[] = [
  { href: "/specialist-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/specialist-dashboard/bookings", icon: Calendar, label: "Bookings" },
  { href: "/specialist-dashboard/notifications", icon: Bell, label: "Alerts" },
  { href: "/specialist-dashboard/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { currentView, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems = currentView === "specialist" ? specialistNavItems : clientNavItems;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 bottom-nav z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all",
                isActive
                  ? "text-pink-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all",
                    isActive && "scale-110"
                  )}
                />
                {item.label === "Alerts" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-pink-600" : "text-gray-400"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-pink-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
