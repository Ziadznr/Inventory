import { createSlice } from '@reduxjs/toolkit';

export const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    List: [],
    ListTotal: 0,
    FormValue: {
      CustomerName: "",
      Phone: "",
      CustomerEmail: "",   // ✅ correct field (not Address / UserEmail)
      Category: "",        // Dean | Teacher | Chairman | Officer
      Faculty: "",         // ObjectId of faculty
      Department: "",      // ObjectId of department
      Section: ""          // ObjectId of section
    },
    LastUpdated: null
  },
  reducers: {
    SetCustomerList: (state, action) => {
      state.List = action.payload;
      state.LastUpdated = new Date().getTime();
    },
    SetCustomerListTotal: (state, action) => {
      state.ListTotal = action.payload;
    },
    OnChangeCustomerInput: (state, action) => {
      const { Name, Value } = action.payload;
      state.FormValue[Name] = Value;
    },
    ResetFormValue: (state) => {
      Object.keys(state.FormValue).forEach((key) => {
        state.FormValue[key] = "";
      });
    },
    SetFormValue: (state, action) => {
      state.FormValue = { ...state.FormValue, ...action.payload };
    },
    AddCustomerToList: (state, action) => {
      state.List.push(action.payload);
      state.ListTotal += 1;
      state.LastUpdated = new Date().getTime();
    },
    UpdateCustomerInList: (state, action) => {
      const index = state.List.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.List[index] = action.payload;
      }
      state.LastUpdated = new Date().getTime();
    },
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
