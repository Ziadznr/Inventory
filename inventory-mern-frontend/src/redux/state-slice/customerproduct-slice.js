import { createSlice } from "@reduxjs/toolkit";

const CustomerProductEntrySlice = createSlice({
  name: "customerProductEntry",
  initialState: {
    category: "",
    facultyId: "",
    departmentId: "",
    sectionId: "",
    customers: [],
    list: [], // Cart items
    loading: false,
    error: null,
    EntryFormValue: {
      CustomerID: "",
      TotalAmount: 0,
    },
  },
  reducers: {
    // ---------------- Set Category ----------------
    SetCategory: (state, action) => {
      state.category = action.payload;
      state.facultyId = "";
      state.departmentId = "";
      state.sectionId = "";
      state.EntryFormValue = { CustomerID: "", TotalAmount: 0 };
      state.list = [];
      state.customers = [];
    },

    // ---------------- Set Faculty ----------------
    SetFaculty: (state, action) => {
      state.facultyId = action.payload;
      state.departmentId = "";
      state.sectionId = "";
      state.EntryFormValue = { CustomerID: "", TotalAmount: 0 };
      state.list = [];
      state.customers = [];
    },

    // ---------------- Set Department ----------------
    SetDepartment: (state, action) => {
      state.departmentId = action.payload;
      state.sectionId = "";
      state.EntryFormValue = { CustomerID: "", TotalAmount: 0 };
      state.list = [];
      state.customers = [];
    },

    // ---------------- Set Section ----------------
    SetSection: (state, action) => {
      state.sectionId = action.payload;
      state.EntryFormValue = { CustomerID: "", TotalAmount: 0 };
      state.list = [];
      state.customers = [];
    },

    // ---------------- Set Customer ----------------
    SetCustomer: (state, action) => {
      state.EntryFormValue.CustomerID = action.payload;
    },

    // ---------------- Set Customers List ----------------
    SetCustomersList: (state, action) => {
      state.customers = action.payload;
    },

    // ---------------- Set Cart List ----------------
    SetList: (state, action) => {
      state.list = action.payload;
      state.EntryFormValue.TotalAmount = state.list.reduce((acc, item) => acc + item.Total, 0);
    },

    // ---------------- Loading & Error ----------------
    SetLoading: (state, action) => {
      state.loading = action.payload;
    },
    SetError: (state, action) => {
      state.error = action.payload;
    },

    // ---------------- Reset ----------------
    ResetFilters: (state) => {
      state.category = "";
      state.facultyId = "";
      state.departmentId = "";
      state.sectionId = "";
      state.customers = [];
      state.list = [];
      state.EntryFormValue = { CustomerID: "", TotalAmount: 0 };
    },

    // ---------------- On Input Change ----------------
    OnChangeCustomerProductEntryInput: (state, action) => {
      const { Name, Value } = action.payload;
      state.EntryFormValue[Name] = Value;
    },

    // ---------------- Add Item to Cart ----------------
    SetCustomerProductEntryItemList: (state, action) => {
      state.list.push(action.payload);
      state.EntryFormValue.TotalAmount = state.list.reduce((acc, item) => acc + item.Total, 0);
    },

    // ---------------- Remove Item from Cart ----------------
    RemoveCustomerProductEntryItem: (state, action) => {
      const index = action.payload;
      state.list.splice(index, 1);
      state.EntryFormValue.TotalAmount = state.list.reduce((acc, item) => acc + item.Total, 0);
    },
  },
});

export const {
  SetCategory,
  SetFaculty,
  SetDepartment,
  SetSection,
  SetCustomer,
  SetCustomersList,
  SetList,
  SetLoading,
  SetError,
  ResetFilters,
  OnChangeCustomerProductEntryInput,
  SetCustomerProductEntryItemList,
  RemoveCustomerProductEntryItem,
} = CustomerProductEntrySlice.actions;

export default CustomerProductEntrySlice.reducer;
