import React, { Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import { ErrorToast, IsEmail, IsEmpty } from "../../helper/FormHelper";
import { ChairmanLoginRequest } from "../../APIRequest/ChairmansAPIRequest";

const ChairmanLogin = () => {
  const emailRef = useRef();
  const passRef = useRef();

  const SubmitLogin = async () => {
    const email = emailRef.current.value;
    const password = passRef.current.value;

    // Validation
    if (!IsEmail(email)) {
      ErrorToast("Invalid Email Address");
      return;
    }
    if (IsEmpty(password)) {
      ErrorToast("Password Required");
      return;
    }

    let result = await ChairmanLoginRequest(email, password);
    if (result) {
      // Redirect to chairman dashboard or homepage
      window.location.href = "/chairman-dashboard";
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 center-screen">
            <div className="card w-90 p-4">
              <div className="card-body">
                <h3>Chairman Sign In</h3>
                <br />
                <input
                  ref={emailRef}
                  placeholder="Chairman Email"
                  className="form-control"
                  type="email"
                />
                <br />
                <input
                  ref={passRef}
                  placeholder="Password"
                  className="form-control"
                  type="password"
                />
                <br />
                <button
                  onClick={SubmitLogin}
                  className="btn btn-success w-100 animated"
                >
                  Login
                </button>
                <div className="float-end mt-3">
                  <span>
                    <Link className="text-center ms-3 h6" to="/ChairmanRegistration">
                      Sign Up
                    </Link>
                    <span className="ms-1">|</span>
                    <Link className="text-center ms-3 h6" to="/chairman-forgot-password">
                      Forget Password
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ChairmanLogin;
