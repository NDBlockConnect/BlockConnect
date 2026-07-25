import { create } from 'zustand'
import type { Category, Language } from '@/data/projects'

export interface FilterState {
  query: string
  categories: Set<Category>
  languages: Set<Language>
  licenses: Set<string>
  archived: 'all' | 'active' | 'archived'
  setQuery: (q: string) => void
  toggleCategory: (c: Category) => void
  toggleLanguage: (l: Language) => void
  toggleLicense: (l: string) => void
  setArchived: (a: 'all' | 'active' | 'archived') => void
  reset: () => void
}

const initial = {
  query: '',
  categories: new Set<Category>(),
  languages: new Set<Language>(),
  licenses: new Set<string>(),
  archived: 'all' as const,
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export const useProjectsStore = create<FilterState>((set) => ({
  ...initial,
  setQuery: (q) => set({ query: q }),
  toggleCategory: (c) => set((s) => ({ categories: toggle(s.categories, c) })),
  toggleLanguage: (l) => set((s) => ({ languages: toggle(s.languages, l) })),
  toggleLicense: (l) => set((s) => ({ licenses: toggle(s.licenses, l) })),
  setArchived: (a) => set({ archived: a }),
  reset: () =>
    set({
      ...initial,
      categories: new Set(),
      languages: new Set(),
      licenses: new Set(),
    }),
}))
