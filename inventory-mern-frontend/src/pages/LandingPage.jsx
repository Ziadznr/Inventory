import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)" }}>
      <div className="card shadow-lg p-5 rounded-4 text-center" style={{ minWidth: "350px", maxWidth: "450px", backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
        <h1 className="mb-3 fw-bold" style={{ color: "#333" }}>Welcome</h1>
        <p className="mb-4 text-secondary">Please select your login type to continue</p>
        <div className="d-grid gap-3">
          <button
            className="btn btn-primary btn-lg fw-semibold shadow-sm"
            onClick={() => navigate("/Login")}
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Admin / User Login
          </button>
          <button
            className="btn btn-success btn-lg fw-semibold shadow-sm"
            onClick={() => navigate("/ChairmanLogin")}
            style={{ transition: "transform 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            Chairman Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
