import React from "react";
import { gql, useQuery } from "@apollo/client";
import Visit from "./Visit";

const GET_PATIENT_VISITS = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
      id
      fullName
      visits {
        date
        doctor
        reason
        diagnosis
        prescribedTreatments
        followUpDate
      }
    }
  }
`;

const History = ({ patientId }) => {
  const { data, loading, error, refetch } = useQuery(GET_PATIENT_VISITS, {
    variables: { id: patientId },
    skip: !patientId,
  });

  if (loading) return <p>Loading visit history...</p>;
  if (error) return <p>Error loading visits: {error.message}</p>;

  const visits = data?.patient?.visits ?? [];

  return (
    <div className="container mt-4">
      <h4>Visit History for {data?.patient?.fullName}</h4>
      {visits.length === 0 ? (
        <p className="text-muted">No visits recorded yet.</p>
      ) : (
        <ul className="list-group mb-4">
          {visits.map((v, i) => (
            <li key={i} className="list-group-item">
              <strong>Date:</strong> {v.date} <br />
              <strong>Doctor:</strong> {v.doctor} <br />
              <strong>Reason:</strong> {v.reason} <br />
              <strong>Diagnosis:</strong> {v.diagnosis || "N/A"} <br />
              <strong>Treatments:</strong>{" "}
              {v.prescribedTreatments?.join(", ") || "None"} <br />
              <strong>Follow-up:</strong> {v.followUpDate || "N/A"}
            </li>
          ))}
        </ul>
      )}

      <Visit patientId={patientId} onVisitAdded={refetch} />
    </div>
  );
};

export default History;
