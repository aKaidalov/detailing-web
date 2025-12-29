import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle } from 'lucide-react';
import { usePackages } from '../../api/hooks';

interface PackageStepProps {
  vehicleTypeId: number | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function PackageStep({ vehicleTypeId, selectedId, onSelect }: PackageStepProps) {
  const { data: packages, isLoading, error } = usePackages(vehicleTypeId);

  if (isLoading) {
    return (
      <div>
        <h3 className="mb-6">Select Package</h3>
        <p className="text-muted-foreground">Loading packages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="mb-6">Select Package</h3>
        <p className="text-destructive">Failed to load packages. Please try again.</p>
      </div>
    );
  }

  if (!packages || packages.length === 0) {
    return (
      <div>
        <h3 className="mb-6">Select Package</h3>
        <p className="text-muted-foreground">No packages available for this vehicle type.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-6">Select Package</h3>
      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedId === pkg.id ? 'ring-2 ring-primary bg-primary/5' : ''
            }`}
            onClick={() => onSelect(pkg.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{pkg.name}</CardTitle>
                  {pkg.description && (
                    <CardDescription className="mt-2">
                      {pkg.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold">
                    +€{pkg.price}
                  </span>
                  {selectedId === pkg.id && (
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
