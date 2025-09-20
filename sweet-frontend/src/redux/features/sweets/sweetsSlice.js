// src/redux/features/sweets/sweetsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../../../services/api";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

// ================== Async Thunks ==================

// fetch all sweets
export const fetchSweets = createAsyncThunk(
  "sweets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/sweets");
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Fetch failed";
      return rejectWithValue(message);
    }
  }
);

// search sweets (query params)
export const searchSweets = createAsyncThunk(
  "sweets/search",
  async (params = {name, price, category}, { rejectWithValue }) => {
    try {
      const res = await api.get("/sweets/search", { params });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Search failed";
      return rejectWithValue(message);
    }
  }
);

// add sweet (admin)
export const addSweet = createAsyncThunk(
  "sweets/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/sweets", payload);
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Add failed";
      return rejectWithValue(message);
    }
  }
);

// update sweet (admin)
export const updateSweet = createAsyncThunk(
  "sweets/update",
  async ({ id, name, category, price, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/sweets/${id}`,{
        name, 
        category, 
        price, 
        quantity
      });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Update failed";
      return rejectWithValue(message);
    }
  }
);

// delete sweet (admin)
export const deleteSweet = createAsyncThunk(
  "sweets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/sweets/${id}`);
      return id;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Delete failed";
      return rejectWithValue(message);
    }
  }
);

// purchase sweet (user)
export const purchaseSweet = createAsyncThunk(
  "sweets/purchase",
  async ({ id, quantity = 1 }, { rejectWithValue }) => {
    try {
      const {data} = await api.post(`/sweets/${id}/purchase`, { quantity });
      return { ...data, id: data._id }; 
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Purchase failed";
      return rejectWithValue(message);
    }
  }
);

// restock sweet (admin)
export const restockSweet = createAsyncThunk(
  "sweets/restock",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/sweets/${id}/restock`, { quantity });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Restock failed";
      return rejectWithValue(message);
    }
  }
);

// ================== Slice ==================
const sweetsSlice = createSlice({
  name: "sweets",
  initialState,
  reducers: {
    clearSweetsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchSweets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSweets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchSweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      })

      // search
      .addCase(searchSweets.fulfilled, (state, action) => {
        state.list = action.payload || [];
      })

      // add
      .addCase(addSweet.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // update
      .addCase(updateSweet.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((s) => s._id === updated._id);
        if (index !== -1) {
          state.list[index] = updated;
        }
        state.status = "succeeded";
      })
      .addCase(updateSweet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Update failed";
      })

      // delete
      .addCase(deleteSweet.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (s) => s._id !== action.payload && s.id !== action.payload
        );
      })

      // purchase
      .addCase(purchaseSweet.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((s) =>
          s._id === updated._id || s.id === updated.id ? updated : s
        );
      })

      // restock
      .addCase(restockSweet.fulfilled, (state, action) => {
      const updatedSweet = action.payload.sweet;
      const index = state.list.findIndex(s => s._id === updatedSweet._id);
      if (index !== -1) {
        state.list[index] = updatedSweet; // Replace the old sweet with the updated one
      }
    });
  },
});

export const { clearSweetsError } = sweetsSlice.actions;
export default sweetsSlice.reducer;
