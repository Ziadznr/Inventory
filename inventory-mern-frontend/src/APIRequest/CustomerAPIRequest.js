import store from "../redux/store/store";
import { HideLoader, ShowLoader } from "../redux/state-slice/settings-slice";
import axios from "axios";
import { ErrorToast, SuccessToast } from "../helper/FormHelper";
import { getToken } from "../helper/SessionHelper";
import {
  OnChangeCustomerInput,
  ResetFormValue,
  SetCustomerList,
  SetCustomerListTotal,
  RefreshCustomerList
} from "../redux/state-slice/customer-slice";
import { BaseURL } from "../helper/config";

const AxiosHeader = { headers: { token: getToken() } };

// ------------------ Customer List ------------------
export async function CustomerListRequest(pageNo, perPage, searchKeyword, category = "All") {
  try {
    store.dispatch(ShowLoader());

    const searchKey = searchKeyword || "0";
    const URL = `${BaseURL}/CustomersList/${pageNo}/${perPage}/${searchKey}/${category}`;
    console.log("Requesting URL:", URL, "Headers:", AxiosHeader);

    const result = await axios.get(URL, AxiosHeader);
    store.dispatch(HideLoader());

    console.log("Full API result:", result.data);
    console.log("data[0]:", result.data?.data?.[0]);
    console.log("data[0].Rows:", result.data?.data?.[0]?.Rows);

    if (result.status === 200 && result.data?.success === "success") {
      const rows = result.data?.data?.[0]?.Rows || [];
      const total = result.data?.data?.[0]?.Total?.[0]?.count || rows.length;

      console.log("Final rows:", rows);
      console.log("Total count:", total);

      store.dispatch(SetCustomerList(rows));
      store.dispatch(SetCustomerListTotal(total));
    } else {
      store.dispatch(SetCustomerList([]));
      store.dispatch(SetCustomerListTotal(0));
      ErrorToast("Something Went Wrong: Invalid Response");
    }
  } catch (e) {
    store.dispatch(HideLoader());
    console.error("CustomerListRequest error:", e);
    store.dispatch(SetCustomerList([]));
    store.dispatch(SetCustomerListTotal(0));
    ErrorToast("Something Went Wrong: Network or Server Error");
  }
}

// ------------------ Create or Update Customer ------------------
export async function CreateCustomerRequest(PostBody, ObjectID) {
  try {
    store.dispatch(ShowLoader());
    let URL = `${BaseURL}/CreateCustomers`;
    if (ObjectID) URL = `${BaseURL}/UpdateCustomers/${ObjectID}`;

    const payload = {
      CustomerName: PostBody.CustomerName,
      Phone: PostBody.Phone,
      UserEmail: PostBody.UserEmail, // ✅ updated
      Address: PostBody.Address,
      Category: PostBody.Category,
      Faculty: PostBody.Faculty || null,
      Department: PostBody.Department || null,
      Section: PostBody.Section || null
    };

    const result = await axios.post(URL, payload, AxiosHeader);
    store.dispatch(HideLoader());
    console.log("CreateCustomerRequest API response:", result.data);

    if (result.status === 200 && result.data?.success === "success") {
      SuccessToast("Request Successful");
      store.dispatch(ResetFormValue());
      store.dispatch(RefreshCustomerList());
      return true;
    } else if (result.status === 200 && result.data?.success === "fail") {
      if (result.data?.data?.keyPattern?.Phone === 1) {
        ErrorToast("Mobile Number Already Exist");
      } else {
        ErrorToast(result.data?.message || "Request Failed");
      }
      return false;
    } else {
      ErrorToast("Request Fail! Try Again");
      return false;
    }
  } catch (e) {
    store.dispatch(HideLoader());
    console.log("CreateCustomerRequest error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  }
}

// ------------------ Fill Customer Form ------------------
export async function FillCustomerFormRequest(ObjectID) {
  try {
    store.dispatch(ShowLoader());
    const URL = `${BaseURL}/CustomerDetailsByID/${ObjectID}`;
    const result = await axios.get(URL, AxiosHeader);
    store.dispatch(HideLoader());
    console.log("FillCustomerFormRequest API result:", result.data);

    if (result.status === 200 && result.data?.status === "success") {
      const FormValue = result.data?.data?.[0];

      store.dispatch(OnChangeCustomerInput({ Name: "CustomerName", Value: FormValue?.CustomerName || "" }));
      store.dispatch(OnChangeCustomerInput({ Name: "Phone", Value: FormValue?.Phone || "" }));
      store.dispatch(OnChangeCustomerInput({ Name: "UserEmail", Value: FormValue?.UserEmail || "" })); // ✅ updated
      store.dispatch(OnChangeCustomerInput({ Name: "Address", Value: FormValue?.Address || "" }));
      store.dispatch(OnChangeCustomerInput({ Name: "Category", Value: FormValue?.Category || "" }));
      store.dispatch(OnChangeCustomerInput({ Name: "Faculty", Value: FormValue?.Faculty || "" }));
      store.dispatch(OnChangeCustomerInput({ Name: "Department", Value: FormValue?.Department || "" }));
      store.dispatch(OnChangeCustomerInput({ Name: "Section", Value: FormValue?.Section || "" }));

      return true;
    } else {
      ErrorToast("Request Failed! Try Again");
      return false;
    }
  } catch (e) {
    console.log("FillCustomerFormRequest error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  }
}

// ------------------ Delete Customer ------------------
export async function DeleteCustomerRequest(ObjectID) {
  try {
    store.dispatch(ShowLoader());
    const URL = `${BaseURL}/DeleteCustomer/${ObjectID}`;
    const result = await axios.get(URL, AxiosHeader);
    store.dispatch(HideLoader());
    console.log("DeleteCustomerRequest API result:", result.data);

    if (result.status === 200 && result.data?.status === "associate") {
      ErrorToast(result.data?.data || "Cannot delete associated customer");
      return false;
    }

    if (result.status === 200 && result.data?.status === "success") {
      SuccessToast("Request Successful");
      store.dispatch(RefreshCustomerList());
      return true;
    } else {
      ErrorToast("Request Failed! Try Again");
      return false;
    }
  } catch (e) {
    store.dispatch(HideLoader());
    console.log("DeleteCustomerRequest error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  }
}

// ------------------ Dropdowns ------------------
export async function FacultyDropdownRequest() {
  try {
    const URL = `${BaseURL}/FacultyDropdown`;
    const result = await axios.get(URL, AxiosHeader);
    if (result.status === 200 && result.data?.success === "success") return result.data?.data || [];
    return [];
  } catch (e) {
    console.log("FacultyDropdownRequest error:", e);
    return [];
  }
}

export async function DepartmentDropdownRequest(facultyID = "") {
  try {
    const URL = `${BaseURL}/DepartmentDropdown${facultyID ? "/" + facultyID : ""}`;
    const result = await axios.get(URL, AxiosHeader);

    if (result.status === 200 && result.data?.status === "success") {
      return result.data?.data || [];
    }

    return [];
  } catch (e) {
    console.log("DepartmentDropdownRequest error:", e);
    return [];
  }
}


export async function SectionDropdownRequest() {
  try {
    const URL = `${BaseURL}/SectionDropdown`;
    const result = await axios.get(URL, AxiosHeader);
    if (result.status === 200 && result.data?.success === "success") return result.data?.data || [];
    return [];
  } catch (e) {
    console.log("SectionDropdownRequest error:", e);
    return [];
  }
}
