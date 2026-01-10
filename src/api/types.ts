// Vehicle Type
export interface VehicleType {
  id: number;
  name: string;
  icon: string;
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
  vehicleTypeIds: number[] | null;
}

// Add-on
export interface AddOn {
  id: number;
  name: string;
  description: string | null;
  price: number;
  displayOrder: number;
  isActive: boolean;
  packageIds: number[] | null;
}

// Delivery Type
export interface DeliveryType {
  id: number;
  name: string;
  icon: string;
  price: number;
  requiresAddress: boolean;
  isActive: boolean;
}

// Time Slot Status
export type TimeSlotStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';

// Time Slot
export interface TimeSlot {
  id: number;
  date: string; // "2025-01-15"
  status: TimeSlotStatus;
  timeSlotTemplateId: number;
  // Flattened from template
  startTime: string; // "09:00:00"
  endTime: string; // "11:00:00"
}

// Time Slot Template
export interface TimeSlotTemplate {
  id: number;
  startTime: string; // "09:00:00"
  endTime: string; // "11:00:00"
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

// Booking Add-on (in booking response)
export interface BookingAddOnDto {
  id: number;
  name: string;
  price: number;
}

// Admin Booking DTO (matches backend BookingDto - flattened structure)
export interface AdminBookingDto {
  id: number;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleRegNumber: string;
  totalPrice: number;
  notes: string | null;
  address: string | null;
  status: BookingStatus;

  // Flattened vehicle type
  vehicleTypeId: number;
  vehicleTypeName: string;
  vehicleTypeBasePrice: number;

  // Flattened package
  packageId: number;
  packageName: string;
  packagePrice: number;

  // Flattened time slot
  timeSlotId: number;
  timeSlotDate: string; // "2025-01-15"
  timeSlotStartTime: string; // "09:00:00"
  timeSlotEndTime: string; // "11:00:00"

  // Flattened delivery type
  deliveryTypeId: number;
  deliveryTypeName: string;
  deliveryTypePrice: number;

  // Add-ons
  addOns: BookingAddOnDto[];

  // Audit fields
  createdAt: string;
  updatedAt: string;
}

// Booking Status Update Request
export interface BookingStatusUpdateRequest {
  status: BookingStatus;
}

// Admin CRUD Request Types
export interface CreateVehicleTypeRequest {
  name: string;
  icon: string;
  description?: string;
  basePrice: number;
  isDeliverable: boolean;
  displayOrder: number;
  isActive: boolean;
}

export type UpdateVehicleTypeRequest = CreateVehicleTypeRequest;

export interface CreatePackageRequest {
  name: string;
  description?: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
  vehicleTypeIds: number[];
}

export type UpdatePackageRequest = CreatePackageRequest;

export interface CreateAddOnRequest {
  name: string;
  description?: string;
  price: number;
  displayOrder: number;
  isActive: boolean;
  packageIds: number[];
}

export type UpdateAddOnRequest = CreateAddOnRequest;

export interface CreateDeliveryTypeRequest {
  name: string;
  icon: string;
  price: number;
  requiresAddress: boolean;
  isActive: boolean;
}

export type UpdateDeliveryTypeRequest = CreateDeliveryTypeRequest;

export interface CreateTimeSlotTemplateRequest {
  startTime: string; // "09:00:00"
  endTime: string; // "11:00:00"
  isActive: boolean;
}

export type UpdateTimeSlotTemplateRequest = CreateTimeSlotTemplateRequest;

export interface CreateTimeSlotRequest {
  date: string; // "2025-01-15"
  timeSlotTemplateId: number;
  status?: TimeSlotStatus;
}

export interface UpdateTimeSlotRequest {
  date?: string;
  timeSlotTemplateId?: number;
  status?: TimeSlotStatus;
}

// Business Settings (matches backend BusinessSettingsDto)
export interface BusinessSettings {
  name: string;
  phone: string;
  email: string;
  address: string;
}

// Analytics Period
export type AnalyticsPeriod = 'DAY' | 'WEEK' | 'MONTH';

// Booking Analytics (matches backend BookingAnalyticsDto)
export interface BookingAnalytics {
  period: string;
  startDate: string;
  endDate: string;
  totalBookings: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
}

// Revenue Analytics (matches backend RevenueAnalyticsDto)
export interface RevenueAnalytics {
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  completedBookings: number;
  averageOrderValue: number;
}

// Notification Type (matches backend NotificationType enum)
export type NotificationType =
  | 'BOOKING_CREATED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_MODIFIED'
  | 'BOOKING_COMPLETED'
  | 'BOOKING_CANCELLED_BY_CUSTOMER'
  | 'BOOKING_CANCELLED_BY_ADMIN';

// Notification DTO (matches backend NotificationDto)
export interface NotificationDto {
  id: number;
  type: NotificationType;
  subject: string;
  body: string;
  isActive: boolean;
}

// Notification Update Request (matches backend NotificationUpdateRequest)
export interface NotificationUpdateRequest {
  subject: string;
  body: string;
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
