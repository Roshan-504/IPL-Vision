import { create } from "zustand";

const useBatterStore = create((set) => ({
    selectedBatter: "V Kohli",
    setSelectedBatter: (player) => set({ selectedBatter : player }),
    selectedBowler:"JJ Bumrah",
    setSelectedBowler: (bowler) => set({selectedBowler : bowler}),
    selectedTeam:"Mumbai Indians",
    setSelectedTeam: (team) => set({selectedTeam : team}),
}));

export default useBatterStore;
