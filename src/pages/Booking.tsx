import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { VehicleStep } from '../components/booking/VehicleStep';
import { PackageStep } from '../components/booking/PackageStep';
import { AddOnsStep } from '../components/booking/AddOnsStep';
import { TimeSlotStep } from '../components/booking/TimeSlotStep';
import { DeliveryStep } from '../components/booking/DeliveryStep';
import { ConfirmationStep } from '../components/booking/ConfirmationStep';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryTypes } from '../api/hooks';

// Booking state with numeric IDs for API
export interface BookingData {
  vehicleTypeId: number | null;
  packageId: number | null;
  addOnIds: number[];
  timeSlotId: number | null;
  deliveryTypeId: number | null;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleRegNumber: string;
  notes: string;
}

export function Booking() {
  const navigate = useNavigate();
  const { data: deliveryTypes } = useDeliveryTypes();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    vehicleTypeId: null,
    packageId: null,
    addOnIds: [],
    timeSlotId: null,
    deliveryTypeId: null,
    address: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    vehicleRegNumber: '',
    notes: '',
  });

  // Step order: Vehicle → Package → AddOns → TimeSlot → Delivery → Confirmation
  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingData.vehicleTypeId !== null;
      case 2:
        return bookingData.packageId !== null;
      case 3:
        return true; // Add-ons are optional
      case 4:
        return bookingData.timeSlotId !== null;
      case 5: {
        if (bookingData.deliveryTypeId === null) return false;
        const selectedDelivery = deliveryTypes?.find(d => d.id === bookingData.deliveryTypeId);
        if (selectedDelivery?.requiresAddress && !bookingData.address.trim()) {
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData((prev) => {
      const newData = { ...prev, ...updates };
      // Reset dependent selections when parent changes
      if ('vehicleTypeId' in updates && updates.vehicleTypeId !== prev.vehicleTypeId) {
        newData.packageId = null;
        newData.addOnIds = [];
      }
      if ('packageId' in updates && updates.packageId !== prev.packageId) {
        newData.addOnIds = [];
      }
      return newData;
    });
  };

  const stepLabels = ['Vehicle', 'Package', 'Add-ons', 'Time', 'Delivery', 'Confirm'];

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>New Booking</CardTitle>
            <CardDescription>Step {step} of {totalSteps}: {stepLabels[step - 1]}</CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {step === 1 && (
              <VehicleStep
                selectedId={bookingData.vehicleTypeId}
                onSelect={(id) => updateBookingData({ vehicleTypeId: id })}
              />
            )}
            {step === 2 && (
              <PackageStep
                vehicleTypeId={bookingData.vehicleTypeId}
                selectedId={bookingData.packageId}
                onSelect={(id) => updateBookingData({ packageId: id })}
              />
            )}
            {step === 3 && (
              <AddOnsStep
                packageId={bookingData.packageId}
                selectedIds={bookingData.addOnIds}
                onSelect={(ids) => updateBookingData({ addOnIds: ids })}
              />
            )}
            {step === 4 && (
              <TimeSlotStep
                selectedId={bookingData.timeSlotId}
                onSelect={(id) => updateBookingData({ timeSlotId: id })}
              />
            )}
            {step === 5 && (
              <DeliveryStep
                vehicleTypeId={bookingData.vehicleTypeId}
                selectedId={bookingData.deliveryTypeId}
                address={bookingData.address}
                onSelect={(id, address) => updateBookingData({ deliveryTypeId: id, address: address || '' })}
              />
            )}
            {step === 6 && (
              <ConfirmationStep
                bookingData={bookingData}
                onUpdate={updateBookingData}
              />
            )}
          </CardContent>
          <div className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {step < totalSteps && (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
