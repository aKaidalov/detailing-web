import type {Service, AddOn, DeliveryOptionType, Booking} from '../types/booking';

export const services: Service[] = [
  {
    id: 'fullWash',
    name: 'Full Wash',
    description: 'Interior + Exterior',
    prices: { motorcycle: 30, car: 50, van: 70 },
  },
  {
    id: 'exteriorWash',
    name: 'Exterior Wash',
    description: 'Pre-soak, tar removal, hand wash with shampoo, wheel wash, hand drying, door jamb cleaning, tire shine',
    prices: { car: 30, van: 40 },
  },
  {
    id: 'interiorCleaning',
    name: 'Interior Cleaning',
    description: 'Floor mat cleaning, window cleaning, surface cleaning, air vent cleaning, vacuuming of the cabin and trunk',
    prices: { car: 30, van: 40 },
  },
];

export const addOns: AddOn[] = [
  {
    id: 'rustRemoval',
    name: 'Rust spot removal',
    price: 10,
    applicableServices: ['fullWash', 'exteriorWash'],
  },
  {
    id: 'quickCeramic',
    name: 'Quick ceramic coating',
    price: 15,
    applicableServices: ['fullWash', 'exteriorWash'],
  },
  {
    id: 'bodyWaxing',
    name: 'Body waxing – lasts up to 6 months',
    price: 30,
    applicableServices: ['fullWash', 'exteriorWash'],
  },
  {
    id: 'polishing',
    name: 'Polishing',
    price: 100,
    applicableServices: ['fullWash', 'exteriorWash'],
  },
  {
    id: 'carCeramic',
    name: 'Car ceramic coating',
    price: 100,
    applicableServices: ['fullWash', 'exteriorWash'],
  },
  {
    id: 'textileSeats',
    name: 'Textile seat cleaning',
    price: 50,
    applicableServices: ['fullWash', 'interiorCleaning'],
  },
  {
    id: 'leatherCare',
    name: 'Leather seat care',
    price: 50,
    applicableServices: ['fullWash', 'interiorCleaning'],
  },
  {
    id: 'ozoneOdor',
    name: 'Odor removal with ozone',
    price: 35,
    applicableServices: ['fullWash', 'interiorCleaning'],
  },
  {
    id: 'leatherCeramic',
    name: 'Leather ceramic coating',
    price: 100,
    applicableServices: ['fullWash', 'interiorCleaning'],
  },
  {
    id: 'extraDirty',
    name: 'Extra dirty vehicle surcharge',
    price: 20,
    applicableServices: ['fullWash', 'exteriorWash', 'interiorCleaning'],
  },
];

export const deliveryOptions: DeliveryOptionType[] = [
  {
    id: 'pickup',
    name: 'We pick up the car',
    price: 15,
    applicableVehicles: ['car', 'van'],
  },
  {
    id: 'myself',
    name: 'I bring it myself',
    price: 0,
    applicableVehicles: ['motorcycle', 'car', 'van'],
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    vehicleType: 'car',
    service: 'fullWash',
    addOns: ['quickCeramic', 'textileSeats'],
    delivery: 'myself',
    timeSlot: '2025-10-10T10:00:00',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    clientPhone: '+372 5555 5555',
    status: 'confirmed',
    totalPrice: 115,
    createdAt: '2025-10-06T12:00:00',
  },
  {
    id: '2',
    userId: '1',
    vehicleType: 'car',
    service: 'exteriorWash',
    addOns: [],
    delivery: 'pickup',
    timeSlot: '2025-10-08T14:00:00',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    clientPhone: '+372 5555 5555',
    status: 'pending',
    totalPrice: 45,
    createdAt: '2025-10-05T15:30:00',
  },
];

export const generateTimeSlots = (daysAhead: number = 14) => {
  const slots = [];
  const times = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'];

  for (let day = 1; day <= daysAhead; day++) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];

    times.forEach((time, index) => {
      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        time: time,
        available: Math.random() > 0.3, // Random availability
      });
    });
  }

  return slots;
};
