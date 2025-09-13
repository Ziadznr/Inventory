import { createSlice } from "@reduxjs/toolkit";

// Initial form values for customer registration or profile
const initialFormValue = {
  Photo: "",
  CustomerName: "",
  Phone: "",
  CustomerEmail: "",   // used for registration/login
  Category: "",        // Dean | Teacher | Chairman | Officer
  Faculty: "",         // ObjectId string
  Department: "",      // ObjectId string
  Section: ""          // ObjectId string
};

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    List: [],               // Full customer list
    Total: 0,               // Total number of customers
    FormValue: { ...initialFormValue }, // Form input state
    LastUpdated: null,      // Timestamp of last update
    CurrentCustomer: null,  // Logged-in customer profile
    loading: false,
    error: null,
  },
  reducers: {
    // ---------------- Customer List ----------------
    SetCustomerList: (state, action) => {
      state.List = action.payload || [];
      state.LastUpdated = Date.now();
      state.error = null;
    },
    SetCustomerListTotal: (state, action) => {
      state.Total = action.payload || 0;
      state.LastUpdated = Date.now();
    },

    // ---------------- Form Handling ----------------
    OnChangeCustomerInput: (state, action) => {
      const { Name, Value } = action.payload;
      if (state.FormValue.hasOwnProperty(Name)) {
        state.FormValue[Name] = Value;
        state.LastUpdated = Date.now();
      }
    },
    SetFormValue: (state, action) => {
      state.FormValue = { ...state.FormValue, ...action.payload };
      state.LastUpdated = Date.now();
    },
    ResetFormValue: (state) => {
      state.FormValue = { ...initialFormValue };
      state.LastUpdated = Date.now();
    },

    // ---------------- Current Customer ----------------
    SetCurrentCustomer: (state, action) => {
      state.CurrentCustomer = {
        ...action.payload,
        role: "Customer",
      };
      // Keep FormValue in sync for profile editing
      state.FormValue = { ...state.FormValue, ...action.payload };
      state.LastUpdated = Date.now();
    },
    ClearCurrentCustomer: (state) => {
      state.CurrentCustomer = null;
      state.FormValue = { ...initialFormValue };
      state.LastUpdated = Date.now();
    },

    // ---------------- List Refresh ----------------
    RefreshCustomerList: (state) => {
      state.List = [];
      state.Total = 0;
      state.LastUpdated = Date.now();
    },

    // ---------------- Loading & Error ----------------
    SetCustomerLoading: (state, action) => {
      state.loading = action.payload;
    },
    SetCustomerError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// ---------------- Exports ----------------
export const {
  SetCustomerList,
  SetCustomerListTotal,
  OnChangeCustomerInput,
  SetFormValue,
  ResetFormValue,
  SetCurrentCustomer,
  ClearCurrentCustomer,
  RefreshCustomerList,
  SetCustomerLoading,
  SetCustomerError,
} = customerSlice.actions;

export default customerSlice.reducer;
