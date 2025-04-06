import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import History from "./History"; // ✅ Make sure this exists

const GET_ALL_PATIENTS = gql`
  query {
    getAllPatients {
      id
      fullName
    }
  }
`;

const GET_NURSE = gql`
  query GetNurse($id: ID!) {
    getNurse(id: $id) {
      id
      fullName
      patients {
        id
        fullName
      }
    }
  }
`;

const ASSIGN_PATIENT = gql`
  mutation AssignPatient($nurseId: ID!, $patientId: ID!) {
    assignPatientToNurse(nurseId: $nurseId, patientId: $patientId) {
      id
      patients {
        id
        fullName
      }
    }
  }
`;

const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;

const PatientManagement = ({ nurseId }) => {
  const [expandedPatientId, setExpandedPatientId] = useState(null);

  const {
    data: nurseData,
    loading: loadingNurse,
    refetch: refetchNurse,
  } = useQuery(GET_NURSE, {
    variables: { id: nurseId },
    skip: !nurseId,
  });

  const {
    data: allData,
    loading: loadingAll,
    refetch: refetchAll,
  } = useQuery(GET_ALL_PATIENTS);

  const [assignPatient] = useMutation(ASSIGN_PATIENT);
  const [deletePatient] = useMutation(DELETE_PATIENT);

  const handleAssign = async (patientId) => {
    await assignPatient({ variables: { nurseId, patientId } });
    refetchNurse();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      await deletePatient({ variables: { id } });
      refetchAll();
      refetchNurse();
    }
  };

  const toggleHistory = (id) => {
    setExpandedPatientId((prev) => (prev === id ? null : id));
  };

  if (loadingNurse || loadingAll) return <p>Loading...</p>;

  const assigned = nurseData?.getNurse?.patients ?? [];
  const all = allData?.getAllPatients ?? [];

  return (
    <div className="container">
      <h4 className="mt-4">Patients Assigned to You</h4>
      <ul className="list-group mb-4">
        {assigned.length === 0 ? (
          <li className="list-group-item text-muted">No patients assigned.</li>
        ) : (
          assigned.map((p) => (
            <li key={p.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <span>{p.fullName}</span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => toggleHistory(p.id)}
                >
                  {expandedPatientId === p.id ? "Hide History" : "Show History"}
                </button>
              </div>

              {expandedPatientId === p.id && (
                <div className="mt-3">
                  <History patientId={p.id} />
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      <h4>All Patients</h4>
      <ul className="list-group">
        {all.map((p) => (
          <li
            key={p.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{p.fullName}</span>
            <div>
              <button
                className="btn btn-sm btn-success me-2"
                onClick={() => handleAssign(p.id)}
              >
                Assign
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientManagement;
