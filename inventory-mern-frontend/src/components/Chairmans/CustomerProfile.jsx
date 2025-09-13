import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CustomerProfileRequest,
  CustomerUpdateRequest,
  FacultyDropdownRequest,
  DepartmentDropdownRequest,
  SectionDropdownRequest,
} from "../../APIRequest/CustomerAPIRequest";
import { OnChangeCustomerInput } from "../../redux/state-slice/customer-slice";
import store from "../../redux/store/store";
import {
  ErrorToast,
  SuccessToast,
  IsEmail,
  IsMobile,
  IsEmpty,
  getBase64,
} from "../../helper/FormHelper";

const CustomerProfile = () => {
  const { FormValue } = useSelector((state) => state.customer);

  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [preview, setPreview] = useState(null);

  // Track original name to allow email editing
  const [originalName, setOriginalName] = useState("");

  // 🔹 Load profile + dropdowns
  useEffect(() => {
    const init = async () => {
      const profile = await CustomerProfileRequest(); // sets FormValue via Redux
      setPreview(profile?.Photo || null);
      setOriginalName(profile?.CustomerName || ""); // store original name
      const facs = await FacultyDropdownRequest();
      setFaculties(facs);
      const secs = await SectionDropdownRequest();
      setSections(secs);
    };
    init();
  }, []);

  // 🔹 Load departments when faculty changes
  useEffect(() => {
    if (FormValue?.Faculty) {
      DepartmentDropdownRequest(FormValue.Faculty).then(setDepartments);
    }
  }, [FormValue?.Faculty]);

  // 🔹 Handle Redux form input
  const handleChange = (name, value) => {
    store.dispatch(OnChangeCustomerInput({ Name: name, Value: value }));
  };

  // 🔹 Handle photo upload as Base64
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await getBase64(file);
      handleChange("Photo", base64);
      setPreview(base64);
    }
  };

  // 🔹 Submit update
  const handleUpdate = async () => {
    if (IsEmpty(FormValue.CustomerName)) return ErrorToast("Name Required");
    if (!IsMobile(FormValue.Phone)) return ErrorToast("Valid Mobile Required");
    if (!IsEmail(FormValue.CustomerEmail)) return ErrorToast("Valid Email Required");
    if (IsEmpty(FormValue.Category)) return ErrorToast("Category Required");

    const result = await CustomerUpdateRequest(FormValue);
    if (result) {
      SuccessToast("Profile Updated");
      const updatedProfile = await CustomerProfileRequest();
      setPreview(updatedProfile?.Photo || null);
      setOriginalName(updatedProfile?.CustomerName || "");
    }
  };

  if (!FormValue || !FormValue.CustomerEmail) {
    return <h4 className="text-center mt-5">Loading profile...</h4>;
  }

  // Check if name changed
  const isNameChanged = FormValue.CustomerName !== originalName;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">My Profile</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">

          {/* Photo Upload */}
          <div className="text-center mb-3">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <input
              type="file"
              accept="image/*"
              className="form-control mt-2"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Name */}
          <input
            className="form-control mb-3"
            type="text"
            placeholder="Full Name"
            value={FormValue.CustomerName || ""}
            onChange={(e) => handleChange("CustomerName", e.target.value)}
          />

          {/* Phone */}
          <input
            className="form-control mb-3"
            type="text"
            placeholder="Phone"
            value={FormValue.Phone || ""}
            onChange={(e) => handleChange("Phone", e.target.value)}
          />

          {/* Email */}
          <input
  className="form-control mb-3"
  type="email"
  placeholder="Email"
  value={FormValue.CustomerEmail || ""}
  onChange={(e) => isNameChanged && handleChange("CustomerEmail", e.target.value)}
  readOnly={!isNameChanged}
/>
{!isNameChanged && (
  <small className="text-muted d-block mb-3">
    Change your name to edit email
  </small>
)}


         {/* Category */}
<select
  className="form-control mb-3"
  value={FormValue.Category || ""}
  onChange={(e) => handleChange("Category", e.target.value)}
  disabled // make read-only
>
  <option value="">Select Category</option>
  <option value="Dean">Dean</option>
  <option value="Teacher">Teacher</option>
  <option value="Chairman">Chairman</option>
  <option value="Officer">Officer</option>
</select>

{/* Faculty */}
{(FormValue.Category === "Dean" ||
  FormValue.Category === "Teacher" ||
  FormValue.Category === "Chairman") && (
  <select
    className="form-control mb-3"
    value={FormValue.Faculty || ""}
    onChange={(e) => handleChange("Faculty", e.target.value)}
    disabled // make read-only
  >
    <option value="">Select Faculty</option>
    {faculties.map((f) => (
      <option key={f._id} value={f._id}>{f.Name}</option>
    ))}
  </select>
)}

{/* Department */}
{(FormValue.Category === "Teacher" ||
  FormValue.Category === "Chairman") && (
  <select
    className="form-control mb-3"
    value={FormValue.Department || ""}
    onChange={(e) => handleChange("Department", e.target.value)}
    disabled // make read-only
  >
    <option value="">Select Department</option>
    {departments.map((d) => (
      <option key={d._id} value={d._id}>{d.Name}</option>
    ))}
  </select>
)}

{/* Section */}
{FormValue.Category === "Officer" && (
  <select
    className="form-control mb-3"
    value={FormValue.Section || ""}
    onChange={(e) => handleChange("Section", e.target.value)}
    disabled // make read-only
  >
    <option value="">Select Section</option>
    {sections.map((s) => (
      <option key={s._id} value={s._id}>{s.Name}</option>
    ))}
  </select>
)}

          <button
            onClick={handleUpdate}
            className="btn btn-success w-100 mt-3"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
