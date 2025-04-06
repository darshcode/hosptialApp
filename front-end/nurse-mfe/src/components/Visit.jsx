import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const ADD_VISIT = gql`
  mutation AddVisit($id: ID!, $visit: VisitInput!) {
    addVisit(id: $id, visit: $visit) {
      id
      visits {
        date
        doctor
        reason
      }
    }
  }
`;

const Visit = ({ patientId, onVisitAdded }) => {
  const [formData, setFormData] = useState({
    date: "",
    doctor: "",
    reason: "",
    diagnosis: "",
    prescribedTreatments: "",
    followUpDate: "",
  });

  const [addVisit] = useMutation(ADD_VISIT);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const visit = {
      ...formData,
      prescribedTreatments: formData.prescribedTreatments
        .split(",")
        .map((t) => t.trim()),
    };

    await addVisit({ variables: { id: patientId, visit } });

    setFormData({
      date: "",
      doctor: "",
      reason: "",
      diagnosis: "",
      prescribedTreatments: "",
      followUpDate: "",
    });

    onVisitAdded?.();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h5>Record New Visit</h5>
      {["date", "doctor", "reason", "diagnosis", "followUpDate"].map(
        (field) => (
          <input
            key={field}
            className="form-control mb-2"
            type={["date", "followUpDate"].includes(field) ? "date" : "text"}
            placeholder={
              field === "followUpDate"
                ? "Follow-up Date"
                : field[0].toUpperCase() + field.slice(1)
            }
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
          />
        )
      )}
      <input
        className="form-control mb-2"
        type="text"
        placeholder="Prescribed Treatments (comma-separated)"
        value={formData.prescribedTreatments}
        onChange={(e) =>
          setFormData({ ...formData, prescribedTreatments: e.target.value })
        }
      />
      <button className="btn btn-primary">Add Visit</button>
    </form>
  );
};

export default Visit;
