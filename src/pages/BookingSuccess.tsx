import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';

export function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <CardDescription>
            Your booking has been successfully created.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reference && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="text-2xl font-mono font-bold">{reference}</p>
            </div>
          )}
          <p className="text-muted-foreground">
            A confirmation email has been sent to your email address with all the booking details.
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
