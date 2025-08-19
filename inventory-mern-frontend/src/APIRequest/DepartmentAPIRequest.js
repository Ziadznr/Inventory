// src/APIRequest/DepartmentAPIRequest.js
import store from "../redux/store/store";
import { HideLoader, ShowLoader } from "../redux/state-slice/settings-slice";
import axios from "axios";
import { ErrorToast, SuccessToast } from "../helper/FormHelper";
import { getToken } from "../helper/SessionHelper";
import {
  SetDepartmentList,
  SetDepartmentListTotal,
  ResetDepartmentFormValue,
  OnChangeDepartmentInput
} from "../redux/state-slice/department-slice";
import { BaseURL } from "../helper/config";

const AxiosHeader = { headers: { token: getToken() } };

// ------------------ Department List ------------------
export async function DepartmentListRequest(pageNo, perPage, searchKeyword) {
  try {
    store.dispatch(ShowLoader());
    const URL = `${BaseURL}/DepartmentList/${pageNo}/${perPage}/${searchKeyword}`;
    const result = await axios.get(URL, AxiosHeader);
    store.dispatch(HideLoader());

    console.log("DepartmentListRequest response:", result.data); // debug

    if (result.status === 200 && result.data?.success === "success") {
      const rows = result.data?.data[0]?.Rows || [];
      const total = result.data?.data[0]?.Total[0]?.count || 0;

      store.dispatch(SetDepartmentList(rows));
      store.dispatch(SetDepartmentListTotal(total));

      if (rows.length === 0) {
        // Optional: show a toast for no data
        // ErrorToast("No Data Found");
      }
    } else {
      store.dispatch(SetDepartmentList([]));
      store.dispatch(SetDepartmentListTotal(0));
      ErrorToast("Something Went Wrong");
    }
  } catch (e) {
    console.log("DepartmentListRequest error:", e);
    store.dispatch(HideLoader());
    store.dispatch(SetDepartmentList([]));
    store.dispatch(SetDepartmentListTotal(0));
    ErrorToast("Something Went Wrong");
  }
}

// ------------------ Create or Update Department ------------------
export async function CreateDepartmentRequest(PostBody, ObjectID) {
  try {
    store.dispatch(ShowLoader());
    let URL = `${BaseURL}/CreateDepartment`;
    if (ObjectID !== 0) {
      URL = `${BaseURL}/UpdateDepartment/${ObjectID}`;
    }

    const result = await axios.post(URL, PostBody, AxiosHeader);
    store.dispatch(HideLoader());

    console.log("CreateDepartmentRequest response:", result.data); // debug

    if (result.status === 200 && result.data?.success === "success") {
      SuccessToast("Request Successful");
      store.dispatch(ResetDepartmentFormValue());
      return true;
    } 
    else if (result.status === 200 && result.data?.success === "fail") {
      if (result.data?.data?.keyPattern?.Name === 1) {
        ErrorToast("Department Name Already Exist");
        return false;
      } else {
        ErrorToast(result.data?.message || "Request Failed");
        return false;
      }
    } 
    else {
      ErrorToast("Request Fail! Try Again");
      return false;
    }
  } catch (e) {
    console.log("CreateDepartmentRequest error:", e);
    ErrorToast("Something Went Wrong");
    store.dispatch(HideLoader());
    return false;
  }
}

// ------------------ Fill Department Form ------------------
export async function FillDepartmentFormRequest(ObjectID) {
  store.dispatch(ShowLoader());
  try {
    const URL = `${BaseURL}/DepartmentDetailsByID/${ObjectID}`;
    const result = await axios.get(URL, AxiosHeader);

    if (result.status === 200 && result.data?.success === "success") {
      const FormValue = result.data?.data?.[0];
      store.dispatch(OnChangeDepartmentInput({ Name: "Name", Value: FormValue?.Name || "" }));
      return true;
    } else {
      ErrorToast("Request Failed! Try Again");
      return false;
    }
  } catch (e) {
    console.log("FillDepartmentFormRequest error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  } finally {
    store.dispatch(HideLoader());
  }
}

// ------------------ Delete Department ------------------
export async function DeleteDepartmentRequest(ObjectID) {
  store.dispatch(ShowLoader());
  try {
    const URL = `${BaseURL}/DeleteDepartment/${ObjectID}`;
    const result = await axios.get(URL, AxiosHeader);

    if (result.status === 200 && result.data?.status === "associate") {
      ErrorToast(result.data?.data || "Cannot delete associated department");
      return false;
    }

    if (result.status === 200 && result.data?.status === "success") {
      SuccessToast("Request Successful");
      return true;
    } else {
      ErrorToast("Request Failed! Try Again");
      return false;
    }
  } catch (e) {
    console.log("DeleteDepartmentRequest error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  } finally {
    store.dispatch(HideLoader());
  }
}
