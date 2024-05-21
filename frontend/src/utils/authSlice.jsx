import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    isUserLoggedIn: false,
    accessToken: sessionStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null
}
// Create Slice for store the data --------------------------------------------------
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            console.log("loginSuccess reducer called"); // Check if the reducer is being called
            const { accessToken, refreshToken, user, sid } = action.payload;
            console.log("accessToken:", accessToken);   // Check if accessToken is correct
            console.log("refreshToken:", refreshToken);  // Check if refreshToken is correct
            console.log("here user", user)
            state.isUserLoggedIn = true;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.user = user;
            state.sid = sid;
            // Storing tokens in session and local storage
            sessionStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            sessionStorage.setItem("isUserLoggedIn", 1);
            sessionStorage.setItem('session-id', sid);
        },
        Logout(state) {
            state.isUserLoggedIn = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.user = null;
            state.sid = null;
            // here Clear token from storage -------------------------------------------
            sessionStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            sessionStorage.setItem("isUserLoggedIn", 0);
            sessionStorage.removeItem('session-id');
        }
    }
});
export const { loginSuccess, Logout } = authSlice.actions;
export default authSlice.reducer;