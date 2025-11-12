import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/reset-password/${uidb64}/${token}/`, { password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error resetting password");
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Set New Password</h1>
          <div className="input-box">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
          <button type="button" onClick={() => window.location.href = '/login'} className="back-button">Back to Login</button>
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
