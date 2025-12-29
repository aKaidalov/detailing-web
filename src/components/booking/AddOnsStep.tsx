import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { useAddOns } from '../../api/hooks';

interface AddOnsStepProps {
  packageId: number | null;
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
}

export function AddOnsStep({ packageId, selectedIds, onSelect }: AddOnsStepProps) {
  const { data: addOns, isLoading, error } = useAddOns(packageId);

  const toggleAddOn = (addonId: number) => {
    if (selectedIds.includes(addonId)) {
      onSelect(selectedIds.filter((id) => id !== addonId));
    } else {
      onSelect([...selectedIds, addonId]);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h3 className="mb-2">Add-ons</h3>
        <p className="text-muted-foreground">Loading add-ons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h3 className="mb-2">Add-ons</h3>
        <p className="text-destructive">Failed to load add-ons. Please try again.</p>
      </div>
    );
  }

  if (!addOns || addOns.length === 0) {
    return (
      <div>
        <h3 className="mb-2">Add-ons</h3>
        <p className="text-muted-foreground mb-6">No add-ons available for this package. You can proceed to the next step.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2">Add-ons</h3>
      <p className="text-muted-foreground mb-6">Optional - select any add-ons you want</p>
      <div className="grid grid-cols-1 gap-3">
        {addOns.map((addon) => (
          <Card
            key={addon.id}
            className={`cursor-pointer transition-all hover:shadow-sm ${
              selectedIds.includes(addon.id) ? 'bg-primary/5 ring-1 ring-primary' : ''
            }`}
            onClick={() => toggleAddOn(addon.id)}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.includes(addon.id)}
                    onCheckedChange={() => toggleAddOn(addon.id)}
                  />
                  <div>
                    <p className="font-medium">{addon.name}</p>
                    {addon.description && (
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                    )}
                  </div>
                </div>
                <span className="font-semibold">+€{addon.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
