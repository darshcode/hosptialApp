import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const UPDATE_CONTACT_INFO = gql`
  mutation UpdatePatient($id: ID!, $contactInfo: ContactInfoInput) {
    updatePatient(id: $id, contactInfo: $contactInfo) {
      id
    }
  }
`;

export default function UpdateContactInfo({ data, setData }) {
  const navigate = useNavigate();
  const [updatePatient] = useMutation(UPDATE_CONTACT_INFO);

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
        contactInfo: removeTypename(data.contactInfo),
      },
    });
    navigate("/dashboard");
  };

  const updateField = (field, value) => {
    setData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <h4>Update Contact Info</h4>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Phone"
          value={data.contactInfo?.phone || ""}
          onChange={(e) => updateField("phone", e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={data.contactInfo?.email || ""}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <input
          className="form-control mb-3"
          placeholder="Address"
          value={data.contactInfo?.address || ""}
          onChange={(e) => updateField("address", e.target.value)}
        />
        <button type="submit" className="btn btn-success mt-2">
          Save Contact Info
        </button>
      </form>
    </div>
  );
}
