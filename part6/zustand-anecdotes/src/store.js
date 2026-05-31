import { create } from 'zustand'

const useFilterStore = create((set) => ({
  filter: '',
  actions: {
    setFilter: (text) => set({ filter: text }),
  },
}))

export const useFilter = () => useFilterStore((state) => state.filter)
export const useFilterActions = () => useFilterStore((state) => state.actions)

export const resetStores = () => {
  useFilterStore.setState({ filter: '' })
}
