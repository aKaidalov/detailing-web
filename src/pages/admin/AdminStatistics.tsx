import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Calendar, DollarSign, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useBookingAnalytics, useRevenueAnalytics } from '../../api/hooks';
import type { AnalyticsPeriod } from '../../api/types';

export function AdminStatistics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>('WEEK');

  const { data: bookingStats, isLoading: bookingLoading, error: bookingError } = useBookingAnalytics(period);
  const { data: revenueStats, isLoading: revenueLoading, error: revenueError } = useRevenueAnalytics(period);

  const isLoading = bookingLoading || revenueLoading;
  const error = bookingError || revenueError;

  // Prepare pie chart data for booking status breakdown
  const statusData = bookingStats
    ? [
        { name: 'Pending', value: bookingStats.pendingCount, color: 'hsl(var(--chart-1))' },
        { name: 'Confirmed', value: bookingStats.confirmedCount, color: 'hsl(var(--chart-2))' },
        { name: 'Completed', value: bookingStats.completedCount, color: 'hsl(var(--chart-3))' },
        { name: 'Cancelled', value: bookingStats.cancelledCount, color: 'hsl(var(--chart-4))' },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Statistics</h2>
          <p className="text-muted-foreground mt-1">
            Business analytics and insights
          </p>
        </div>
        <Select value={period} onValueChange={(value) => setPeriod(value as AnalyticsPeriod)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAY">Today</SelectItem>
            <SelectItem value="WEEK">This Week</SelectItem>
            <SelectItem value="MONTH">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load analytics data. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {revenueStats ? formatCurrency(revenueStats.totalRevenue) : '€0'}
                  </div>
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{periodLabels[period]}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">{bookingStats?.totalBookings ?? 0}</div>
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{periodLabels[period]}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Order Value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">
                    {revenueStats ? formatCurrency(revenueStats.averageOrderValue) : '€0'}
                  </div>
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{periodLabels[period]}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">{revenueStats?.completedBookings ?? 0}</div>
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{periodLabels[period]}</p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Status</CardTitle>
                <CardDescription>Distribution of booking statuses {periodLabels[period].toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
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
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No bookings in this period
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
                <CardDescription>Detailed booking counts by status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span>Pending</span>
                  </div>
                  <span className="font-bold">{bookingStats?.pendingCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span>Confirmed</span>
                  </div>
                  <span className="font-bold">{bookingStats?.confirmedCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
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

          {/* Date Range Info */}
          {bookingStats && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  Data for period: {bookingStats.startDate} to {bookingStats.endDate}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
