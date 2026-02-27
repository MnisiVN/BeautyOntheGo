"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAppStore } from "@/lib/store";
import { Bell, Calendar, CreditCard, Star, Info, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NOTIFICATION_ICONS = {
  booking: Calendar,
  payment: CreditCard,
  review: Star,
  system: Info,
};

const NOTIFICATION_COLORS = {
  booking: "bg-blue-100 text-blue-600",
  payment: "bg-green-100 text-green-600",
  review: "bg-amber-100 text-amber-600",
  system: "bg-gray-100 text-gray-600",
};

export default function SpecialistNotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-5 pt-12 pb-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-bold text-gray-900 text-xl">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-pink-600">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 text-sm text-pink-600 font-medium"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        {sortedNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 text-sm">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedNotifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type];
              const colorClass = NOTIFICATION_COLORS[notification.type];

              return (
                <button
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={cn(
                    "w-full text-left flex items-start gap-3 p-4 rounded-2xl border transition-all",
                    notification.read
                      ? "bg-white border-gray-100"
                      : "bg-pink-50 border-pink-100"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", colorClass)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-semibold", notification.read ? "text-gray-700" : "text-gray-900")}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
