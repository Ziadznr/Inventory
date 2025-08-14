// src/redux/state-slice/department-slice.js
import { createSlice } from "@reduxjs/toolkit";

export const departmentSlice = createSlice({
    name: 'department',
    initialState: {
        List: [],
        ListTotal: 0,
        FormValue: {
  Name: ""
}
    },
    reducers: {
        SetDepartmentList: (state, action) => {
            state.List = action.payload
        },
        SetDepartmentListTotal: (state, action) => {
            state.ListTotal = action.payload
        },
        OnChangeDepartmentInput: (state, action) => {
            state.FormValue[`${action.payload.Name}`] = action.payload.Value;
        },
        ResetDepartmentFormValue: (state) => {
            Object.keys(state.FormValue).forEach((i) => state.FormValue[i] = "");
        }
    }
})

export const {
    SetDepartmentList,
    SetDepartmentListTotal,
    OnChangeDepartmentInput,
    ResetDepartmentFormValue
} = departmentSlice.actions;

export default departmentSlice.reducer;
