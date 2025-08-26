// src/components/Faculty/FacultyCreateUpdate.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "../../redux/store/store";
import { OnChangeFacultyInput } from "../../redux/state-slice/faculty-slice";
import {
  CreateFacultyRequest,
  FillFacultyFormRequest,
} from "../../APIRequest/FacultyAPIRequest";
import { ErrorToast, IsEmpty, SuccessToast } from "../../helper/FormHelper";

const FacultyCreateUpdate = () => {
  const FormValue = useSelector((state) => state.faculty.FormValue);
  const navigate = useNavigate();
  const [ObjectID, SetObjectID] = useState(0);
  const [loading, setLoading] = useState(false);

  // Check if editing (get id from query params)
  useEffect(() => {
    const fetchFaculty = async () => {
      const id = new URLSearchParams(window.location.search).get("id");
      if (id) {
        SetObjectID(id);
        await FillFacultyFormRequest(id);
      }
    };
    fetchFaculty();
  }, []);

  // Input handler
  const handleInputChange = (name, value) => {
    store.dispatch(OnChangeFacultyInput({ Name: name, Value: value }));
  };

  // Save (create or update)
  const SaveChange = async () => {
    if (IsEmpty(FormValue.Name)) {
      ErrorToast("Faculty Name Required!");
      return;
    }

    setLoading(true);
    const success = await CreateFacultyRequest({ Name: FormValue.Name }, ObjectID);
    setLoading(false);

    console.log("CreateFacultyRequest success:", success); // debug

    if (success) {
      SuccessToast("Faculty saved successfully!");
      navigate("/FacultyOperationPage");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5>{ObjectID ? "Update Faculty" : "Create Faculty"}</h5>
              <hr className="bg-light" />

              <div className="row">
                <div className="col-4 p-2">
                  <label className="form-label">Faculty Name</label>
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

export default FacultyCreateUpdate;
