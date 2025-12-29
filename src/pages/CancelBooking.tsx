import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../api/client';

type CancelState = 'confirm' | 'loading' | 'success' | 'error';

export function CancelBooking() {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<CancelState>('confirm');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCancel = async () => {
    if (!reference) return;

    setState('loading');
    try {
      await api.delete(`/bookings/${reference}`);
      setState('success');
    } catch (error) {
      setState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to cancel booking. Please try again.'
      );
    }
  };

  if (state === 'success') {
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
            <p className="text-muted-foreground">
              A confirmation email has been sent to your email address.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/')}>Return Home</Button>
              <Button variant="outline" onClick={() => navigate('/booking')}>
                Book Another Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-[calc(100vh-80px)] py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Cancellation Failed</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3">
              <Button onClick={() => setState('confirm')}>Try Again</Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 flex items-center justify-center">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Cancel Booking?</CardTitle>
          <CardDescription>
            Are you sure you want to cancel your booking?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {reference && (
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className="text-xl font-mono font-bold">{reference}</p>
            </div>
          )}
          <p className="text-muted-foreground">
            This action cannot be undone. You will need to make a new booking if you change your mind.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={state === 'loading'}
            >
              {state === 'loading' ? 'Cancelling...' : 'Yes, Cancel Booking'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              No, Keep My Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
