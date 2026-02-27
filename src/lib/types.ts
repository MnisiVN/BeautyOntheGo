export type UserRole = "client" | "specialist";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
}

export interface Specialist extends User {
  role: "specialist";
  bio: string;
  specialties: string[];
  services: Service[];
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  yearsExperience: number;
  portfolio: string[];
  availability: WeeklyAvailability;
  priceRange: { min: number; max: number };
  verified: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: ServiceCategory;
}

export type ServiceCategory =
  | "hair"
  | "nails"
  | "makeup"
  | "skincare"
  | "massage"
  | "eyebrows"
  | "lashes"
  | "waxing"
  | "other";

export interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "17:00"
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "completed"
  | "cancelled"
  | "payment_pending"
  | "paid";

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  specialistId: string;
  specialistName: string;
  specialistAvatar?: string;
  service: Service;
  date: string; // ISO date string
  time: string; // "14:00"
  status: BookingStatus;
  notes?: string;
  address: string;
  totalAmount: number;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  specialistId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "review" | "system";
  read: boolean;
  createdAt: string;
  bookingId?: string;
}

export interface FilterOptions {
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxDistance?: number;
  availability?: string; // date string
  sortBy?: "rating" | "price_low" | "price_high" | "distance" | "reviews";
}

export interface PaymentMethod {
  id: string;
  type: "card" | "mobile_money" | "bank_transfer";
  last4?: string;
  brand?: string;
  isDefault: boolean;
}
