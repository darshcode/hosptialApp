import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      fullName
    }
  }
`;

export default function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("patientId", data.login.id); // ✅ store ID
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ variables: form });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-primary" type="submit">
          Login
        </button>

        {error && <p className="text-danger">{error.message}</p>}
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
