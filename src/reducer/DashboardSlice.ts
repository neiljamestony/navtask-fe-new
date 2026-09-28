import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

interface DashboardState {
    filteredPriorityItems: string;
    filteredStatusItems: string;
}

const initialState: DashboardState = {
    filteredPriorityItems: "",
    filteredStatusItems: ""
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setFilteredPriorityItems: (state, action: PayloadAction<string>) => {
            state.filteredPriorityItems = action.payload;
        },
        setFilteredStatusItems: (state, action: PayloadAction<string>) => {
            state.filteredStatusItems = action.payload;
        }
    }
})
export const { setFilteredPriorityItems, setFilteredStatusItems } = dashboardSlice.actions;
export default dashboardSlice.reducer;