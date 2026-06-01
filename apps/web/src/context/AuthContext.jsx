import React, { createContext, useContext, useState, useEffect } from 'react';
import { authClient } from '../lib/auth-client';
import api from '../lib/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const { data, isPending } = authClient.useSession();
  const [history, setHistory] = useState([]);
  
  const user = data?.user ? { ...data.user, role: data.user.role || 'user' } : null;

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setHistory([]);
    }
  }, [user?.id]);

  const mapBackendBookingToFrontend = (b) => {
    const formatDate = (dateMs) => {
      const d = new Date(dateMs);
      return `${d.getDate()} ${['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.getMonth()]} ${d.getFullYear()}`;
    };
    
    return {
      id: `#${b.id}`, // Add # to match frontend logic
      hotel: b.room?.name || "Hotel Room",
      roomType: b.room?.roomType?.name || "Standard Room",
      dates: `${formatDate(b.checkIn)} - ${formatDate(b.checkOut)}`,
      price: `Rp ${b.totalAmount?.toLocaleString('id-ID')}`,
      status: b.status === 'Pending' ? 'Aktif' : (b.status === 'Done' ? 'Selesai' : 'Dibatalkan'),
      image: b.room?.mainImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      guests: `${b.adults} Dewasa${b.children > 0 ? `, ${b.children} Anak` : ''}`,
      nights: b.nights,
      subtotal: b.subtotal,
      tax: b.taxAmount,
      total: b.totalAmount,
      location: b.room?.floorInfo || 'Jakarta',
      paymentMethod: b.payment?.method || 'Transfer Bank',
    };
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/me');
      const mapped = response.data.map(mapBackendBookingToFrontend);
      setHistory(mapped);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const register = async (email, password, name) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
    });
    if (error) throw new Error(error.message || "Gagal mendaftar");
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) throw new Error(error.message || "Email atau password salah");
    return data.user;
  };

  const logout = async () => {
    const { error } = await authClient.signOut();
    if (error) console.error("Error logging out", error);
  };

  const changePassword = async (email, oldPassword, newPassword) => {
    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword: oldPassword,
    });
    if (error) throw new Error(error.message);
  };

  const updateProfile = async (updates) => {
    const { error } = await authClient.updateUser({
      name: updates.name,
      image: updates.avatar
    });
    if (error) throw new Error(error.message);
  };

  const addBooking = async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      const mapped = mapBackendBookingToFrontend(response.data);
      setHistory([mapped, ...history]);
      return mapped;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Gagal membuat pesanan");
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  };

  const value = {
    user,
    history,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    addBooking,
    getAllUsers,
    fetchBookings,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isPending && children}
    </AuthContext.Provider>
  );
}
