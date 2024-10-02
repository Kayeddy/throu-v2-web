import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  loadingReasons: Set<string>;
  setLoading: (reason: string) => void;
  removeLoading: (reason: string) => void;
  resetLoading: () => void;
}

// Zustand store for global loading management
const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingReasons: new Set<string>(),

  // Function to add a loading reason
  setLoading: (reason: string) =>
    set((state) => {
      const updatedReasons = new Set(state.loadingReasons).add(reason);
      return {
        loadingReasons: updatedReasons,
        isLoading: updatedReasons.size > 0,
      };
    }),

  // Function to remove a loading reason
  removeLoading: (reason: string) =>
    set((state) => {
      const updatedReasons = new Set(state.loadingReasons);
      updatedReasons.delete(reason);
      return {
        loadingReasons: updatedReasons,
        isLoading: updatedReasons.size > 0,
      };
    }),

  // Reset all loading states
  resetLoading: () =>
    set({
      loadingReasons: new Set<string>(),
      isLoading: false,
    }),
}));

export default useLoadingStore;
