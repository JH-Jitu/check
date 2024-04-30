// store/store.js
import { create } from "zustand";

const useProjectStore = create((set) => ({
  // State
  projects: [],

  setProjects: (projects) => set({ projects }),
}));

export default useProjectStore;
