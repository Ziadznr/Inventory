import { createSlice } from '@reduxjs/toolkit';

export const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    List: [],
    ListTotal: 0,
    FormValue: {
      CustomerName: "",
      Phone: "",
      UserEmail: "",    // ✅ updated from Email → UserEmail
      Address: "",
      Category: "",     // Dean | Teacher | Chairman | Officer
      Faculty: "",      // ObjectId of faculty
      Department: "",   // ObjectId of department
      Section: ""       // ObjectId of section
    },
    LastUpdated: null // track last update time to trigger refresh if needed
  },
  reducers: {
    // Set the full customer list
    SetCustomerList: (state, action) => {
      state.List = action.payload;
      state.LastUpdated = new Date().getTime();
    },

    // Set total number of customers
    SetCustomerListTotal: (state, action) => {
      state.ListTotal = action.payload;
    },

    // Change a single input field in the form
    OnChangeCustomerInput: (state, action) => {
      const { Name, Value } = action.payload;
      state.FormValue[Name] = Value;
    },

    // Reset the form to empty values
    ResetFormValue: (state) => {
      Object.keys(state.FormValue).forEach((key) => {
        state.FormValue[key] = "";
      });
    },

    // Set the full form value (useful for editing)
    SetFormValue: (state, action) => {
      state.FormValue = { ...state.FormValue, ...action.payload };
    },

    // Add a newly created customer to the list
    AddCustomerToList: (state, action) => {
      state.List.push(action.payload);
      state.ListTotal += 1;
      state.LastUpdated = new Date().getTime();
    },

    // Update an existing customer in the list by ID
    UpdateCustomerInList: (state, action) => {
      const index = state.List.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.List[index] = action.payload;
      }
      state.LastUpdated = new Date().getTime();
    },

    // Trigger a full refresh manually (for navigation or reload)
    RefreshCustomerList: (state) => {
      state.LastUpdated = new Date().getTime();
    }
  }
});

export const {
  SetCustomerList,
  SetCustomerListTotal,
  OnChangeCustomerInput,
  ResetFormValue,
  SetFormValue,
  AddCustomerToList,
  UpdateCustomerInList,
  RefreshCustomerList
} = customerSlice.actions;

export default customerSlice.reducer;
