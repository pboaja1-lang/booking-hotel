import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import api from '../lib/api';

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    }
  };

  // Actions for Rooms
  const deleteRoom = async (id) => {
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(prev => prev.filter(r => r.id !== id));
      alert("Kamar berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert(error.response?.data?.error || error.message || "Gagal menghapus kamar.");
      throw error;
    }
  };

  const addRoom = async (roomData) => {
    try {
      const response = await api.post('/rooms', roomData);
      setRooms(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding room:", error);
      throw error;
    }
  };

  const updateRoom = async (roomId, updatedData) => {
    try {
      const response = await api.put(`/rooms/${roomId}`, updatedData);
      setRooms(prev => prev.map(r => r.id === roomId ? response.data : r));
    } catch (error) {
      console.error("Error updating room:", error);
      throw error;
    }
  };

  const updateRoomStatus = async (roomId, newStatus) => {
    try {
      const response = await api.patch(`/rooms/${roomId}/status`, { status: newStatus });
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Error updating room status:", error);
      throw error;
    }
  };

  // Actions for Bookings
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      console.error("Error updating booking status:", error);
      throw error;
    }
  };

  const deleteBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
      alert("Pesanan berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(error.response?.data?.error || error.message || "Gagal menghapus pesanan.");
      throw error;
    }
  };

  const value = useMemo(() => ({
    rooms,
    bookings,
    fetchRooms,
    fetchBookings,
    deleteRoom,
    addRoom,
    updateRoom,
    updateRoomStatus,
    updateBookingStatus,
    deleteBooking,
  }), [rooms, bookings]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
