// NurseDashboard.jsx
import React from "react";
import { Link, Routes, Route } from "react-router-dom";

import PatientManagement from "./PatientManagement";
import MotivationCards from "./MotivationCards";
import HelpAlerts from "./HelpAlerts";

const NurseDashboard = ({ nurse }) => {
  return (
    <div className="container mt-4">
      <h2>Welcome, {nurse.fullName || "Nurse"}</h2>
      <HelpAlerts />
      <nav className="nav nav-pills mb-4">
        <Link className="nav-link" to="/dashboard/patients">
          Patient Management
        </Link>
        <Link className="nav-link" to="/dashboard/motivation">
          Motivation Cards
        </Link>
      </nav>

      <Routes>
        <Route
          path="patients"
          element={<PatientManagement nurseId={nurse.id} />}
        />
        <Route path="motivation" element={<MotivationCards />} />
      </Routes>
    </div>
  );
};

export default NurseDashboard;
