import { create } from 'zustand';

// Placeholder Zustand store for local asset state
export const useAssetStore = create((set) => ({
  selectedAssetId: null,
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),
  clearSelectedAssetId: () => set({ selectedAssetId: null }),
}));
