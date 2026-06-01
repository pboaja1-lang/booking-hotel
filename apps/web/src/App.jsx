import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SearchResults from "./components/SearchResults";
import RoomDetail from "./components/RoomDetail";
import FeaturedRooms from "./components/FeaturedRooms";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";
import BookingForm from "./components/BookingForm";
import HeroSection from "./components/HeroSection";
import PaymentForm from "./components/PaymentForm";
import BookingConfirmation from "./components/BookingConfirmation";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import UserLayout from "./components/UserLayout";
import DashboardOverview from "./components/DashboardOverview";
import UserProfile from "./components/UserProfile";
import BookingHistory from "./components/BookingHistory";
import BookingDetail from "./components/BookingDetail";

// Admin Imports
import { AdminProvider } from "./context/AdminContext";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminKamar from "./components/admin/AdminKamar";
import AdminBooking from "./components/admin/AdminBooking";
import AdminTamu from "./components/admin/AdminTamu";
import AdminPengaturan from "./components/admin/AdminPengaturan";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user || user.email !== 'admin@gmail.com') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      <FeaturedRooms />
      <WhyChooseUs />
    </main>
  );
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/room" element={<RoomDetail />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="booking/:bookingId" element={<BookingDetail />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="kamar" element={<AdminKamar />} />
          <Route path="booking" element={<AdminBooking />} />
          <Route path="tamu" element={<AdminTamu />} />
          <Route path="pengaturan" element={<AdminPengaturan />} />
        </Route>
      </Routes>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
