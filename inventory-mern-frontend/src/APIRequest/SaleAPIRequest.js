import store from "../redux/store/store";
import { HideLoader, ShowLoader } from "../redux/state-slice/settings-slice";
import axios from "axios";
import { ErrorToast, SuccessToast } from "../helper/FormHelper";
import { getToken } from "../helper/SessionHelper";
import {
  SetCustomerDropDown,
  SetProductDropDown,
  SetSaleList,
  SetSaleListTotal
} from "../redux/state-slice/sale-slice";
import { BaseURL } from "../helper/config";

const AxiosHeader = { headers: { token: getToken() } };

// ------------------ Sale List ------------------
export async function SaleListRequest(pageNo, perPage, searchKeyword) {
  try {
    store.dispatch(ShowLoader());
    const URL = `${BaseURL}/SalesList/${pageNo}/${perPage}/${searchKeyword || "0"}`;
    const result = await axios.get(URL, AxiosHeader);

    if (result.status === 200 && result.data?.status === "success") {
      const rows = result.data?.data?.[0]?.Rows || [];
      const total = result.data?.data?.[0]?.Total?.[0]?.count || 0;

      store.dispatch(SetSaleList(rows));
      store.dispatch(SetSaleListTotal(total));

      if (rows.length === 0) ErrorToast("No Data Found");
    } else {
      store.dispatch(SetSaleList([]));
      store.dispatch(SetSaleListTotal(0));
      ErrorToast("Something Went Wrong");
    }
  } catch (e) {
    console.error("SaleListRequest Error:", e);
    ErrorToast("Something Went Wrong");
  } finally {
    store.dispatch(HideLoader());
  }
}

// ------------------ Customer Dropdown ------------------
export async function CustomerDropDownRequest(category = null, facultyID = null, departmentID = null, sectionID = null) {
  try {
    store.dispatch(ShowLoader());
    let URL = `${BaseURL}/CustomersDropDown`;

    const params = [];
    if (category) params.push(`category=${category}`);
    if (facultyID) params.push(`facultyID=${facultyID}`);
    if (departmentID) params.push(`departmentID=${departmentID}`);
    if (sectionID) params.push(`sectionID=${sectionID}`);
    if (params.length > 0) URL += `?${params.join("&")}`;

    const result = await axios.get(URL, AxiosHeader);

    if (result.status === 200 && result.data?.status === "success") {
      const data = result.data?.data || [];
      store.dispatch(SetCustomerDropDown(data));
      return data;
    } else {
      store.dispatch(SetCustomerDropDown([]));
      ErrorToast("No Customer Found");
      return [];
    }
  } catch (e) {
    console.error("CustomerDropDownRequest error:", e);
    store.dispatch(SetCustomerDropDown([]));
    ErrorToast("Something Went Wrong");
    return [];
  } finally {
    store.dispatch(HideLoader());
  }
}


// ------------------ Product Dropdown ------------------
export async function ProductDropDownRequest() {
  try {
    store.dispatch(ShowLoader());
    const URL = `${BaseURL}/ProductsDropDown`;
    const result = await axios.get(URL, AxiosHeader);

    if (result.status === 200 && result.data?.status === "success") {
      const data = result.data?.data || [];
      store.dispatch(SetProductDropDown(data));
      if (data.length === 0) ErrorToast("No Product Found");
      return data;
    } else {
      store.dispatch(SetProductDropDown([]));
      ErrorToast("Something Went Wrong");
      return [];
    }
  } catch (e) {
    console.error("ProductDropDownRequest Error:", e);
    store.dispatch(SetProductDropDown([]));
    ErrorToast("Something Went Wrong");
    return [];
  } finally {
    store.dispatch(HideLoader());
  }
}

// ------------------ Create Sale ------------------
export async function CreateSaleRequest(ParentBody, ChildsBody) {
  try {
    store.dispatch(ShowLoader());
    const PostBody = { Parent: ParentBody, Childs: ChildsBody };
    const URL = `${BaseURL}/CreateSales`;
    const result = await axios.post(URL, PostBody, AxiosHeader);

    if (result.status === 200 && result.data?.status === "success") {
      SuccessToast("Sale Created Successfully");
      return true;
    } else {
      ErrorToast("Request Failed! Try Again");
      return false;
    }
  } catch (e) {
    console.error("CreateSaleRequest Error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  } finally {
    store.dispatch(HideLoader());
  }
}

// ------------------ Faculty Dropdown ------------------
export async function FacultyDropdownRequest() {
  try {
    store.dispatch(ShowLoader());
    const URL = `${BaseURL}/FacultyDropdown`;
    const result = await axios.get(URL, AxiosHeader);

    console.log("📌 FacultyDropdown raw Axios response:", result); // ✅ check full Axios response
    console.log("📌 FacultyDropdown response.data:", result.data);   // ✅ check backend JSON

    if (result.status === 200 && result.data?.status === "success") {
      const data = result.data?.data || [];
      console.log("📌 FacultyDropdown final data array:", data); // ✅ what will be returned
      return data;
    } else {
      console.warn("FacultyDropdownRequest: status not success");
      return [];
    }
  } catch (e) {
    console.error("FacultyDropdownRequest error:", e);
    return [];
  } finally {
    store.dispatch(HideLoader());
  }
}


// ------------------ Department Dropdown ------------------
// ------------------ Department Dropdown ------------------
export async function DepartmentDropdownRequest(facultyID = "") {
  try {
    const URL = `${BaseURL}/DepartmentDropdown${facultyID ? "/" + facultyID : ""}`;
    const result = await axios.get(URL, AxiosHeader);

    console.log("📌 DepartmentDropdown response.data:", result.data);

    if (result.status === 200 && result.data?.success === "success") {
      return result.data.data || [];
    } else {
      console.error("DepartmentDropdownRequest: status not success");
      return [];
    }
  } catch (e) {
    console.error("DepartmentDropdownRequest error:", e);
    return [];
  }
}


// ------------------ Section Dropdown ------------------
export async function SectionDropdownRequest() {
  try {
    const URL = `${BaseURL}/SectionDropdown`;
    const result = await axios.get(URL, AxiosHeader);

    console.log("📌 SectionDropdown raw Axios response:", result);
    console.log("📌 SectionDropdown response.data:", result.data);

    // Check correctly if status is "success"
    if (result.status === 200 && result.data?.status === "success") {
      const data = result.data?.data || [];
      console.log("📌 SectionDropdown final data array:", data);
      return data;
    } else {
      console.warn("SectionDropdownRequest: status not success");
      return [];
    }
  } catch (e) {
    console.error("SectionDropdownRequest error:", e);
    return [];
  }
};

