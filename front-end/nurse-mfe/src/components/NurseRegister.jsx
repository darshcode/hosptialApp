import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const REGISTER_NURSE = gql`
  mutation RegisterNurse(
    $fullName: String!
    $email: String!
    $dateOfBirth: String!
    $gender: String!
    $password: String!
  ) {
    registerNurse(
      fullName: $fullName
      email: $email
      dateOfBirth: $dateOfBirth
      gender: $gender
      password: $password
    ) {
      id
      fullName
    }
  }
`;

const NurseRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    gender: "Female",
    password: "",
  });

  const [register] = useMutation(REGISTER_NURSE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({ variables: formData });
    alert("Nurse registered successfully!");
  };

  return (
    <div className="container mt-5">
      <h3>Register New Nurse</h3>
      <form onSubmit={handleSubmit}>
        {["fullName", "email", "dateOfBirth", "password"].map((field) => (
          <input
            key={field}
            type={
              field === "dateOfBirth"
                ? "date"
                : field === "password"
                ? "password"
                : "text"
            }
            className="form-control mb-2"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            required
          />
        ))}
        <select
          className="form-control mb-2"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        >
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>
        <button className="btn btn-success">Register</button>
      </form>
    </div>
  );
};

export default NurseRegister;
