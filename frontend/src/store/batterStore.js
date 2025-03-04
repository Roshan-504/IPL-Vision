import { create } from "zustand";

const useBatterStore = create((set) => ({
    selectedBatter: "V Kohli",
    setSelectedBatter: (player) => set({ selectedBatter: player }),
}));

export default useBatterStore;
