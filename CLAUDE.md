# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ADetailing Booking Web is a car detailing service booking application built with React, TypeScript, and Vite. It provides a multi-step booking flow for customers and an admin dashboard for managing bookings, services, and time slots.

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:3000 (auto-opens browser)
npm run build    # Type-check with tsc and build for production (outputs to /build)
npm run lint     # Run ESLint on all files
npm run preview  # Preview production build locally
```

## Architecture

### Routing Structure
- **Public routes**: `/` (landing), `/login`, `/register`, `/booking`
- **Client routes**: `/dashboard`, `/booking/:id` (protected)
- **Admin routes**: `/admin/*` with nested routes for services, bookings, timeslots, users, notifications, statistics, settings

### Key Directories
- `src/pages/` - Page components (client-facing and admin)
- `src/pages/admin/` - Admin dashboard pages
- `src/components/booking/` - Multi-step booking wizard components
- `src/components/ui/` - Shadcn/ui components (Radix UI primitives with Tailwind)
- `src/contexts/` - React contexts (Auth, Language)
- `src/types/` - TypeScript type definitions
- `src/data/` - Mock data and helpers

### Multi-step Booking Flow
The booking wizard (`src/pages/Booking.tsx`) has 7 steps:
1. VehicleStep - Select vehicle type (motorcycle/car/van)
2. ServiceStep - Choose service (fullWash/exteriorWash/interiorCleaning)
3. AddOnsStep - Optional add-ons
4. DeliveryStep - Pickup or self-delivery
5. TimeSlotStep - Date and time selection
6. ClientDetailsStep - Contact information
7. ConfirmationStep - Review and submit

### Internationalization
Three languages supported: English (en), Estonian (et), Russian (ru). Translations defined inline in `src/contexts/LanguageContext.tsx` using a `t(key)` function pattern.

### UI Component Pattern
Components use Shadcn/ui conventions with:
- `class-variance-authority` for variant styling
- `cn()` utility from `src/components/ui/utils.ts` for merging Tailwind classes
- Radix UI primitives for accessible components

### Authentication State
Auth is managed via `AuthContext`. Currently uses mock data with auth protection disabled for testing (see TODO comments in `src/App.tsx` and `src/contexts/AuthContext.tsx`).

## Path Alias
`@` maps to `./src` - configured in `vite.config.ts`.

## Notes
- Build output directory is `/build` (not default `/dist`)
- Dev server runs on port 3000
- Uses `@vitejs/plugin-react-swc` for Fast Refresh
