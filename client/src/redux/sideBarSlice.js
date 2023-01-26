import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isopen:false,
  key:1
}


export const sideBarSlice = createSlice({
    name:'sidebar',
    initialState,
    reducers:{
        toggleSideBar:(state)=>{
            state.isopen = !state.isopen
        },
        toggleButton: (state, action) => {
            state.key = action.payload
        }
    }
})

export const {toggleSideBar, toggleButton} = sideBarSlice.actions;
export default sideBarSlice.reducer; 