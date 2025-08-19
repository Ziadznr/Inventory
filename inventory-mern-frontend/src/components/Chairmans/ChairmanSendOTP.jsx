import React, { Fragment, useRef } from "react";
import { ErrorToast, IsEmail } from "../../helper/FormHelper";
import { ChairmanRecoverVerifyEmailRequest } from "../../APIRequest/ChairmansAPIRequest";
import { useNavigate } from "react-router-dom";

const ChairmanSendOTP = () => {
  const emailRef = useRef(null);
  const navigate = useNavigate();

  const VerifyEmail = async () => {
    const email = emailRef.current.value.trim();

    if (!IsEmail(email)) {
      ErrorToast("Valid Email Address Required!");
      return;
    }

    let result = await ChairmanRecoverVerifyEmailRequest(email);
    if (result === true) {
      navigate("/ChairmanVerifyOTP"); // Redirect to Chairman OTP verification page
    }
  };

  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6 center-screen">
            <div className="card w-90 p-4">
              <div className="card-body">
                <h4>EMAIL VERIFICATION</h4>
                <hr />
                <label htmlFor="emailInput">Your email address</label>
                <input
                  id="emailInput"
                  ref={emailRef}
                  placeholder="Chairman Email"
                  className="form-control animated fadeInUp"
                  type="email"
                />
                <br />
                <button
                  onClick={VerifyEmail}
                  className="btn w-100 btn-success animated"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ChairmanSendOTP;
