import { createSlice } from '@reduxjs/toolkit'

interface RegisteredUser {
  name: string
  surname: string
  cell: string
  email: string
  passwordCipher: string
}

interface RegisterState {
  isRegistered: boolean
  user: RegisteredUser | null
  isAuthenticated: boolean
}

const initialState: RegisterState = {
  isRegistered: false,
  user: null,
  isAuthenticated: false,
}

const RegisterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    register: (state, action: { payload: RegisteredUser }) => {
      state.user = action.payload
      state.isRegistered = true
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.isAuthenticated = false
    },
    updateProfile: (state, action: { payload: Pick<RegisteredUser, 'name' | 'surname' | 'cell' | 'email'> }) => {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }
    },
    updateCredentials: (state, action: { payload: { passwordCipher: string } }) => {
      if (!state.user) return
      state.user.passwordCipher = action.payload.passwordCipher
    },
  },
})

export const { register, loginSuccess, logout, updateProfile, updateCredentials } = RegisterSlice.actions
export default RegisterSlice.reducer