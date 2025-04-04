import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const UPDATE_EMERGENCY_CONTACT = gql`
  mutation UpdatePatient($id: ID!, $emergencyContact: EmergencyContactInput) {
    updatePatient(id: $id, emergencyContact: $emergencyContact) {
      id
    }
  }
`;

export default function UpdateEmergencyContact({ data, setData }) {
  const navigate = useNavigate();
  const [updatePatient] = useMutation(UPDATE_EMERGENCY_CONTACT);

  const removeTypename = (obj) => {
    const copy = { ...obj };
    delete copy.__typename;
    return copy;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePatient({
      variables: {
        id: data.id,
        emergencyContact: removeTypename(data.emergencyContact),
      },
    });
    navigate("/dashboard");
  };

  const update = (field, value) => {
    setData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <h4>Update Emergency Contact</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={data.emergencyContact?.name || ""}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Phone"
          value={data.emergencyContact?.phone || ""}
          onChange={(e) => update("phone", e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Relation"
          value={data.emergencyContact?.relation || ""}
          onChange={(e) => update("relation", e.target.value)}
        />
        <button type="submit" className="btn btn-success">
          Save Emergency Contact
        </button>
      </form>
    </div>
  );
}
