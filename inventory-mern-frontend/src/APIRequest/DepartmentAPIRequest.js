// src/APIRequest/DepartmentAPIRequest.js
import store from "../redux/store/store";
import {HideLoader, ShowLoader} from "../redux/state-slice/settings-slice";
import axios from "axios";
import {ErrorToast, SuccessToast} from "../helper/FormHelper";
import {getToken} from "../helper/SessionHelper";
import {
    SetDepartmentList,
    SetDepartmentListTotal,
    ResetDepartmentFormValue,
    OnChangeDepartmentInput
} from "../redux/state-slice/department-slice";
import {BaseURL} from "../helper/config";

const AxiosHeader = {headers: {"token": getToken()}};

// LIST
export async function DepartmentListRequest(pageNo, perPage, searchKeyword) {
    try {
        store.dispatch(ShowLoader())
        let URL = `${BaseURL}/DepartmentList/${pageNo}/${perPage}/${searchKeyword}`;
        const result = await axios.get(URL, AxiosHeader)
        store.dispatch(HideLoader())
        if (result.status === 200 && result.data['status'] === "success") {
            if (result.data['data'][0]['Rows'].length > 0) {
                store.dispatch(SetDepartmentList(result.data['data'][0]['Rows']))
                store.dispatch(SetDepartmentListTotal(result.data['data'][0]['Total'][0]['count']))
            } else {
                store.dispatch(SetDepartmentList([]))
                store.dispatch(SetDepartmentListTotal(0))
                ErrorToast("No Data Found")
            }
        } else {
            ErrorToast("Something Went Wrong")
        }
    } catch (e) {
        ErrorToast("Something Went Wrong")
        store.dispatch(HideLoader())
    }
}

// CREATE / UPDATE
export async function CreateDepartmentRequest(PostBody, ObjectID) {
    try {
        store.dispatch(ShowLoader());
        let URL = `${BaseURL}/CreateDepartment`;
        if (ObjectID !== 0) {
            URL = `${BaseURL}/UpdateDepartment/${ObjectID}`;
        }
        const result = await axios.post(URL, PostBody, AxiosHeader);
        console.log("CreateDepartmentRequest result:", result);
        console.log("CreateDepartmentRequest result.data:", result.data);

        store.dispatch(HideLoader());

        // Check for success key, not status
        if (result.status === 200 && result.data['success'] === "success") {
            SuccessToast("Request Successful");
            store.dispatch(ResetDepartmentFormValue());
            return true;
        } 
        // Check for fail key and handle duplicate name error
        else if (result.status === 200 && result.data['status'] === "fail") {
            if (result.data['data'] && result.data['data']['keyPattern'] && result.data['data']['keyPattern']['Name'] === 1) {
                ErrorToast("Department Name Already Exist");
                return false;
            }
        } else {
            ErrorToast("Request Fail ! Try Again");
            return false;
        }
    } catch (e) {
        ErrorToast("Something Went Wrong");
        store.dispatch(HideLoader());
        return false;
    }
}

// FILL FORM (for update)
// export async function FillDepartmentFormRequest(ObjectID) {
//     try {
//         store.dispatch(ShowLoader())
//         let URL = `${BaseURL}/DepartmentDetailsByID/${ObjectID}`;
//         const result = await axios.get(URL, AxiosHeader)
//         store.dispatch(HideLoader())
//         if (result.status === 200 && result.data['status'] === "success") {
//             let FormValue = result.data['data'][0];
//             store.dispatch(OnChangeDepartmentInput({Name: "Name", Value: FormValue['Name']}));
//             return true;
//         } else {
//             ErrorToast("Request Fail ! Try Again")
//             return false;
//         }
//     } catch (e) {
//         ErrorToast("Something Went Wrong")
//         store.dispatch(HideLoader())
//         return false
//     }
// }

// DELETE (prevent delete if has customers)
export async function DeleteDepartmentRequest(ObjectID) {
    try {
        store.dispatch(ShowLoader())
        let URL = `${BaseURL}/DeleteDepartment/${ObjectID}`;
        const result = await axios.get(URL, AxiosHeader)
        store.dispatch(HideLoader())

        if (result.status === 200 && result.data['status'] === "associate") {
            ErrorToast(result.data['data']) // e.g. "Cannot delete. Customers exist."
            return false;
        }
        if (result.status === 200 && result.data['status'] === "success") {
            SuccessToast("Request Successful");
            return true
        } else {
            ErrorToast("Request Fail ! Try Again")
            return false;
        }
    } catch (e) {
        ErrorToast("Something Went Wrong")
        store.dispatch(HideLoader())
        return false
    }
}
