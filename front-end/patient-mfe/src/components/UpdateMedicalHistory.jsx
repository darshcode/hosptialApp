import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const UPDATE_MEDICAL_HISTORY = gql`
  mutation UpdatePatient($id: ID!, $medicalHistory: MedicalHistoryInput) {
    updatePatient(id: $id, medicalHistory: $medicalHistory) {
      id
    }
  }
`;

export default function UpdateMedicalHistory({ data, setData }) {
  const navigate = useNavigate();
  const [updatePatient] = useMutation(UPDATE_MEDICAL_HISTORY);

  const removeTypename = (obj) => {
    const clone = { ...obj };
    delete clone.__typename;
    return clone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePatient({
      variables: {
        id: data.id,
        medicalHistory: removeTypename(data.medicalHistory),
      },
    });
    navigate("/dashboard");
  };

  const update = (field, value) => {
    setData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value,
      },
    }));
  };

  const arrayField = (field) => (data.medicalHistory?.[field] || []).join(", ");

  return (
    <div>
      <h4>Update Medical History</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Allergies (comma-separated)"
          value={arrayField("allergies")}
          onChange={(e) => update("allergies", e.target.value.split(","))}
        />
        <input
          className="form-control mb-2"
          placeholder="Chronic Illnesses"
          value={arrayField("chronicIllnesses")}
          onChange={(e) =>
            update("chronicIllnesses", e.target.value.split(","))
          }
        />
        <input
          className="form-control mb-2"
          placeholder="Past Surgeries"
          value={arrayField("pastSurgeries")}
          onChange={(e) => update("pastSurgeries", e.target.value.split(","))}
        />
        <input
          className="form-control mb-3"
          placeholder="Current Medications"
          value={arrayField("currentMedications")}
          onChange={(e) =>
            update("currentMedications", e.target.value.split(","))
          }
        />
        <button type="submit" className="btn btn-success">
          Save Medical History
        </button>
      </form>
    </div>
  );
}
