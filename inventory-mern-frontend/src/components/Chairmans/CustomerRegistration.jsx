import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorToast, IsEmail, IsEmpty, IsMobile } from "../../helper/FormHelper";
import { 
  CustomerRegisterRequest, 
  FacultyDropdownRequest, 
  DepartmentDropdownRequest, 
  SectionDropdownRequest 
} from "../../APIRequest/CustomerAPIRequest";

const CustomerRegistration = () => {
  const emailRef = useRef();
  const nameRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();
  const facultyRef = useRef();
  const departmentRef = useRef();
  const sectionRef = useRef();

  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);

  // Fetch faculties and sections on mount
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const facRes = await FacultyDropdownRequest();
        console.log("Faculties fetched:", facRes);
        setFaculties(facRes);

        const secRes = await SectionDropdownRequest();
        console.log("Sections fetched:", secRes);
        setSections(secRes);
      } catch (error) {
        console.error("Dropdown fetch error:", error);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch departments when faculty changes
  const handleFacultyChange = async (facultyID) => {
    if (!facultyID) {
      setDepartments([]);
      return;
    }
    try {
      const deptRes = await DepartmentDropdownRequest(facultyID);
      console.log("Departments fetched for faculty", facultyID, ":", deptRes);
      setDepartments(deptRes);
    } catch (error) {
      console.error("Department fetch error:", error);
    }
  };

  const onRegister = async () => {
    const CustomerName = nameRef.current.value;
    const Phone = phoneRef.current.value;
    const CustomerEmail = emailRef.current.value;
    const Password = passwordRef.current.value;
    const Faculty = facultyRef.current?.value || null;
    const Department = departmentRef.current?.value || null;
    const Section = sectionRef.current?.value || null;

    // Basic validations
    if (IsEmpty(CustomerName)) return ErrorToast("Customer Name Required!");
    if (!IsMobile(Phone)) return ErrorToast("Valid Mobile Required!");
    if (!IsEmail(CustomerEmail)) return ErrorToast("Valid Email Required!");
    if (IsEmpty(Password)) return ErrorToast("Password Required!");
    if (IsEmpty(category)) return ErrorToast("Category Required!");

    if (category === "Dean" && IsEmpty(Faculty))
      return ErrorToast("Faculty Required for Dean!");
    if ((category === "Teacher" || category === "Chairman") && (IsEmpty(Faculty) || IsEmpty(Department)))
      return ErrorToast("Faculty and Department Required!");
    if (category === "Officer" && IsEmpty(Section))
      return ErrorToast("Section Required for Officer!");

    const PostBody = {
      CustomerName,
      Phone,
      CustomerEmail,
      Password,
      Category: category,
      Faculty,
      Department,
      Section
    };

    console.log("Registration body:", PostBody);

    const result = await CustomerRegisterRequest(PostBody);
    if (result) navigate("/CustomerLogin");
  };

  return (
    <div className="container">
      <h1 className="text-center mt-3">Customer Registration</h1>
      <div className="row mt-3">
        <div className="col-md-6 offset-md-3">
          <input ref={nameRef} placeholder="Full Name" className="form-control mt-3" type="text" />
          <input ref={phoneRef} placeholder="Mobile Number" className="form-control mt-3" type="text" />
          <input ref={emailRef} placeholder="Email" className="form-control mt-3" type="email" />
          <input ref={passwordRef} placeholder="Password" className="form-control mt-3" type="password" />

          <select
            className="form-control mt-3"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              handleFacultyChange(""); // reset departments on category change
            }}
          >
            <option value="">Select Category</option>
            <option value="Dean">Dean</option>
            <option value="Teacher">Teacher</option>
            <option value="Chairman">Chairman</option>
            <option value="Officer">Officer</option>
          </select>

          {(category === "Dean" || category === "Teacher" || category === "Chairman") && (
            <select
              ref={facultyRef}
              className="form-control mt-3"
              onChange={(e) => handleFacultyChange(e.target.value)}
            >
              <option value="">Select Faculty</option>
              {faculties.map((f) => (
                <option key={f._id} value={f._id}>{f.Name}</option>
              ))}
            </select>
          )}

          {(category === "Teacher" || category === "Chairman") && (
            <select ref={departmentRef} className="form-control mt-3">
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>{d.Name}</option>
              ))}
            </select>
          )}

          {category === "Officer" && (
            <select ref={sectionRef} className="form-control mt-3">
              <option value="">Select Section</option>
              {sections.map((s) => (
                <option key={s._id} value={s._id}>{s.Name}</option>
              ))}
            </select>
          )}

          <button onClick={onRegister} className="btn btn-primary mt-3 w-100">Register</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
