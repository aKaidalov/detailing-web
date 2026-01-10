import { Card, CardContent } from '../ui/card';
import { useVehicleTypes } from '../../api/hooks';

interface VehicleStepProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function VehicleStep({ selectedId, onSelect }: VehicleStepProps) {
  const { data: vehicleTypes, isLoading, error } = useVehicleTypes();

  if (isLoading) {
    return (
      <div>
        <h3 className="mb-6">Vehicle Type</h3>
        <p className="text-muted-foreground">Loading vehicle types...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="mb-6">Vehicle Type</h3>
        <p className="text-destructive">Failed to load vehicle types. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-6">Vehicle Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicleTypes?.map((vehicle) => (
          <Card
            key={vehicle.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedId === vehicle.id ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => onSelect(vehicle.id)}
          >
            <CardContent className="pt-6 text-center">
              <span className="block mb-4" style={{ fontSize: '3rem' }}>{vehicle.icon}</span>
              <p className="font-medium">{vehicle.name}</p>
              {vehicle.description && (
                <p className="text-sm text-muted-foreground mt-1">{vehicle.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Base: €{vehicle.basePrice}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
