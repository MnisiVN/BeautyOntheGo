"use client";

import { create } from "zustand";
import type { Booking, Notification, FilterOptions, User } from "./types";
import {
  mockBookings,
  mockNotifications,
  currentUser,
  currentSpecialist,
} from "./mock-data";

export type AppView = "client" | "specialist";

interface AppState {
  // Auth
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (
    bookingId: string,
    status: Booking["status"]
  ) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Notification) => void;
  unreadCount: () => number;

  // Filters
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // UI
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  currentView: "client",
  setCurrentView: (view) => {
    set({ currentView: view });
  },
  currentUser: currentUser,

  // Bookings
  bookings: mockBookings,
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBookingStatus: (bookingId, status) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId
          ? { ...b, status, updatedAt: new Date().toISOString() }
          : b
      ),
    })),

  // Notifications
  notifications: mockNotifications,
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  // Filters
  filters: {},
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // UI
  activeTab: "home",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
