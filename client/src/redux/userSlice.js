import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currUser:null,
  loading:false,
  error:false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state,action) => {
      state.loading = false;
      state.currUser = action.payload;
    },
    loginFaliure: (state) => {
      state.error = true;
      state.loading = false;
      state.currUser = null

      
    },
    logout:(state)=>{
        state.currUser = null
        state.loading = false
        state.error = false
    },
    subscribe:(state, action)=>{
      if(state.currUser.subscribedUsers.includes(action.payload)){
        state.currUser.subscribedUsers.splice(
          state.currUser.subscribedUsers.findIndex(channelId => channelId == action.payload),
          1
        )

      }else{
        state.currUser.subscribedUsers.push(action.payload)
      }

    }
   
  }

    
    
  
})

// Action creators are generated for each case reducer function
export const { loginStart, loginSuccess, loginFaliure, logout, subscribe  } = userSlice.actions

export default userSlice.reducer