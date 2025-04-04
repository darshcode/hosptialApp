import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import ContactInfoForm from "./UpdateContactInfo";
import EmergencyContactForm from "./UpdateEmergencyContact";
import MedicalHistoryForm from "./UpdateMedicalHistory";
import PhysicalDataForm from "./UpdatePhysicalData";

const ADD_PATIENT = gql`
  mutation AddPatient(
    $fullName: String!
    $dateOfBirth: String!
    $gender: String!
    $contactInfo: ContactInfoInput!
    $emergencyContact: EmergencyContactInput!
    $medicalHistory: MedicalHistoryInput!
    $physicalData: PhysicalDataInput!
    $visits: [VisitInput!]
    $password: String!
  ) {
    addPatient(
      fullName: $fullName
      dateOfBirth: $dateOfBirth
      gender: $gender
      contactInfo: $contactInfo
      emergencyContact: $emergencyContact
      medicalHistory: $medicalHistory
      physicalData: $physicalData
      visits: $visits
      password: $password
    ) {
      id
    }
  }
`;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    password: "",
    contactInfo: {},
    emergencyContact: {},
    medicalHistory: {},
    physicalData: {},
    visits: [],
  });

  const [addPatient] = useMutation(ADD_PATIENT, {
    onCompleted: () => navigate("/"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addPatient({ variables: patient });
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Full Name"
          value={patient.fullName}
          onChange={(e) => setPatient({ ...patient, fullName: e.target.value })}
          required
        />
        <div className="form-group mb-2">
          <label>Date of Birth</label>
          <input
            type="date"
            className="form-control"
            value={patient.dateOfBirth}
            onChange={(e) =>
              setPatient({ ...patient, dateOfBirth: e.target.value })
            }
            required
          />
        </div>
        <input
          className="form-control mb-2"
          placeholder="Gender"
          value={patient.gender}
          onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Password"
          type="password"
          value={patient.password}
          onChange={(e) => setPatient({ ...patient, password: e.target.value })}
          required
        />

        <ContactInfoForm data={patient} setData={setPatient} />
        <EmergencyContactForm data={patient} setData={setPatient} />
        <MedicalHistoryForm data={patient} setData={setPatient} />
        <PhysicalDataForm data={patient} setData={setPatient} />

        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
}
