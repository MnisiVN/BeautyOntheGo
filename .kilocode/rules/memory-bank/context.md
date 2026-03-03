# Active Context: GlowUp Beauty Booking App

## Current State

**App Status**: ✅ Fully Built & Deployed

The app is a complete beauty specialist booking platform called **GlowUp** - "Beauty at Your Doorstep". Built with Next.js 16, TypeScript, Tailwind CSS 4, Zustand for state management, and Leaflet for maps.

## Recently Completed

- [x] Complete beauty booking mobile app (GlowUp)
- [x] Client-facing features: home, browse, map, bookings, profile
- [x] Specialist dashboard: manage bookings, confirm/decline, earnings
- [x] Full booking flow: service selection → date/time → address → confirmation
- [x] Payment page: card, mobile money, bank transfer
- [x] Map view with Leaflet markers for specialists
- [x] Search & filter: by category, rating, price, availability
- [x] Notifications system
- [x] Reviews & ratings
- [x] Zustand state management
- [x] Mock data with 6 specialists, bookings, reviews, notifications
- [x] UI improvements: reduced cluttered look, better spacing, cleaner layouts

## App Architecture

```
src/
├── app/
│   ├── page.tsx                          # Home page (client)
│   ├── browse/page.tsx                   # Search & filter specialists
│   ├── map/page.tsx                      # Map view with markers
│   ├── bookings/page.tsx                 # Client bookings list
│   ├── notifications/page.tsx            # Notifications
│   ├── profile/page.tsx                  # Client profile
│   ├── specialist/[id]/page.tsx          # Specialist profile
│   ├── booking/[specialistId]/page.tsx   # Booking flow (4 steps)
│   ├── booking-confirmation/[id]/page.tsx # Booking sent confirmation
│   ├── payment/[bookingId]/page.tsx      # Payment page
│   ├── review/[bookingId]/page.tsx       # Leave review
│   └── specialist-dashboard/
│       ├── page.tsx                      # Specialist dashboard
│       ├── bookings/page.tsx             # All bookings management
│       ├── notifications/page.tsx        # Specialist notifications
│       └── profile/page.tsx             # Specialist profile management
├── components/
│   ├── BottomNav.tsx                     # Mobile bottom navigation
│   ├── MapView.tsx                       # Leaflet map component
│   ├── SpecialistCard.tsx                # Specialist listing card
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       └── StarRating.tsx
└── lib/
    ├── types.ts                          # TypeScript interfaces
    ├── mock-data.ts                      # Mock specialists, bookings, etc.
    ├── store.ts                          # Zustand global state
    └── utils.ts                          # Helper functions
```

## Key Features

### Client Features
- **Home**: Personalized greeting, category grid, featured specialists, promo banner
- **Browse**: Search by name/service, filter by category/rating/price/availability, sort options
- **Map**: Interactive Leaflet map with specialist markers, click to view details
- **Booking Flow**: 4-step wizard (service → date/time → address → confirm)
- **Bookings**: View all bookings with status, pay for confirmed bookings, leave reviews
- **Notifications**: Real-time notification center with read/unread states
- **Profile**: User stats, settings menu, switch to specialist mode

### Specialist Features
- **Dashboard**: Pending requests with confirm/decline, earnings overview, upcoming bookings
- **Bookings**: Full booking management with status filters
- **Profile**: Bio, services, portfolio, availability schedule, earnings

### Payment
- Credit/Debit Card (with card preview animation)
- Mobile Money
- Bank Transfer
- 5% service fee calculation

## Tech Stack Used
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 (pink/purple gradient theme)
- Zustand (state management)
- Leaflet + react-leaflet (maps)
- lucide-react (icons)
- date-fns, clsx, tailwind-merge

## Session History

| Date | Changes |
|------|---------|
| 2026-02-27 | Built complete GlowUp beauty booking app from scratch |
