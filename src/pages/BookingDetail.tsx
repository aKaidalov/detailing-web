import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { mockBookings } from '../data/mockData';
import { ChevronLeft, Calendar, User, Car, Package, MapPin, Clock } from 'lucide-react';

export function BookingDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const booking = mockBookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <p>Booking not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-600';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'inProgress':
        return 'bg-blue-500/10 text-blue-600';
      case 'completed':
        return 'bg-gray-500/10 text-gray-600';
      case 'cancelled':
        return 'bg-red-500/10 text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking #{booking.id}</CardTitle>
                <Badge className={getStatusColor(booking.status)}>
                  {t(`booking.status.${booking.status}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Car className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Vehicle & Service</p>
                  <p>
                    {t(`vehicle.${booking.vehicleType}`)} -{' '}
                    {t(`service.${booking.service}`)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p>{new Date(booking.timeSlot).toLocaleString()}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Delivery Option</p>
                  <p>{t(`delivery.${booking.delivery}`)}</p>
                </div>
              </div>
              {booking.addOns.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Add-ons</p>
                      <ul className="space-y-1">
                        {booking.addOns.map((addon) => (
                          <li key={addon}>{t(`addon.${addon}`)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p>{booking.clientName}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p>{booking.clientEmail}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p>{booking.clientPhone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span>Total Price</span>
                  <span>€{booking.totalPrice}</span>
                </div>
              </CardContent>
            </Card>

            {booking.status === 'pending' && (
              <div className="space-y-3">
                <Button variant="destructive" className="w-full">
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
