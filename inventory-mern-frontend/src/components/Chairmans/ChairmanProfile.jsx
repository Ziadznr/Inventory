import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ErrorToast, getBase64, IsEmail, IsEmpty, IsMobile } from "../../helper/FormHelper";
import { ChairmanGetProfile, ChairmanProfileUpdateRequest } from "../../APIRequest/ChairmansAPIRequest";
import { useNavigate } from "react-router-dom";

const ChairmanProfile = () => {
  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const mobileRef = useRef(null);
  const passwordRef = useRef(null);
  const userImgRef = useRef(null);
  const userImgView = useRef(null);

  useEffect(() => {
    (async () => {
      await ChairmanGetProfile();
    })();
  }, []);

  const ProfileData = useSelector((state) => state.profile.value);
  const navigate = useNavigate();

  const PreviewImage = () => {
    let ImgFile = userImgRef.current.files[0];
    if (ImgFile) {
      getBase64(ImgFile).then((base64Img) => {
        userImgView.current.src = base64Img;
      });
    }
  };

  const UpdateMyProfile = async () => {
    let email = emailRef.current.value;
    let firstName = firstNameRef.current.value;
    let lastName = lastNameRef.current.value;
    let mobile = mobileRef.current.value;
    let password = passwordRef.current.value;
    let photo = userImgView.current.src;

    if (!IsEmail(email)) {
      ErrorToast("Valid Email Address Required !");
    } else if (IsEmpty(firstName)) {
      ErrorToast("First Name Required !");
    } else if (IsEmpty(lastName)) {
      ErrorToast("Last Name Required !");
    } else if (!IsMobile(mobile)) {
      ErrorToast("Valid Mobile Required !");
    } else if (IsEmpty(password)) {
      ErrorToast("Password Required !");
    } else {
      let result = await ChairmanProfileUpdateRequest(email, firstName, lastName, mobile, password, photo);
      if (result === true) {
        navigate("/chairman-dashboard");
      }
    }
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="container-fluid">
                <img
                  ref={userImgView}
                  className="icon-nav-img-lg"
                  src={ProfileData["photo"]}
                  alt="Profile"
                />
                <hr />
                <div className="row">
                  <div className="col-4 p-2">
                    <label>Profile Picture</label>
                    <input
                      onChange={PreviewImage}
                      ref={userImgRef}
                      className="form-control animated fadeInUp"
                      type="file"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <label>Email Address</label>
                    <input
                      defaultValue={ProfileData["email"]}
                      readOnly={true}
                      ref={emailRef}
                      className="form-control animated fadeInUp"
                      type="email"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <label>Department</label>
                    <input
                      defaultValue={ProfileData["departmentName"] || ""}
                      readOnly={true}
                      className="form-control animated fadeInUp"
                      type="text"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <label>First Name</label>
                    <input
                      defaultValue={ProfileData["firstName"]}
                      ref={firstNameRef}
                      className="form-control animated fadeInUp"
                      type="text"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <label>Last Name</label>
                    <input
                      defaultValue={ProfileData["lastName"]}
                      ref={lastNameRef}
                      className="form-control animated fadeInUp"
                      type="text"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <label>Mobile</label>
                    <input
                      defaultValue={ProfileData["mobile"]}
                      ref={mobileRef}
                      className="form-control animated fadeInUp"
                      type="tel"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <label>Password</label>
                    <input
                      defaultValue={ProfileData["password"]}
                      ref={passwordRef}
                      className="form-control animated fadeInUp"
                      type="password"
                    />
                  </div>
                  <div className="col-4 p-2">
                    <button
                      onClick={UpdateMyProfile}
                      className="w-100 btn btn-success"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChairmanProfile;
