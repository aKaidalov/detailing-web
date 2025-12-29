import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import type { ServiceType, VehicleType } from '../../types/booking';
import { services } from '../../data/mockData';
import { CheckCircle } from 'lucide-react';

interface ServiceStepProps {
  vehicleType: VehicleType;
  selected: ServiceType;
  onSelect: (service: ServiceType) => void;
}

export function ServiceStep({ vehicleType, selected, onSelect }: ServiceStepProps) {
  const availableServices = services.filter(
    (service) => service.prices[vehicleType] !== undefined
  );

  return (
    <div>
      <h3 className="mb-6">Select Service</h3>
      <div className="grid grid-cols-1 gap-4">
        {availableServices.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selected === service.id ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => onSelect(service.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {service.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold">
                    €{service.prices[vehicleType]}
                  </span>
                  {selected === service.id && (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
