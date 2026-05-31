import { create } from "zustand";

export const useReviewsStore = create((set) => ({
  values: {
    good: 0,
    neutral: 0,
    bad: 0,
  },
  actions: {
    incrementGood: () =>
      set((state) => ({
        values: { ...state.values, good: state.values.good + 1 },
      })),
    incrementNeutral: () =>
      set((state) => ({
        values: { ...state.values, neutral: state.values.neutral + 1 },
      })),
    incrementBad: () =>
      set((state) => ({
        values: { ...state.values, bad: state.values.bad + 1 },
      })),
  },
}));

export const useReviewsData = () => useReviewsStore((state) => state.values);
export const useReviewsActions = () =>
  useReviewsStore((state) => state.actions);
