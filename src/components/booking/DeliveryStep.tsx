import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CheckCircle, Car, User } from 'lucide-react';
import { useDeliveryTypes, useVehicleTypes } from '../../api/hooks';

interface DeliveryStepProps {
  vehicleTypeId: number | null;
  selectedId: number | null;
  address: string;
  onSelect: (id: number, address?: string) => void;
}

export function DeliveryStep({ vehicleTypeId, selectedId, address, onSelect }: DeliveryStepProps) {
  const [addressTouched, setAddressTouched] = useState(false);
  const { data: deliveryTypes, isLoading, error } = useDeliveryTypes();
  const { data: vehicleTypes } = useVehicleTypes();

  // Find the selected vehicle type to check if deliverable
  const selectedVehicle = vehicleTypes?.find((v) => v.id === vehicleTypeId);
  const isDeliverable = selectedVehicle?.isDeliverable ?? true;

  // Find selected delivery type to check if address is required
  const selectedDelivery = deliveryTypes?.find((d) => d.id === selectedId);
  const requiresAddress = selectedDelivery?.requiresAddress ?? false;

  // Address validation
  const addressError = requiresAddress && !address.trim() ? 'This field is required' : undefined;
  const showAddressError = addressTouched && !!addressError;

  const handleAddressBlur = () => {
    setAddressTouched(true);
  };

  // Map icons based on common delivery type patterns
  const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('pick') || lowerName.includes('delivery')) {
      return Car;
    }
    return User;
  };

  if (isLoading) {
    return (
      <div>
        <h3 className="mb-6">Delivery Option</h3>
        <p className="text-muted-foreground">Loading delivery options...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="mb-6">Delivery Option</h3>
        <p className="text-destructive">Failed to load delivery options. Please try again.</p>
      </div>
    );
  }

  // Filter options based on vehicle deliverability
  // If vehicle is not deliverable, only show non-pickup options
  const availableOptions = deliveryTypes?.filter((option) =>
    isDeliverable || !option.requiresAddress
  ) || [];

  return (
    <div>
      <h3 className="mb-6">Delivery Option</h3>
      <div className="grid grid-cols-1 gap-4">
        {availableOptions.map((option) => {
          const Icon = getIcon(option.name);
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedId === option.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelect(option.id, address)}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-primary" />
                    <p>{option.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      {option.price > 0 ? `+€${option.price}` : 'Free'}
                    </span>
                    {selectedId === option.id && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Address input when required */}
      {requiresAddress && (
        <div className="mt-6 space-y-2">
          <Label htmlFor="address">Pickup Address *</Label>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => onSelect(selectedId!, e.target.value)}
            onBlur={handleAddressBlur}
            placeholder="Enter your address for pickup"
            aria-invalid={showAddressError}
            required
          />
          {showAddressError && (
            <p className="text-destructive text-sm">{addressError}</p>
          )}
        </div>
      )}
    </div>
  );
}
