import { createSlice } from '@reduxjs/toolkit'

interface RegisteredUser {
  name: string
  surname: string
  cell: string
  email: string
}

interface RegisterState {
  isRegistered: boolean
  user: RegisteredUser | null
}

const initialState: RegisterState = {
  isRegistered: false,
  user: null,
}

const RegisterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    register: (state, action: { payload: RegisteredUser }) => {
      state.user = action.payload
      state.isRegistered = true
    },
  },
})

export const { register } = RegisterSlice.actions
export default RegisterSlice.reducer