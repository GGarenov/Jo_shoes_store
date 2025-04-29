import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Existing order-related async thunks
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (order, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post("/api/orders", order, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/orders/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const payOrder = createAsyncThunk(
  "orders/payOrder",
  async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// New async thunk to fetch all orders for admin
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        user: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get("/api/orders/admin", config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  orderDetails: null,
  loading: false,
  success: false,
  error: null,
  loadingPay: false,
  successPay: false,
  errorPay: null,
  // New state for admin order list
  loadingAllOrders: false,
  errorAllOrders: null,
};

// Create the slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    resetPayOrder: (state) => {
      state.loadingPay = false;
      state.successPay = false;
      state.errorPay = null;
    },
    resetAllOrdersError: (state) => {
      state.errorAllOrders = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createOrder cases
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderDetails = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create order";
      })

      // getOrderDetails cases
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to get order details";
      })

      // payOrder cases
      .addCase(payOrder.pending, (state) => {
        state.loadingPay = true;
        state.errorPay = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loadingPay = false;
        state.successPay = true;
        state.orderDetails = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loadingPay = false;
        state.errorPay = action.payload?.message || "Payment failed";
      })

      // fetchAllOrders cases
      .addCase(fetchAllOrders.pending, (state) => {
        state.loadingAllOrders = true;
        state.errorAllOrders = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loadingAllOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loadingAllOrders = false;
        state.errorAllOrders =
          action.payload?.message || "Failed to fetch orders";
      });
  },
});

// Export the action creators
export const { resetSuccess, resetPayOrder, resetAllOrdersError } =
  orderSlice.actions;

export default orderSlice.reducer;
