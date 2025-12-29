import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useVehicleTypes, usePackages, useAddOns, useDeliveryTypes, useCreateBooking } from '../../api/hooks';
import type { BookingData } from '../../pages/Booking';
import type { CreateBookingRequest } from '../../api/types';

interface ConfirmationStepProps {
  bookingData: BookingData;
  onUpdate: (updates: Partial<BookingData>) => void;
}

export function ConfirmationStep({ bookingData, onUpdate }: ConfirmationStepProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch all selected data for display
  const { data: vehicleTypes } = useVehicleTypes();
  const { data: packages } = usePackages(bookingData.vehicleTypeId);
  const { data: addOns } = useAddOns(bookingData.packageId);
  const { data: deliveryTypes } = useDeliveryTypes();

  const createBooking = useCreateBooking();

  // Find selected items
  const selectedVehicle = vehicleTypes?.find((v) => v.id === bookingData.vehicleTypeId);
  const selectedPackage = packages?.find((p) => p.id === bookingData.packageId);
  const selectedAddOns = addOns?.filter((a) => bookingData.addOnIds.includes(a.id)) || [];
  const selectedDelivery = deliveryTypes?.find((d) => d.id === bookingData.deliveryTypeId);

  // Calculate prices
  const basePrice = selectedVehicle?.basePrice || 0;
  const packagePrice = selectedPackage?.price || 0;
  const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const deliveryPrice = selectedDelivery?.price || 0;
  const totalPrice = basePrice + packagePrice + addOnsPrice + deliveryPrice;

  // Form validation
  const isFormValid = () => {
    return (
      bookingData.firstName.trim() !== '' &&
      bookingData.lastName.trim() !== '' &&
      bookingData.email.trim() !== '' &&
      bookingData.phone.trim() !== '' &&
      bookingData.vehicleRegNumber.trim() !== '' &&
      (!selectedDelivery?.requiresAddress || bookingData.address.trim() !== '')
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    if (
      !bookingData.vehicleTypeId ||
      !bookingData.packageId ||
      !bookingData.timeSlotId ||
      !bookingData.deliveryTypeId
    ) {
      setSubmitError('Missing booking information. Please go back and complete all steps.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const request: CreateBookingRequest = {
      vehicleTypeId: bookingData.vehicleTypeId,
      packageId: bookingData.packageId,
      addOnIds: bookingData.addOnIds,
      timeSlotId: bookingData.timeSlotId,
      deliveryTypeId: bookingData.deliveryTypeId,
      address: bookingData.address || undefined,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      phone: bookingData.phone,
      email: bookingData.email,
      vehicleRegNumber: bookingData.vehicleRegNumber,
      notes: bookingData.notes || undefined,
    };

    try {
      const result = await createBooking.mutateAsync(request);
      // Navigate to success page with booking reference
      navigate(`/booking/success?reference=${result.reference}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to create booking. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="mb-6">Confirm Your Booking</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Details Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={bookingData.firstName}
                    onChange={(e) => onUpdate({ firstName: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={bookingData.lastName}
                    onChange={(e) => onUpdate({ lastName: e.target.value })}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => onUpdate({ email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => onUpdate({ phone: e.target.value })}
                  placeholder="+372 5555 5555"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleRegNumber">Vehicle Registration Number *</Label>
                <Input
                  id="vehicleRegNumber"
                  type="text"
                  value={bookingData.vehicleRegNumber}
                  onChange={(e) => onUpdate({ vehicleRegNumber: e.target.value })}
                  placeholder="123ABC"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Comments</Label>
                <Textarea
                  id="notes"
                  value={bookingData.notes}
                  onChange={(e) => onUpdate({ notes: e.target.value })}
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1">Vehicle Type</p>
                <p>{selectedVehicle?.name || 'Not selected'}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Package</p>
                <p>{selectedPackage?.name || 'Not selected'}</p>
              </div>
              {selectedAddOns.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-1">Add-ons</p>
                    <ul className="space-y-1">
                      {selectedAddOns.map((addon) => (
                        <li key={addon.id}>{addon.name}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Delivery</p>
                <p>{selectedDelivery?.name || 'Not selected'}</p>
                {selectedDelivery?.requiresAddress && bookingData.address && (
                  <p className="text-sm text-muted-foreground">{bookingData.address}</p>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Time Slot</p>
                <p>{bookingData.timeSlotId ? 'Selected' : 'Not selected'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base ({selectedVehicle?.name})</span>
                <span>€{basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span>€{packagePrice}</span>
              </div>
              {addOnsPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Add-ons</span>
                  <span>€{addOnsPrice}</span>
                </div>
              )}
              {deliveryPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>€{deliveryPrice}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{totalPrice}</span>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          {submitError && (
            <p className="text-destructive text-sm">{submitError}</p>
          )}
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  );
}
