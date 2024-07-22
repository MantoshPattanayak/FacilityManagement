// languageSlice.js
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  language: localStorage.getItem("language") || 'EN',
  languageContent: [],
  isLanguageContentFetched: false
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
    setLanguageContent(state, action) {
      state.languageContent = action.payload;
      localStorage.setItem("languageContent", JSON.stringify(action.payload));
      state.isLanguageContentFetched = true;
    },
  },
});

export const { setLanguage, setLanguageContent } = languageSlice.actions;

export default languageSlice.reducer;
