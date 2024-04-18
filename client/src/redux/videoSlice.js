import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currVideo: null,
  allVideos: null,
  loading: false,
  error: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    getAllVideos: (state, action) => {
      state.allVideos = action.payload;
    },
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currVideo = action.payload;
    },
    fetchFaliure: (state) => {
      state.error = true;
      state.loading = false;
      state.currVideo = null;
    },
    like: (state, action) => {
      if (!state.currVideo.likes.includes(action.payload)) {
        state.currVideo.likes.push(action.payload);
        state.currVideo.disLikes.splice(
          state.currVideo.disLikes.findIndex(
            (userId) => userId == action.payload
          ),
          1
        );
      }
    },
    dislike: (state, action) => {
      if (!state.currVideo.disLikes.includes(action.payload)) {
        state.currVideo.disLikes.push(action.payload);
        state.currVideo.likes.splice(
          state.currVideo.likes.findIndex((userId) => userId == action.payload),
          1
        );
      }
    },
    clearVideo: (state, action) => {
      state.currVideo = null;
      state.error = false;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchStart,
  fetchSuccess,
  fetchFaliure,
  like,
  dislike,
  clearVideo,
  getAllVideos,
} = videoSlice.actions;

export default videoSlice.reducer;
