import { create } from "zustand";

const useBatterStore = create((set) => ({
    selectedBatter: "V Kohli",
    setSelectedBatter: (player) => set({ selectedBatter: player }),
    selectedBowler:"JJ Bumrah",
    setSelectedBowler: (bowler) => set({selectedBowler:bowler}),
}));

export default useBatterStore;
