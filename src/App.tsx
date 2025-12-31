import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Booking } from './pages/Booking';
import { BookingSuccess } from './pages/BookingSuccess';
import { CancelBooking } from './pages/CancelBooking';
import { ClientDashboard } from './pages/ClientDashboard';
import { BookingDetail } from './pages/BookingDetail';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminVehicleTypes } from './pages/admin/AdminVehicleTypes';
import { AdminPackages } from './pages/admin/AdminPackages';
import { AdminAddOns } from './pages/admin/AdminAddOns';
import { AdminDeliveryTypes } from './pages/admin/AdminDeliveryTypes';
import { AdminTimeSlots } from './pages/admin/AdminTimeSlots';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminStatistics } from './pages/admin/AdminStatistics';
import { AdminSettings } from './pages/admin/AdminSettings';
import { Toaster } from './components/ui/sonner';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking/success" element={<BookingSuccess />} />
      <Route path="/cancel/:reference" element={<CancelBooking />} />

      {/* Client routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/:id"
        element={
          <ProtectedRoute>
            <BookingDetail />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="vehicle-types" element={<AdminVehicleTypes />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="add-ons" element={<AdminAddOns />} />
        <Route path="delivery-types" element={<AdminDeliveryTypes />} />
        <Route path="timeslots" element={<AdminTimeSlots />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="statistics" element={<AdminStatistics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <AppRoutes />
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
