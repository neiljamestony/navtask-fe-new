import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from '../reducer/AuthSlice';
import DashboardSlice from '../reducer/DashboardSlice';

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        dashboard: DashboardSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;