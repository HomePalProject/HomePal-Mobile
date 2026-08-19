import { create } from 'zustand';

interface DrawerState {
  isOpen: boolean;
  activeRoute: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setActiveRoute: (route: string) => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  activeRoute: 'household',
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
  setActiveRoute: (route: string) => set({ activeRoute: route }),
}));
