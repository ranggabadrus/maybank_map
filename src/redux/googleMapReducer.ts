import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type GoogleMapType = {
  lng: number;
  lat: number;
  address: string;
  date: string;
  photo: string;
  link: string;
  name: string;
};

export interface ReducerType {
  result: GoogleMapType[];
}

const initialState: ReducerType = {
  result: [],
};

// First, create the thunk
export const fetchCiki = createAsyncThunk<GoogleMapType[]>(
  "fetchCiki",
  async (payload: any) => {
    const data: GoogleMapType[] = payload;
    return data;
  }
);

export const googleMapSlice = createSlice({
  name: "GoogleMap",
  initialState,
  reducers: {
    storeResult(state, action) {
      state.result = [action.payload, ...state.result];
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchCiki.fulfilled, (state, action) => {
      // Add user to the state array
      state.result = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { storeResult } = googleMapSlice.actions;

export default googleMapSlice.reducer;
