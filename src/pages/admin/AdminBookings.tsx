import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  useAdminBookings,
  useUpdateBookingStatus,
} from '../../api/hooks';
import type { AdminBookingDto, BookingStatus } from '../../api/types';
import { Search, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
    case 'COMPLETED':
      return 'bg-gray-500/10 text-gray-600';
    case 'CANCELLED_BY_CUSTOMER':
    case 'CANCELLED_BY_ADMIN':
      return 'bg-red-500/10 text-red-600';
    default:
      return '';
  }
};

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (timeStr: string | null | undefined) => {
  if (!timeStr) return '—';
  // timeStr is "HH:mm:ss" or "HH:mm"
  return timeStr.substring(0, 5);
};

export function AdminBookings() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingDto | null>(null);

  const { data: bookings, isLoading, error } = useAdminBookings();
  const updateStatus = useUpdateBookingStatus();

  const filteredBookings = (bookings || []).filter((booking) => {
    const matchesStatus =
      statusFilter === 'all' ||
      booking.status === statusFilter ||
      (statusFilter === 'CANCELLED' &&
        (booking.status === 'CANCELLED_BY_CUSTOMER' || booking.status === 'CANCELLED_BY_ADMIN'));
    const fullName = `${booking.firstName} ${booking.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirm = (booking: AdminBookingDto) => {
    updateStatus.mutate(
      { id: booking.id, status: 'CONFIRMED' },
      {
        onSuccess: () => {
          toast.success(`Booking ${booking.reference} confirmed`);
        },
        onError: (err) => {
          toast.error(`Failed to confirm: ${err.message}`);
        },
      }
    );
  };

  const handleCancel = (booking: AdminBookingDto) => {
    updateStatus.mutate(
      { id: booking.id, status: 'CANCELLED_BY_ADMIN' },
      {
        onSuccess: () => {
          toast.success(`Booking ${booking.reference} cancelled`);
        },
        onError: (err) => {
          toast.error(`Failed to cancel: ${err.message}`);
        },
      }
    );
  };

  const handleComplete = (booking: AdminBookingDto) => {
    updateStatus.mutate(
      { id: booking.id, status: 'COMPLETED' },
      {
        onSuccess: () => {
          toast.success(`Booking ${booking.reference} marked as completed`);
        },
        onError: (err) => {
          toast.error(`Failed to complete: ${err.message}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        Failed to load bookings: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Bookings</h2>
        <p className="text-muted-foreground mt-1">
          View and manage all customer bookings
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="searchQuery"
            name="searchQuery"
            placeholder="Search by name, email, or reference..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No bookings found
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="hidden md:table-cell">Service</TableHead>
                  <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">
                      {booking.reference}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{booking.firstName} {booking.lastName}</p>
                        <p className="text-sm text-muted-foreground">{booking.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p>{booking.packageName}</p>
                        <p className="text-sm text-muted-foreground">{booking.vehicleTypeName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div>
                        <p>{formatDate(booking.timeSlotDate)}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(booking.timeSlotStartTime)} - {formatTime(booking.timeSlotEndTime)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {statusLabels[booking.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-medium">
                      €{booking.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(booking)}
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {booking.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConfirm(booking)}
                              disabled={updateStatus.isPending}
                              title="Confirm booking"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(booking)}
                              disabled={updateStatus.isPending}
                              title="Cancel booking"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleComplete(booking)}
                            disabled={updateStatus.isPending}
                            title="Mark as completed"
                          >
                            <CheckCircle className="w-4 h-4 text-gray-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedBooking?.reference}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {statusLabels[selectedBooking.status]}
                </Badge>
              </div>

              {/* Customer Info */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Customer</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p>{selectedBooking.firstName} {selectedBooking.lastName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p>{selectedBooking.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <p>{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vehicle:</span>
                    <p>{selectedBooking.vehicleRegNumber}</p>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Service</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vehicle Type:</span>
                    <p>{selectedBooking.vehicleTypeName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Package:</span>
                    <p>{selectedBooking.packageName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Delivery:</span>
                    <p>{selectedBooking.deliveryTypeName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p>
                      {formatDate(selectedBooking.timeSlotDate)},{' '}
                      {formatTime(selectedBooking.timeSlotStartTime)} -{' '}
                      {formatTime(selectedBooking.timeSlotEndTime)}
                    </p>
                  </div>
                </div>
                {selectedBooking.addOns.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Add-ons:</span>
                    <ul className="list-disc list-inside">
                      {selectedBooking.addOns.map((addon) => (
                        <li key={addon.id}>
                          {addon.name} (+€{addon.price.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedBooking.address && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Address:</span>
                    <p>{selectedBooking.address}</p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Price Breakdown</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>{selectedBooking.vehicleTypeName} (base)</span>
                    <span>€{selectedBooking.vehicleTypeBasePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{selectedBooking.packageName}</span>
                    <span>€{selectedBooking.packagePrice.toFixed(2)}</span>
                  </div>
                  {selectedBooking.addOns.map((addon) => (
                    <div key={addon.id} className="flex justify-between">
                      <span>{addon.name}</span>
                      <span>€{addon.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span>{selectedBooking.deliveryTypeName}</span>
                    <span>€{selectedBooking.deliveryTypePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total</span>
                    <span>€{selectedBooking.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-xs text-muted-foreground">
                Created: {new Date(selectedBooking.createdAt).toLocaleString()}
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedBooking?.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleCancel(selectedBooking);
                    setSelectedBooking(null);
                  }}
                  disabled={updateStatus.isPending}
                >
                  Cancel Booking
                </Button>
                <Button
                  onClick={() => {
                    handleConfirm(selectedBooking);
                    setSelectedBooking(null);
                  }}
                  disabled={updateStatus.isPending}
                >
                  Confirm Booking
                </Button>
              </>
            )}
            {selectedBooking?.status === 'CONFIRMED' && (
              <Button
                onClick={() => {
                  handleComplete(selectedBooking);
                  setSelectedBooking(null);
                }}
                disabled={updateStatus.isPending}
              >
                Mark as Completed
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
