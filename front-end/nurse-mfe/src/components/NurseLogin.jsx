import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const NURSE_LOGIN = gql`
  mutation NurseLogin($email: String!, $password: String!) {
    nurseLogin(email: $email, password: $password) {
      id
      fullName
    }
  }
`;

const NurseLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useMutation(NURSE_LOGIN);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: { email, password } });
      localStorage.setItem("nurseId", data.nurseLogin.id);
      onLogin(data.nurseLogin);
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Login as Nurse</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default NurseLogin;
