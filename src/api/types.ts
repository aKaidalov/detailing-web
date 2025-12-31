// Vehicle Type
export interface VehicleType {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  isDeliverable: boolean;
  displayOrder: number;
  isActive: boolean;
}

// Package
export interface Package {
  id: number;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  isActive: boolean;
}

// Add-on
export interface AddOn {
  id: number;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  isActive: boolean;
}

// Delivery Type
export interface DeliveryType {
  id: number;
  name: string;
  price: number;
  requiresAddress: boolean;
  isActive: boolean;
}

// Time Slot
export interface TimeSlot {
  id: number;
  date: string; // "2025-01-15"
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
}

// Time Slot Template
export interface TimeSlotTemplate {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

// Booking Status
export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_BY_ADMIN'
  | 'COMPLETED';

// Create Booking Request (matches backend BookingCreateRequest)
export interface CreateBookingRequest {
  vehicleTypeId: number;
  packageId: number;
  addOnIds: number[];
  timeSlotId: number;
  deliveryTypeId: number;
  address?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicleRegNumber: string;
  notes?: string;
}

// Booking Response
export interface BookingResponse {
  id: number;
  reference: string;
  status: BookingStatus;
  vehicleType: VehicleType;
  package: Package;
  addOns: AddOn[];
  timeSlot: TimeSlot;
  deliveryType: DeliveryType;
  address: string | null;
  totalPrice: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  vehicleRegistrationNumber: string;
  additionalComments: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// Admin Booking List Item (simplified for list view)
export interface AdminBookingListItem {
  id: number;
  reference: string;
  status: BookingStatus;
  vehicleTypeName: string;
  packageName: string;
  timeSlotDate: string;
  timeSlotTime: string;
  totalPrice: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

// Business Settings
export interface BusinessSettings {
  businessName: string;
  phoneNumber: string;
  email: string;
  address: string;
  timezone: string;
  currency: string;
}

// Analytics
export interface BookingAnalytics {
  period: string;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
}

export interface RevenueAnalytics {
  period: string;
  totalRevenue: number;
  averageOrderValue: number;
}

// Notification Template
export interface NotificationTemplate {
  type: string;
  subject: string;
  bodyTemplate: string;
  isActive: boolean;
}

// User Role
export type UserRole = 'ADMIN' | 'CLIENT';

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  role: UserRole;
}
