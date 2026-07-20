import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  locale: string
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setLocale: (locale: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      sidebarCollapsed: false,
      locale: "en",
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "wakamalia-ui",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        locale: state.locale,
      }),
    }
  )
)
