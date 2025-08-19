// src/components/Department/DepartmentCreateUpdate.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "../../redux/store/store";
import { OnChangeDepartmentInput } from "../../redux/state-slice/department-slice";
import {
  CreateDepartmentRequest,
  FillDepartmentFormRequest,
} from "../../APIRequest/DepartmentAPIRequest";
import { ErrorToast, IsEmpty, SuccessToast } from "../../helper/FormHelper";

const DepartmentCreateUpdate = () => {
  const FormValue = useSelector((state) => state.department.FormValue);
  const navigate = useNavigate();
  const [ObjectID, SetObjectID] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check if editing (get id from query params)
  useEffect(() => {
    const fetchDepartment = async () => {
      const id = new URLSearchParams(window.location.search).get("id");
      if (id) {
        SetObjectID(id);
        await FillDepartmentFormRequest(id);
      }
    };
    fetchDepartment();
  }, []);

  // Input handler
  const handleInputChange = (name, value) => {
    store.dispatch(OnChangeDepartmentInput({ Name: name, Value: value }));
  };

  // Save (create or update)
  const SaveChange = async () => {
    if (IsEmpty(FormValue.Name)) {
      ErrorToast("Department Name Required!");
      return;
    }

    setLoading(true);
    const success = await CreateDepartmentRequest({ Name: FormValue.Name }, ObjectID);
    setLoading(false);

    console.log("CreateDepartmentRequest success:", success); // debug

    if (success) {
      SuccessToast("Department saved successfully!");
      navigate("/department-list");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5>{ObjectID ? "Update Department" : "Create Department"}</h5>
              <hr className="bg-light" />

              <div className="row">
                <div className="col-4 p-2">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={FormValue.Name}
                    onChange={(e) => handleInputChange("Name", e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-4 p-2">
                  <button
                    type="button"
                    onClick={SaveChange}
                    className="btn btn-sm my-3 btn-success"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Change"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCreateUpdate;
