import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { VehicleType } from '../../types/booking';
import { Bike, Car, Truck } from 'lucide-react';

interface VehicleStepProps {
  selected: VehicleType;
  onSelect: (type: VehicleType) => void;
}

export function VehicleStep({ selected, onSelect }: VehicleStepProps) {
  const { t } = useLanguage();

  const vehicles = [
    { type: 'motorcycle' as VehicleType, icon: Bike, label: t('vehicle.motorcycle') },
    { type: 'car' as VehicleType, icon: Car, label: t('vehicle.car') },
    { type: 'van' as VehicleType, icon: Truck, label: t('vehicle.van') },
  ];

  return (
    <div>
      <h3 className="mb-6">{t('booking.step.vehicle')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map(({ type, icon: Icon, label }) => (
          <Card
            key={type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selected === type ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => onSelect(type)}
          >
            <CardContent className="pt-6 text-center">
              <Icon className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p>{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
