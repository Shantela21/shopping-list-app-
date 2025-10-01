import { createSlice } from '@reduxjs/toolkit'

interface LoginState {
    email: string;
    password: string;
}

const initialState: LoginState = {
    email: 'dlozi@mlab.com',
    password: '12345',
};

const LoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
    
    }
})     

export default LoginSlice.reducer