import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { useBookingAnalytics, useRevenueAnalytics, useAdminBookings } from '../../api/hooks';
import type { AnalyticsPeriod } from '../../api/types';
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<AnalyticsPeriod>('WEEK');

  const { data: bookingStats, isLoading: bookingLoading } = useBookingAnalytics(period);
  const { data: revenueStats, isLoading: revenueLoading } = useRevenueAnalytics(period);
  const { data: allBookings, isLoading: bookingsLoading } = useAdminBookings();

  const isLoading = bookingLoading || revenueLoading || bookingsLoading;

  // Filter pending bookings
  const pendingBookings = (allBookings || []).filter((b) => b.status === 'PENDING');

  // Prepare pie chart data - colors match status badges in AdminBookings
  const statusData = bookingStats
    ? [
        { name: 'Pending', value: bookingStats.pendingCount, color: '#eab308' },    // yellow-500
        { name: 'Confirmed', value: bookingStats.confirmedCount, color: '#22c55e' }, // green-500
        { name: 'Completed', value: bookingStats.completedCount, color: '#6b7280' }, // gray-500
        { name: 'Cancelled', value: bookingStats.cancelledCount, color: '#ef4444' }, // red-500
      ].filter((item) => item.value > 0)
    : [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const periodLabels: Record<AnalyticsPeriod, string> = {
    DAY: 'Today',
    WEEK: 'This Week',
    MONTH: 'This Month',
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Overview of your business performance
          </p>
        </div>
        <Select value={period} onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAY">Today</SelectItem>
            <SelectItem value="WEEK">This Week</SelectItem>
            <SelectItem value="MONTH">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Revenue</CardDescription>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {revenueStats ? formatCurrency(revenueStats.totalRevenue) : '€0'}
                </div>
                <p className="text-sm text-muted-foreground">{periodLabels[period]}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Total Bookings</CardDescription>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingStats?.totalBookings ?? 0}</div>
                <p className="text-sm text-muted-foreground">{periodLabels[period]}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Pending</CardDescription>
                  <Clock className="w-4 h-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingStats?.pendingCount ?? 0}</div>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription>Completed</CardDescription>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookingStats?.completedCount ?? 0}</div>
                <p className="text-sm text-muted-foreground">{periodLabels[period]}</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Status</CardTitle>
                <CardDescription>Distribution {periodLabels[period].toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                    No bookings in this period
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
                <CardDescription>Detailed counts {periodLabels[period].toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span>Pending</span>
                  </div>
                  <span className="font-bold">{bookingStats?.pendingCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Confirmed</span>
                  </div>
                  <span className="font-bold">{bookingStats?.confirmedCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gray-500" />
                    <span>Completed</span>
                  </div>
                  <span className="font-bold">{bookingStats?.completedCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span>Cancelled</span>
                  </div>
                  <span className="font-bold">{bookingStats?.cancelledCount ?? 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Bookings Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>
                    Bookings waiting for your approval
                  </CardDescription>
                </div>
                {pendingBookings.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin/bookings')}>
                    View All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {pendingBookings.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No pending bookings
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="hidden md:table-cell">Service</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingBookings.slice(0, 5).map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">{booking.reference}</TableCell>
                          <TableCell>
                            <div>
                              <p>{booking.firstName} {booking.lastName}</p>
                              <p className="text-sm text-muted-foreground hidden md:block">{booking.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{booking.packageName}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(booking.timeSlotDate)} {formatTime(booking.timeSlotStartTime)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">€{booking.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate('/admin/bookings')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
