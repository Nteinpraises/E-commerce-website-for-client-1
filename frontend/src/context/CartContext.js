import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variant = null) => {
        const items = get().items;
        const key = `${product._id}-${variant?.value || ''}`;
        const existing = items.find(i => i.key === key);

        if (existing) {
          set({ items: items.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({ items: [...items, { key, productId: product._id, product, quantity, variant }] });
        }
      },

      removeItem: (key) => set({ items: get().items.filter(i => i.key !== key) }),

      updateQuantity: (key, quantity) => {
        if (quantity < 1) return get().removeItem(key);
        set({ items: get().items.map(i => i.key === key ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'cart-storage' }
  )
);
