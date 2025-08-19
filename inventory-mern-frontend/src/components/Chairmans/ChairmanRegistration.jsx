import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorToast, IsEmail, IsEmpty, IsMobile } from "../../helper/FormHelper";
import {
  ChairmanRegistrationRequest,
  PublicDepartmentsDropdown
} from "../../APIRequest/ChairmansAPIRequest";

const ChairmanRegistration = () => {
  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const mobileRef = useRef();
  const passwordRef = useRef();
  const departmentRef = useRef();

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  // Fetch departments for dropdown from backend
useEffect(() => {
  const fetchDepartments = async () => {
    try {
      // Optional: set loading if you want to show a spinner
      // setLoading(true);

      // Use public endpoint for registration
      const response = await PublicDepartmentsDropdown(); // or your updated API function
      if (Array.isArray(response) && response.length > 0) {
        setDepartments(response);
        console.log("Departments loaded:", response);
      } else {
        setDepartments([]);
        console.warn("No departments found");
      }
    } catch (error) {
      console.error("Failed to load departments:", error);
      setDepartments([]);
    } finally {
      // setLoading(false);
    }
  };

  fetchDepartments();
}, []);




  const onRegistration = async () => {
    const email = emailRef.current.value;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const mobile = mobileRef.current.value;
    const password = passwordRef.current.value;
    const departmentId = departmentRef.current.value;

    // Sample base64 photo string (replace with actual upload later)
    const photo = "data:image/jpeg;base64,/9j/4AAQ...";

    // Validation
    if (!IsEmail(email)) {
      ErrorToast("Valid Email Address Required!");
      return;
    }
    if (IsEmpty(firstName)) {
      ErrorToast("First Name Required!");
      return;
    }
    if (IsEmpty(lastName)) {
      ErrorToast("Last Name Required!");
      return;
    }
    if (!IsMobile(mobile)) {
      ErrorToast("Valid Mobile Required!");
      return;
    }
    if (IsEmpty(password)) {
      ErrorToast("Password Required!");
      return;
    }
    if (IsEmpty(departmentId)) {
      ErrorToast("Please Select a Department!");
      return;
    }

    // Call backend registration
    let result = await ChairmanRegistrationRequest(
      email,
      firstName,
      lastName,
      mobile,
      password,
      photo,
      departmentId
    );

    if (result === true) {
      navigate("/ChairmanLoginPage"); // Redirect to login after successful registration
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-3">Chairman Registration</h1>
      <div className="row mt-3">
        <div className="col-md-6 offset-md-3">
          <input ref={emailRef} placeholder="Chairman Email" className="form-control mt-3" type="email" />
          <input ref={firstNameRef} placeholder="First Name" className="form-control mt-3" type="text" />
          <input ref={lastNameRef} placeholder="Last Name" className="form-control mt-3" type="text" />
          <input ref={mobileRef} placeholder="Mobile Number" className="form-control mt-3" type="text" />
          <input ref={passwordRef} placeholder="Password" className="form-control mt-3" type="password" />
          <select ref={departmentRef} className="form-control mt-3">
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
  {dept.Name || dept.name}
</option>

            ))}
          </select>
          <button onClick={onRegistration} className="btn btn-primary mt-3 w-100">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChairmanRegistration;
