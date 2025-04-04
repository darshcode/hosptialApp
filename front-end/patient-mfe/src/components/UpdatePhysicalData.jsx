import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const UPDATE_PHYSICAL_DATA = gql`
  mutation UpdatePatient($id: ID!, $physicalData: PhysicalDataInput) {
    updatePatient(id: $id, physicalData: $physicalData) {
      id
    }
  }
`;

export default function UpdatePhysicalData({ data, setData }) {
  const navigate = useNavigate();
  const [updatePatient] = useMutation(UPDATE_PHYSICAL_DATA);

  const removeTypename = (obj) => {
    if (!obj) return {};
    return JSON.parse(JSON.stringify(obj), (key, value) =>
      key === "__typename" ? undefined : value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanedData = removeTypename(data.physicalData);
      const result = await updatePatient({
        variables: {
          id: data.id,
          physicalData: cleanedData,
        },
      });
      console.log("Update success:", result);
      navigate("/dashboard");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update physical data. Check the console for details.");
    }
  };

  const update = (field, value) => {
    setData((prev) => ({
      ...prev,
      physicalData: {
        ...prev.physicalData,
        [field]: value,
      },
    }));
  };

  const arrayField = (field) => (data.physicalData?.[field] || []).join(", ");

  return (
    <div>
      <h4>Update Physical Data</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Height (cm)"
          type="number"
          value={data.physicalData?.height || ""}
          onChange={(e) => update("height", parseFloat(e.target.value))}
        />
        <input
          className="form-control mb-2"
          placeholder="Weight (kg)"
          type="number"
          value={data.physicalData?.weight || ""}
          onChange={(e) => update("weight", parseFloat(e.target.value))}
        />
        <input
          className="form-control mb-2"
          placeholder="Blood Pressure"
          value={data.physicalData?.bloodPressure || ""}
          onChange={(e) => update("bloodPressure", e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Heart Rate"
          type="number"
          value={data.physicalData?.heartRate || ""}
          onChange={(e) => update("heartRate", parseInt(e.target.value))}
        />
        <input
          className="form-control mb-2"
          placeholder="Blood Type"
          value={data.physicalData?.bloodType || ""}
          onChange={(e) => update("bloodType", e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Symptoms (comma-separated)"
          value={arrayField("symptoms")}
          onChange={(e) => update("symptoms", e.target.value.split(","))}
        />
        <button type="submit" className="btn btn-success">
          Save Physical Data
        </button>
      </form>
    </div>
  );
}
