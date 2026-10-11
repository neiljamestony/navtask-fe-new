import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    authStatus: string;
    authData: {
        username: string;
        userId: number;
        userType: string;
    }
}

const initialState: AuthState = {
    authStatus: "",
    authData: {
        username: "",
        userId: 0,
        userType: ""
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthStatus: (state, action: PayloadAction<string>) => {
            state.authStatus = action.payload;
        },
        setAuthData: (state, action: PayloadAction<{ userId: number, username: string, userType: string }>) => {
            state.authData = action.payload;
        }
    }
})

export const { setAuthStatus, setAuthData } = authSlice.actions;
export default authSlice.reducer;