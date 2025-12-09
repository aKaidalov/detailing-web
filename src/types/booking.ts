export type VehicleType = 'motorcycle' | 'car' | 'van';

export type ServiceType = 'fullWash' | 'exteriorWash' | 'interiorCleaning';

export type DeliveryOption = 'pickup' | 'airport' | 'myself';

export type BookingStatus = 'pending' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled';

export interface ServicePrice {
  motorcycle?: number;
  car: number;
  van: number;
}

export interface Service {
  id: ServiceType;
  name: string;
  description: string;
  prices: ServicePrice;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  applicableServices: ServiceType[];
}

export interface DeliveryOptionType {
  id: DeliveryOption;
  name: string;
  price: number;
  applicableVehicles: VehicleType[];
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  userId?: string;
  vehicleType: VehicleType;
  service: ServiceType;
  addOns: string[];
  delivery: DeliveryOption;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: string;
}
