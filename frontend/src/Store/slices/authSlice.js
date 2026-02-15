import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: null,
    isLoading: true,
    user: null,
};


export const registerUser = createAsyncThunk(
    "auth/register",
    async (formData, thunkAPI) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/signup`,
                formData,
                { withCredentials: true }
            );

            if (!res.data.success) {
                return thunkAPI.rejectWithValue(res.data.message);
            }

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || "Registration failed"
            );
        }
    }
);



export const loginUser = createAsyncThunk(
    "auth/login",
    async (formData, thunkAPI) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/login`,
                formData,
                { withCredentials: true }
            );

            if (!res.data.success) {
                return thunkAPI.rejectWithValue(res.data.message);
            }

            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || "Login failed"
            );
        }
    }
);



export const logOutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/user/logout`,
                { withCredentials: true }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || "Logout failed"
            );
        }
    }
);



export const checkAuth = createAsyncThunk(
    "auth/checkauth",
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/user/checkauth`,
                {
                    withCredentials: true,
                    headers: {
                        "Cache-Control": "no-store",
                    },
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error?.response?.data?.message || "Unauthorized"
            );
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
            })

            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.checkUser : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(logOutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.isLoading = false;
            });
    },
});

export default authSlice.reducer;
