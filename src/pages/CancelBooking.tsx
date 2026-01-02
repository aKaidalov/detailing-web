import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AlertCircle, Calendar, Car, CheckCircle, Loader2, Package, Truck, XCircle } from 'lucide-react';
import { useBookingByReference, useCancelBooking } from '../api/hooks';
import type { BookingStatus } from '../api/types';

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED_BY_CUSTOMER: 'Cancelled',
  CANCELLED_BY_ADMIN: 'Cancelled',
  COMPLETED: 'Completed',
};

const getStatusColor = (status: BookingStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-500/10 text-green-600';
    case 'PENDING':
      return 'bg-yellow-500/10 text-yellow-600';
    case 'CANCELLED_BY_CUSTOMER':
    case 'CANCELLED_BY_ADMIN':
      return 'bg-red-500/10 text-red-600';
    case 'COMPLETED':
      return 'bg-blue-500/10 text-blue-600';
    default:
      return 'bg-gray-500/10 text-gray-600';
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (timeStr: string) => {
  return timeStr.substring(0, 5); // "09:00:00" -> "09:00"
};

export function CancelBooking() {
  const { reference } = useParams<{ reference: string }>();
  const { data: booking, isLoading, error } = useBookingByReference(reference);
  const cancelMutation = useCancelBooking();
  const [cancelled, setCancelled] = useState(false);

  const handleCancel = async () => {
    if (!reference) return;
    await cancelMutation.mutateAsync(reference);
    setCancelled(true);
  };

  const isCancellable = booking &&
    (booking.status === 'PENDING' || booking.status === 'CONFIRMED');

  const isAlreadyCancelled = booking &&
    (booking.status === 'CANCELLED_BY_CUSTOMER' || booking.status === 'CANCELLED_BY_ADMIN');

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] py-8 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[calc(100vh-80px)] py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Booking Not Found</CardTitle>
            <CardDescription>
              We couldn't find a booking with reference "{reference}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="min-h-[calc(100vh-80px)] py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Booking Cancelled</CardTitle>
            <CardDescription>
              Your booking has been successfully cancelled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="text-2xl font-mono font-bold">{reference}</p>
            </div>
            <p className="text-muted-foreground">
              A cancellation confirmation email has been sent to your email address.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link to="/">Return Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/booking">Book Another Service</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isAlreadyCancelled ? (
              <XCircle className="w-16 h-16 text-red-500" />
            ) : (
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isAlreadyCancelled ? 'Booking Already Cancelled' : 'Cancel Booking'}
          </CardTitle>
          <CardDescription>
            {isAlreadyCancelled
              ? 'This booking has already been cancelled.'
              : 'Review your booking details before cancelling.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reference & Status */}
          <div className="flex items-center justify-between bg-muted rounded-lg p-4">
            <div>
              <p className="text-sm text-muted-foreground">Booking Reference</p>
              <p className="text-xl font-mono font-bold">{booking.reference}</p>
            </div>
            <Badge className={getStatusColor(booking.status)}>
              {statusLabels[booking.status]}
            </Badge>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{formatDate(booking.timeSlotDate)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(booking.timeSlotStartTime)} - {formatTime(booking.timeSlotEndTime)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{booking.vehicleTypeName}</p>
                <p className="text-sm text-muted-foreground">{booking.vehicleRegNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{booking.packageName}</p>
                {booking.addOns.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    + {booking.addOns.map(a => a.name).join(', ')}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{booking.deliveryTypeName}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price</span>
              <span className="text-xl font-bold">{'\u20AC'}{booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          {isCancellable ? (
            <div className="space-y-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">Keep My Booking</Link>
              </Button>
              {cancelMutation.isError && (
                <p className="text-sm text-destructive text-center">
                  Failed to cancel booking. Please try again.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                {booking.status === 'COMPLETED'
                  ? 'This booking has already been completed and cannot be cancelled.'
                  : 'This booking cannot be cancelled.'}
              </p>
              <Button className="w-full" asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
