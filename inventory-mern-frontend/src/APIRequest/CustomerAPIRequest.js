import store from "../redux/store/store";
import { HideLoader, ShowLoader } from "../redux/state-slice/settings-slice";
import axios from "axios";
import { ErrorToast, SuccessToast } from "../helper/FormHelper";
import { getToken, removeSessions,setOTP,setEmail } from "../helper/SessionHelper";
import {
  OnChangeCustomerInput,
  ResetFormValue,
  SetCustomerList,
  SetCustomerListTotal,
  SetCurrentCustomer,
  RefreshCustomerList,
} from "../redux/state-slice/customer-slice";
import { BaseURL } from "../helper/config";

// ------------------ Utility ------------------
export const getAxiosHeaderOptional = () => {
  const token = getToken();
  return token ? { headers: { token } } : {};
};

export const getAxiosHeader = () => {
  const token = getToken();
  if (!token) removeSessions();
  return { headers: { token } };
};

// ------------------ CUSTOMER SELF-REGISTRATION ------------------
export async function CustomerRegisterRequest(FormData) {
  try {
    store.dispatch(ShowLoader());
    const res = await axios.post(`${BaseURL}/register`, FormData);
    store.dispatch(HideLoader());

    if (res.status === 200 && res.data?.status === "success") {
      SuccessToast("Registration Successful");
      store.dispatch(ResetFormValue());
      return true;
    }
    ErrorToast(res.data?.data || "Registration Failed");
    return false;
  } catch (e) {
    store.dispatch(HideLoader());
    console.error("CustomerRegisterRequest error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  }
}

// ------------------ CUSTOMER LOGIN ------------------
export async function CustomerLoginRequest(email, password) {
  try {
    store.dispatch(ShowLoader());

    // ✅ Correct endpoint: /login
    const res = await axios.post(`${BaseURL}/UserLogin`, { CustomerEmail: email, Password: password });

    store.dispatch(HideLoader());

    if (res.status === 200) {
      const data = res.data;

      if (data?.status === "success") {
        const customerData = data.data;

        // Store token & customer data
        localStorage.setItem("token", data.token);
        localStorage.setItem("customerDetails", JSON.stringify(customerData));

        store.dispatch(SetCurrentCustomer(customerData));
        SuccessToast("Login Successful");
        return true;
      }

      if (data?.status === "unauthorized") {
        ErrorToast(data.data || "Invalid Email or Password");
        return false;
      }
    }

    ErrorToast("Something went wrong during login");
    return false;

  } catch (e) {
    store.dispatch(HideLoader());
    console.error("CustomerLoginRequest error:", e);
    ErrorToast("Something went wrong");
    return false;
  }
}




// ------------------ CUSTOMER PROFILE (SELF) ------------------
export async function CustomerProfileRequest() {
  try {
    store.dispatch(ShowLoader());
    const res = await axios.get(`${BaseURL}/profile`, getAxiosHeader());
    store.dispatch(HideLoader());

    if (res.status === 200 && res.data?.status === "success") {
      const profile = res.data.data;
      store.dispatch(SetCurrentCustomer(profile));
      localStorage.setItem("customerProfile", JSON.stringify(profile));
      return profile;
    }
    ErrorToast("Failed to fetch profile");
    return null;
  } catch (err) {
    store.dispatch(HideLoader());
    console.error("CustomerProfileRequest error:", err);
    ErrorToast("Network or Server Error");
    return null;
  }
}

// CustomerAPIRequest.js
export async function CustomerUpdateRequest(customerData) {
  try {
    store.dispatch(ShowLoader());

    // Send JSON with Base64 image
    const res = await axios.post(`${BaseURL}/update`, customerData, getAxiosHeader());

    store.dispatch(HideLoader());

    if (res.status === 200 && res.data?.status === "success") {
      SuccessToast("Profile Updated Successfully");

      // ✅ Use backend response (plain JS object)
      const updatedCustomer = res.data.data;
      if (updatedCustomer) {
        store.dispatch(SetCurrentCustomer(updatedCustomer));
        localStorage.setItem("customerProfile", JSON.stringify(updatedCustomer));
      }

      return true;
    }

    ErrorToast(res.data?.data || "Profile Update Failed");
    return false;
  } catch (e) {
    store.dispatch(HideLoader());
    console.error("CustomerUpdateRequest error:", e);
    ErrorToast("Something Went Wrong");
    return false;
  }
}


// ------------------ Verify Email ------------------
export async function CustomerRecoverVerifyEmailRequest(email) {
  try {
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/RecoverVerifyEmail/" + email;
    let res = await axios.get(URL);
    store.dispatch(HideLoader());
    if (res.status === 200) {
      if (res.data["status"] === "fail") {
        ErrorToast("No user found");
        return false;
      } else {
        setEmail(email);
        SuccessToast("A 6 Digit verification code has been sent to your email address.");
        return true;
      }
    } else {
      ErrorToast("Something Went Wrong");
      return false;
    }
  } catch (e) {
    ErrorToast("Something Went Wrong");
    store.dispatch(HideLoader());
    return false;
  }
}

// ------------------ Verify OTP ------------------
export async function CustomerRecoverVerifyOTPRequest(email, OTP) {
  try {
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/RecoverVerifyOTP/" + email + "/" + OTP;
    let res = await axios.get(URL);
    store.dispatch(HideLoader());
    if (res.status === 200) {
      if (res.data["status"] === "fail") {
        ErrorToast("Code Verification Fail");
        return false;
      } else {
        setOTP(OTP);
        SuccessToast("Code Verification Success");
        return true;
      }
    } else {
      ErrorToast("Something Went Wrong");
      return false;
    }
  } catch (e) {
    ErrorToast("Something Went Wrong");
    store.dispatch(HideLoader());

    return false;
  }
}



export async function CustomerRecoverResetPassRequest(email, OTP, password) {
  try {
    store.dispatch(ShowLoader());
    let URL = BaseURL + "/RecoverResetPass";
    let PostBody = { email, OTP, password };
    let res = await axios.post(URL, PostBody);
    store.dispatch(HideLoader());
    if (res.status === 200) {
      if (res.data["status"] === "fail") {
        ErrorToast(res.data["data"]);
        return false;
      } else {
        setOTP(OTP);
        SuccessToast("NEW PASSWORD CREATED");
        return true;
      }
    } else {
      ErrorToast("Something Went Wrong");
      return false;
    }
  } catch (e) {
    ErrorToast("Something Went Wrong");
    store.dispatch(HideLoader());
    return false;
  }
}

// ------------------ ADMIN CUSTOMER MANAGEMENT ------------------
export async function CustomerListRequest(pageNo, perPage, searchKeyword, category = "All") {
  store.dispatch(ShowLoader());
  try {
    const searchKey = searchKeyword || "0";
    const URL = `${BaseURL}/CustomersList/${pageNo}/${perPage}/${searchKey}/${category}`;
    console.log("📌 CustomerListRequest URL:", URL);

    const result = await axios.get(URL, getAxiosHeader());
    console.log("📌 CustomerListRequest result:", result.data);

    if (result.status === 200 && result.data?.status === "success") {
      const rows = result.data?.data?.[0]?.Rows || [];
      const totalCount = result.data?.data?.[0]?.Total?.[0]?.count ?? rows.length ?? 0;

      const mappedRows = rows.map((item) => ({
        ...item,
        FacultyName: item.FacultyName || "-",
        DepartmentName: item.DepartmentName || "-",
        SectionName: item.SectionName || "-",
      }));

      store.dispatch(SetCustomerList(mappedRows));
      store.dispatch(SetCustomerListTotal(totalCount));

      console.log("📌 CustomerListRequest mappedRows:", mappedRows, "Total:", totalCount);
      return { rows: mappedRows, totalCount };
    }

    store.dispatch(SetCustomerList([]));
    store.dispatch(SetCustomerListTotal(0));
    ErrorToast("Invalid Response");
    return { rows: [], totalCount: 0 };
  } catch (e) {
    console.error("❌ CustomerListRequest Error:", e);

    store.dispatch(SetCustomerList([]));
    store.dispatch(SetCustomerListTotal(0));

    if (e.response?.status === 401) {
      removeSessions();
    } else {
      ErrorToast("Network or Server Error");
    }

    return { rows: [], totalCount: 0 };
  } finally {
    store.dispatch(HideLoader());
  }
}
// ------------------ Fill Customer Form ------------------
export async function FillCustomerFormRequest(ObjectID) {
  try {
    store.dispatch(ShowLoader());
    const result = await axios.get(`${BaseURL}/CustomerDetailsByID/${ObjectID}`, getAxiosHeader());
    store.dispatch(HideLoader());

    if (result.status === 200 && result.data?.status === "success") {
      const FormValue = result.data?.data?.[0];
      if (!FormValue) return false;

      Object.entries(FormValue).forEach(([key, value]) => {
        store.dispatch(OnChangeCustomerInput({ Name: key, Value: value || "" }));
      });

      return true;
    }
    ErrorToast("Request Failed! Try Again");
    return false;
  } catch (e) {
    store.dispatch(HideLoader());
    console.error("FillCustomerFormRequest error:", e);
    if (e.response?.status === 401) removeSessions();
    else ErrorToast("Something Went Wrong");
    return false;
  }
}

// ------------------ Delete Customer ------------------
export async function DeleteCustomerRequest(ObjectID) {
  try {
    store.dispatch(ShowLoader());
    const result = await axios.get(`${BaseURL}/DeleteCustomer/${ObjectID}`, getAxiosHeader());
    store.dispatch(HideLoader());

    if (result.status === 200 && result.data?.status === "associate") {
      ErrorToast(result.data?.data || "Cannot delete associated customer");
      return false;
    }
    if (result.status === 200 && result.data?.status === "success") {
      SuccessToast("Request Successful");
      store.dispatch(RefreshCustomerList());
      return true;
    }
    ErrorToast("Request Failed! Try Again");
    return false;
  } catch (e) {
    store.dispatch(HideLoader());
    console.error("DeleteCustomerRequest error:", e);
    if (e.response?.status === 401) removeSessions();
    else ErrorToast("Something Went Wrong");
    return false;
  }
}

// ------------------ Dropdowns ------------------
export async function FacultyDropdownRequest() {
  try {
    const result = await axios.get(`${BaseURL}/FacultyDropdown`, getAxiosHeaderOptional());
    if (result.status === 200 && result.data?.status === "success") return result.data?.data || [];
    return [];
  } catch (e) {
    console.error("FacultyDropdownRequest error:", e);
    return [];
  }
}

export async function DepartmentDropdownRequest(facultyID = "") {
  try {
    const result = await axios.get(`${BaseURL}/DepartmentDropdown${facultyID ? "/" + facultyID : ""}`, getAxiosHeaderOptional());
    if (result.status === 200 && result.data?.status === "success") return result.data?.data || [];
    return [];
  } catch (e) {
    console.error("DepartmentDropdownRequest error:", e);
    return [];
  }
}

export async function SectionDropdownRequest() {
  try {
    const result = await axios.get(`${BaseURL}/SectionDropdown`, getAxiosHeaderOptional());
    if (result.status === 200 && result.data?.status === "success") return result.data?.data || [];
    return [];
  } catch (e) {
    console.error("SectionDropdownRequest error:", e);
    return [];
  }
}

// ------------------ Send Email ------------------
export async function SendEmailToCustomerRequest(customerId, subject, message) {
  try {
    store.dispatch(ShowLoader());
    const result = await axios.post(`${BaseURL}/send-email`, { customerId, subject, message }, getAxiosHeader());
    store.dispatch(HideLoader());

    if (result.status === 200 && result.data?.status === "success") {
      SuccessToast("Email sent successfully");
      return true;
    }
    ErrorToast(result.data?.message || "Failed to send email");
    return false;
  } catch (e) {
    store.dispatch(HideLoader());
    console.error("SendEmailToCustomerRequest error:", e);
    if (e.response?.status === 401) removeSessions();
    else ErrorToast("Something Went Wrong");
    return false;
  }
}
