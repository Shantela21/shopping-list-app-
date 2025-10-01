import { createSlice } from '@reduxjs/toolkit'

const RegisterSlice = createSlice({
    name: 'register',
    initialState: {
        isRegistered: false,
    },
    reducers: {}
})     

export default RegisterSlice.reducer