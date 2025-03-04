import { create } from "zustand";

const useBatterStore = create((set) => ({
    selectedBatter: null,
    setSelectedBatter: (player) => set({ selectedBatter: player }),
}));

export default useBatterStore;
