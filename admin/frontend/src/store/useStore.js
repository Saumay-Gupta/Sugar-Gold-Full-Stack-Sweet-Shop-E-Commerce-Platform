import { create } from 'zustand';
import axios from 'axios';

const useStore = create((set) => ({
  user: null,
  isLoadingAuth: true,
  error: null,

  checkAuth: async () => {
    try {
      set({ isLoadingAuth: true, error: null });
      // The backend /api/admin/me checks both JWT and role === 'admin'
      const res = await axios.get('http://localhost:5000/api/admin/me', {
        withCredentials: true,
      });
      set({ user: res.data, isLoadingAuth: false });
    } catch (error) {
      set({ user: null, isLoadingAuth: false });
    }
  },

  login: async (phoneNumber, otp) => {
    try {
      set({ isLoadingAuth: true, error: null });
      const res = await axios.post('http://localhost:5000/api/auth/login', 
        { phoneNumber, otp, isAdminLogin: true },
        { withCredentials: true }
      );
      
      const userData = res.data.user;
      
      // Strict client-side check just in case, though backend should handle
      if (userData.role !== 'admin') {
         // Instantly force logout on backend if they sneak in
         await axios.post('http://localhost:5000/api/auth/logout', { isAdminLogout: true }, { withCredentials: true });
         set({ user: null, isLoadingAuth: false, error: 'Unauthorized: Admin access required.' });
         return false;
      }
      
      set({ user: userData, isLoadingAuth: false });
      return true;
    } catch (error) {
      set({ 
        user: null, 
        isLoadingAuth: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', { isAdminLogout: true }, {
        withCredentials: true,
      });
      set({ user: null });
    } catch (error) {
      console.error('Logout failed', error);
    }
  },
}));

export default useStore;
