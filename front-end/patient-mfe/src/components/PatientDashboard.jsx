import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import UpdateContactInfo from "./UpdateContactInfo";
import UpdateEmergencyContact from "./UpdateEmergencyContact";
import UpdateMedicalHistory from "./UpdateMedicalHistory";
import UpdatePhysicalData from "./UpdatePhysicalData";
import MotivationCard from "./MotivationCard";
import SendHelpAlert from "./SendHelpAlert";

const GET_PATIENT = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      fullName
      contactInfo {
        phone
        email
        address
      }
      emergencyContact {
        name
        phone
        relation
      }
      medicalHistory {
        allergies
        chronicIllnesses
        pastSurgeries
        currentMedications
      }
      physicalData {
        height
        weight
        bloodPressure
        heartRate
        bloodType
        symptoms
      }
    }
  }
`;

export default function PatientDashboard() {
  const navigate = useNavigate();
  const patientId = localStorage.getItem("patientId");

  if (!patientId) {
    return <p className="text-danger">You must be logged in.</p>;
  }

  const { data, loading, error } = useQuery(GET_PATIENT, {
    variables: { id: patientId },
    skip: !patientId,
  });

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data?.patient) {
      setFormData(data.patient);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!formData) return null;

  return (
    <div className="container mt-4">
      <h2>Welcome, {formData.fullName}</h2>
      <SendHelpAlert />
      <MotivationCard />

      <nav className="nav nav-pills mb-4">
        <Link className="nav-link" to="contact-info">
          Contact Info
        </Link>
        <Link className="nav-link" to="emergency-contact">
          Emergency Contact
        </Link>
        <Link className="nav-link" to="medical-history">
          Medical History
        </Link>
        <Link className="nav-link" to="physical-data">
          Physical Data
        </Link>
      </nav>

      <Routes>
        <Route
          path="contact-info"
          element={<UpdateContactInfo data={formData} setData={setFormData} />}
        />
        <Route
          path="emergency-contact"
          element={
            <UpdateEmergencyContact data={formData} setData={setFormData} />
          }
        />
        <Route
          path="medical-history"
          element={
            <UpdateMedicalHistory data={formData} setData={setFormData} />
          }
        />
        <Route
          path="physical-data"
          element={<UpdatePhysicalData data={formData} setData={setFormData} />}
        />
      </Routes>
    </div>
  );
}
