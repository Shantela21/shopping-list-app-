import { createSlice } from '@reduxjs/toolkit'

interface LoginState {
    email: string;
    password: string;
}

const initialState: LoginState = {
    email: '',
    password: '',
};

const LoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
    
    }
})     

export default LoginSlice.reducer