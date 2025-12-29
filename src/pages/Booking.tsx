import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { VehicleStep } from '../components/booking/VehicleStep';
import { ServiceStep } from '../components/booking/ServiceStep';
import { AddOnsStep } from '../components/booking/AddOnsStep';
import { DeliveryStep } from '../components/booking/DeliveryStep';
import { TimeSlotStep } from '../components/booking/TimeSlotStep';
import { ClientDetailsStep } from '../components/booking/ClientDetailsStep';
import { ConfirmationStep } from '../components/booking/ConfirmationStep';
import { VehicleType, ServiceType, DeliveryOption } from '../types/booking';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    vehicleType: '' as VehicleType,
    service: '' as ServiceType,
    addOns: [] as string[],
    delivery: '' as DeliveryOption,
    timeSlot: '',
    clientName: user?.name || '',
    clientEmail: user?.email || '',
    clientPhone: user?.phone || '',
  });

  const totalSteps = 7;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return bookingData.vehicleType !== '';
      case 2:
        return bookingData.service !== '';
      case 3:
        return true; // Add-ons are optional
      case 4:
        return bookingData.delivery !== '';
      case 5:
        return bookingData.timeSlot !== '';
      case 6:
        return bookingData.clientName && bookingData.clientEmail && bookingData.clientPhone;
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

  const handleSubmit = () => {
    // In a real app, this would send the booking to the backend
    console.log('Booking submitted:', bookingData);
    navigate('/dashboard');
  };

  const updateBookingData = (updates: Partial<typeof bookingData>) => {
    setBookingData({ ...bookingData, ...updates });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>New Booking</CardTitle>
            <CardDescription>Step {step} of {totalSteps}</CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="min-h-[400px]">
            {step === 1 && (
              <VehicleStep
                selected={bookingData.vehicleType}
                onSelect={(type) => updateBookingData({ vehicleType: type })}
              />
            )}
            {step === 2 && (
              <ServiceStep
                vehicleType={bookingData.vehicleType}
                selected={bookingData.service}
                onSelect={(service) => updateBookingData({ service })}
              />
            )}
            {step === 3 && (
              <AddOnsStep
                service={bookingData.service}
                selected={bookingData.addOns}
                onSelect={(addOns) => updateBookingData({ addOns })}
              />
            )}
            {step === 4 && (
              <DeliveryStep
                vehicleType={bookingData.vehicleType}
                selected={bookingData.delivery}
                onSelect={(delivery) => updateBookingData({ delivery })}
              />
            )}
            {step === 5 && (
              <TimeSlotStep
                selected={bookingData.timeSlot}
                onSelect={(timeSlot) => updateBookingData({ timeSlot })}
              />
            )}
            {step === 6 && (
              <ClientDetailsStep
                data={bookingData}
                onChange={updateBookingData}
              />
            )}
            {step === 7 && (
              <ConfirmationStep
                bookingData={bookingData}
                onSubmit={handleSubmit}
              />
            )}
          </CardContent>
          <div className="border-t p-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
