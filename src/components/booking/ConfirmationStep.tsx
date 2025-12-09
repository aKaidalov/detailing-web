import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { services, addOns, deliveryOptions } from '../../data/mockData';
import { VehicleType, ServiceType, DeliveryOption } from '../../types/booking';

interface ConfirmationStepProps {
  bookingData: {
    vehicleType: VehicleType;
    service: ServiceType;
    addOns: string[];
    delivery: DeliveryOption;
    timeSlot: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  };
  onSubmit: () => void;
}

export function ConfirmationStep({ bookingData }: ConfirmationStepProps) {
  const { t } = useLanguage();

  const selectedService = services.find((s) => s.id === bookingData.service);
  const selectedDelivery = deliveryOptions.find((d) => d.id === bookingData.delivery);
  const selectedAddOns = addOns.filter((a) => bookingData.addOns.includes(a.id));

  const basePrice = selectedService?.prices[bookingData.vehicleType] || 0;
  const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
  const deliveryPrice = selectedDelivery?.price || 0;
  const totalPrice = basePrice + addOnsPrice + deliveryPrice;

  return (
    <div>
      <h3 className="mb-6">{t('booking.step.confirm')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1">Vehicle Type</p>
                <p>{t(`vehicle.${bookingData.vehicleType}`)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Service</p>
                <p>{t(`service.${bookingData.service}`)}</p>
              </div>
              {selectedAddOns.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground mb-1">Add-ons</p>
                    <ul className="space-y-1">
                      {selectedAddOns.map((addon) => (
                        <li key={addon.id}>{t(`addon.${addon.id}`)}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Delivery</p>
                <p>{t(`delivery.${bookingData.delivery}`)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Time Slot</p>
                <p>{bookingData.timeSlot}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground mb-1">Name</p>
                <p>{bookingData.clientName}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Email</p>
                <p>{bookingData.clientEmail}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground mb-1">Phone</p>
                <p>{bookingData.clientPhone}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Service</span>
                <span>€{basePrice}</span>
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
              <div className="flex justify-between">
                <span>Total</span>
                <span>€{totalPrice}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
