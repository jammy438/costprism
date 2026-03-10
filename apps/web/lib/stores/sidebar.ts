import { create } from 'zustand'

interface SidebarStore {
  collapsed: boolean
  toggle: () => void
}

const useSidebarStore = create<SidebarStore>((set) => ({
  collapsed: false,
  toggle: () => set((state) => ({ collapsed: !state.collapsed })),
}))

export { useSidebarStore }