import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { ServiceType } from '../../types/booking';
import { addOns } from '../../data/mockData';

interface AddOnsStepProps {
  service: ServiceType;
  selected: string[];
  onSelect: (addOns: string[]) => void;
}

export function AddOnsStep({ service, selected, onSelect }: AddOnsStepProps) {
  const { t } = useLanguage();

  const availableAddOns = addOns.filter((addon) =>
    addon.applicableServices.includes(service)
  );

  const toggleAddOn = (addonId: string) => {
    if (selected.includes(addonId)) {
      onSelect(selected.filter((id) => id !== addonId));
    } else {
      onSelect([...selected, addonId]);
    }
  };

  return (
    <div>
      <h3 className="mb-2">{t('booking.step.addons')}</h3>
      <p className="text-muted-foreground mb-6">Optional - select any add-ons you want</p>
      <div className="grid grid-cols-1 gap-3">
        {availableAddOns.map((addon) => (
          <Card
            key={addon.id}
            className={`cursor-pointer transition-all hover:shadow-sm ${
              selected.includes(addon.id) ? 'bg-primary/5 ring-1 ring-primary' : ''
            }`}
            onClick={() => toggleAddOn(addon.id)}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selected.includes(addon.id)}
                    onCheckedChange={() => toggleAddOn(addon.id)}
                  />
                  <div>
                    <p>{t(`addon.${addon.id}`)}</p>
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
