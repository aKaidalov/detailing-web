import { Card, CardContent } from '../ui/card';
import type { DeliveryOption, VehicleType } from '../../types/booking';
import { deliveryOptions } from '../../data/mockData';
import { CheckCircle, Car, User } from 'lucide-react';

interface DeliveryStepProps {
  vehicleType: VehicleType;
  selected: DeliveryOption;
  onSelect: (delivery: DeliveryOption) => void;
}

export function DeliveryStep({ vehicleType, selected, onSelect }: DeliveryStepProps) {
  const availableOptions = deliveryOptions.filter((option) =>
    option.applicableVehicles.includes(vehicleType)
  );

  const getIcon = (id: DeliveryOption) => {
    switch (id) {
      case 'pickup':
        return Car;
      case 'myself':
        return User;
    }
  };

  return (
    <div>
      <h3 className="mb-6">Delivery Option</h3>
      <div className="grid grid-cols-1 gap-4">
        {availableOptions.map((option) => {
          const Icon = getIcon(option.id);
          return (
            <Card
              key={option.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selected === option.id ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => onSelect(option.id)}
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
                    {selected === option.id && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
