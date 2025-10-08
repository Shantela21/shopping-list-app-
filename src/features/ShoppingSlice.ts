import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api from '../api/client'

export type ImageData = string

export interface ShoppingItem {
  id: string | number
  name: string
  quantity: number
  notes?: string
  category: string
  images: ImageData[]
  createdAt: string
}

export interface ShoppingList {
  id: string | number
  userEmail: string
  name: string
  coverImage?: ImageData
  items: ShoppingItem[]
  createdAt: string
}

export interface ShoppingState {
  lists: ShoppingList[]
  selectedListId: string | number | null
  loading: boolean
  error?: string
}

const initialState: ShoppingState = {
  lists: [],
  selectedListId: null,
  loading: false,
}

export const fetchLists = createAsyncThunk<ShoppingList[], { userEmail: string }>(
  'shopping/fetchLists',
  async ({ userEmail }) => {
    const { data } = await api.get<ShoppingList[]>(`/shoppingLists`, { params: { userEmail } })
    return data
  }
)

export const createList = createAsyncThunk<ShoppingList, { name: string; userEmail: string; coverImage?: ImageData }>(
  'shopping/createList',
  async ({ name, userEmail, coverImage }) => {
    const payload = { name, userEmail, coverImage, items: [], createdAt: new Date().toISOString() }
    const { data } = await api.post<ShoppingList>('/shoppingLists', payload)
    return data
  }
)

export const renameList = createAsyncThunk<ShoppingList, { id: string | number; name: string }>(
  'shopping/renameList',
  async ({ id, name }, { getState }) => {
    const state = getState() as { shopping: ShoppingState }
    const existing = state.shopping.lists.find(l => l.id === id)
    if (!existing) throw new Error('List not found')
    const { data } = await api.patch<ShoppingList>(`/shoppingLists/${id}`, { name })
    return data
  }
)

export const deleteList = createAsyncThunk<string | number, { id: string | number }>(
  'shopping/deleteList',
  async ({ id }) => {
    await api.delete(`/shoppingLists/${id}`)
    return id
  }
)

export const addItem = createAsyncThunk<ShoppingList, { listId: string | number; item: Omit<ShoppingItem, 'id' | 'createdAt'> }>(
  'shopping/addItem',
  async ({ listId, item }, { getState }) => {
    const state = getState() as { shopping: ShoppingState }
    const list = state.shopping.lists.find(l => l.id === listId)
    if (!list) throw new Error('List not found')
    const newItem: ShoppingItem = { id: Date.now(), createdAt: new Date().toISOString(), ...item }
    const updated = { ...list, items: [...list.items, newItem] }
    const { data } = await api.put<ShoppingList>(`/shoppingLists/${listId}`, updated)
    return data
  }
)

export const updateItem = createAsyncThunk<ShoppingList, { listId: string | number; itemId: string | number; changes: Partial<Omit<ShoppingItem, 'id' | 'createdAt'>> }>(
  'shopping/updateItem',
  async ({ listId, itemId, changes }, { getState }) => {
    const state = getState() as { shopping: ShoppingState }
    const list = state.shopping.lists.find(l => l.id === listId)
    if (!list) throw new Error('List not found')
    const updatedItems = list.items.map(i => (i.id === itemId ? { ...i, ...changes } : i))
    const updated = { ...list, items: updatedItems }
    const { data } = await api.put<ShoppingList>(`/shoppingLists/${listId}`, updated)
    return data
  }
)

export const deleteItem = createAsyncThunk<ShoppingList, { listId: string | number; itemId: string | number }>(
  'shopping/deleteItem',
  async ({ listId, itemId }, { getState }) => {
    const state = getState() as { shopping: ShoppingState }
    const list = state.shopping.lists.find(l => l.id === listId)
    if (!list) throw new Error('List not found')
    const updated = { ...list, items: list.items.filter(i => i.id !== itemId) }
    const { data } = await api.put<ShoppingList>(`/shoppingLists/${listId}`, updated)
    return data
  }
)

const slice = createSlice({
  name: 'shopping',
  initialState,
  reducers: {
    selectList: (state, action: PayloadAction<{ id: string | number }>) => {
      state.selectedListId = action.payload.id
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.loading = true
        state.error = undefined
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.loading = false
        state.lists = action.payload
        if (state.lists.length && !state.selectedListId) {
          state.selectedListId = state.lists[0].id
        }
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch lists'
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.lists.push(action.payload)
        state.selectedListId = action.payload.id
      })
      .addCase(renameList.fulfilled, (state, action) => {
        const idx = state.lists.findIndex(l => l.id === action.payload.id)
        if (idx >= 0) state.lists[idx] = action.payload
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        const deletedId = action.payload
        state.lists = state.lists.filter(l => l.id !== deletedId)
        if (state.selectedListId === deletedId) {
          state.selectedListId = state.lists[0]?.id ?? null
        }
      })
      .addCase(addItem.fulfilled, (state, action) => {
        const idx = state.lists.findIndex(l => l.id === action.payload.id)
        if (idx >= 0) state.lists[idx] = action.payload
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const idx = state.lists.findIndex(l => l.id === action.payload.id)
        if (idx >= 0) state.lists[idx] = action.payload
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        const idx = state.lists.findIndex(l => l.id === action.payload.id)
        if (idx >= 0) state.lists[idx] = action.payload
      })
  }
})

export const { selectList } = slice.actions
export default slice.reducer
