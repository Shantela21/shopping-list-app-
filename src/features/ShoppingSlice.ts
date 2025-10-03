import { createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ImageData = string // data URL or remote URL

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  notes?: string
  category: string
  images: ImageData[]
  createdAt: string
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  createdAt: string
}

export interface ShoppingState {
  lists: ShoppingList[]
  selectedListId: string | null
}

const STORAGE_KEY = 'shopping_state_v1'

function loadState(): ShoppingState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as ShoppingState
    return parsed
  } catch {
    return undefined
  }
}

function saveState(state: ShoppingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const initialState: ShoppingState = loadState() ?? {
  lists: [],
  selectedListId: null,
}

const slice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    createList: (state, action: PayloadAction<{ name: string }>) => {
      const list: ShoppingList = {
        id: nanoid(),
        name: action.payload.name,
        items: [],
        createdAt: new Date().toISOString(),
      }
      state.lists.push(list)
      state.selectedListId = list.id
      saveState(state)
    },
    renameList: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const list = state.lists.find(l => l.id === action.payload.id)
      if (list) {
        list.name = action.payload.name
        saveState(state)
      }
    },
    deleteList: (state, action: PayloadAction<{ id: string }>) => {
      state.lists = state.lists.filter(l => l.id !== action.payload.id)
      if (state.selectedListId === action.payload.id) {
        state.selectedListId = state.lists[0]?.id ?? null
      }
      saveState(state)
    },
    selectList: (state, action: PayloadAction<{ id: string }>) => {
      state.selectedListId = action.payload.id
      saveState(state)
    },

    addItem: (state, action: PayloadAction<{ listId: string; item: Omit<ShoppingItem, 'id' | 'createdAt'> }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId)
      if (list) {
        const newItem: ShoppingItem = { id: nanoid(), createdAt: new Date().toISOString(), ...action.payload.item }
        list.items.push(newItem)
        saveState(state)
      }
    },
    updateItem: (state, action: PayloadAction<{ listId: string; itemId: string; changes: Partial<Omit<ShoppingItem, 'id' | 'createdAt'>> }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId)
      if (!list) return
      const item = list.items.find(i => i.id === action.payload.itemId)
      if (!item) return
      Object.assign(item, action.payload.changes)
      saveState(state)
    },
    deleteItem: (state, action: PayloadAction<{ listId: string; itemId: string }>) => {
      const list = state.lists.find(l => l.id === action.payload.listId)
      if (!list) return
      list.items = list.items.filter(i => i.id !== action.payload.itemId)
      saveState(state)
    },
    clearAll: (state) => {
      state.lists = []
      state.selectedListId = null
      saveState(state)
    },
  },
})

export const { createList, renameList, deleteList, selectList, addItem, updateItem, deleteItem, clearAll } = slice.actions
export default slice.reducer
