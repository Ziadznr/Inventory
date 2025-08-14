import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateDepartmentRequest } from "../../APIRequest/DepartmentAPIRequest";
import { ErrorToast, IsEmpty } from "../../helper/FormHelper";
import store from "../../redux/store/store";
import { OnChangeDepartmentInput } from "../../redux/state-slice/department-slice";

const DepartmentForm = () => {
  let FormValue = useSelector((state) => state.department.FormValue);
  let navigate = useNavigate();
  

  const SaveChange = async () => {
   if (IsEmpty(FormValue.Name)) {
  ErrorToast("Department Name Required!");
  return;
}

   const success = await CreateDepartmentRequest({ Name: FormValue.Name }, 0);


    console.log("Create success:", success);

    if (success) {
      navigate("/department-list");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5>Create Department</h5>
              <hr className="bg-light" />
              <div className="col-4 p-2">
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={FormValue.Name}
                 onChange={(e) =>
  store.dispatch(OnChangeDepartmentInput({ Name: "Name", Value: e.target.value }))
}

                />
              </div>
              <div className="col-4 p-2 mt-3">
                <button onClick={SaveChange} className="btn btn-sm btn-success">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;
