import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import NurseLogin from "./components/NurseLogin";
import NurseRegister from "./components/NurseRegister";
import NurseDashboard from "./components/NurseDashboard";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [nurse, setNurse] = useState(() => {
    const id = localStorage.getItem("nurseId");
    const fullName = localStorage.getItem("nurseFullName");
    return id ? { id, fullName } : null;
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("nurseId");
    localStorage.removeItem("nurseFullName");
    setNurse(null);
    toast.info("Logged out");
    navigate("/");
  };

  const handleLogin = (nurseData) => {
    localStorage.setItem("nurseId", nurseData.id);
    localStorage.setItem("nurseFullName", nurseData.fullName);
    setNurse(nurseData);
    toast.success(`Welcome, ${nurseData.fullName}`);
    navigate("/dashboard");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 d-flex justify-content-between">
        <div>
          <Link className="navbar-brand" to="/">
            Nurse Portal
          </Link>
          <div className="navbar-nav d-inline-flex">
            {!nurse ? (
              <>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </>
            ) : (
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          {nurse && (
            <>
              <span className="text-white me-3">Hello, {nurse.fullName}</span>
              <button onClick={handleLogout} className="btn btn-outline-light">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<NurseLogin onLogin={handleLogin} />} />
        <Route path="/register" element={<NurseRegister />} />
        <Route
          path="/dashboard/*"
          element={
            nurse ? (
              <NurseDashboard nurse={nurse} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/"
          element={<p className="p-3">Welcome to the Nurse Portal</p>}
        />
      </Routes>
    </>
  );
}

export default App;
