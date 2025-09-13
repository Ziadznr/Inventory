import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorToast, IsEmail, IsEmpty } from "../../helper/FormHelper";
import { CustomerLoginRequest } from "../../APIRequest/CustomerAPIRequest";

const CustomerLogin = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const SubmitLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validation
    if (!IsEmail(trimmedEmail)) {
      ErrorToast("Invalid Email Address");
      return;
    }
    if (IsEmpty(trimmedPassword)) {
      ErrorToast("Password Required");
      return;
    }

    setLoading(true);
    const success = await CustomerLoginRequest(trimmedEmail, trimmedPassword);
    setLoading(false);

    if (success) {
      navigate("/customer-dashboard");
    } else {
      setPassword(""); // Clear password on failure
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6 center-screen">
          <div className="card w-90 p-4">
            <div className="card-body">
              <h3>Customer Sign In</h3>
              <br />
              <input
                type="email"
                className="form-control mb-2"
                placeholder="Customer Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="btn btn-success w-100"
                onClick={SubmitLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="float-end mt-3">
                <span>
                  <Link className="ms-3 h6" to="/CustomerRegistration">
                    Sign Up
                  </Link>
                  <span className="ms-1">|</span>
                  <Link className="ms-3 h6" to="/CustomerSendOTP">
                    Forget Password
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
