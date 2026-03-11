import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  cart: [],
  discount: 0,
  isAuthModalOpen: false,

  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
  logout: () => set({ user: null, cart: [], discount: 0 }),
  setDiscount: (val) => set({ discount: val }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  addToCart: (product, quantity, weight, price) => set((state) => {
    // Check if same product + weight exists
    const existingIndex = state.cart.findIndex(
      (item) => item.product._id === product._id && item.weight === weight
    );

    if (existingIndex >= 0) {
      const newCart = [...state.cart];
      newCart[existingIndex].quantity += quantity;
      return { cart: newCart };
    }

    return { cart: [...state.cart, { product, quantity, weight, priceAtTime: price }] };
  }),

  removeFromCart: (productId, weight) => set((state) => ({
    cart: state.cart.filter((item) => !(item.product._id === productId && item.weight === weight))
  })),

  clearCart: () => set({ cart: [], discount: 0 }),

  cartTotal: () => {
    return useStore.getState().cart.reduce((total, item) => total + (item.priceAtTime * item.quantity), 0);
  }
}));

export default useStore;
