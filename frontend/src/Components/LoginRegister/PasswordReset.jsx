import React, { useState } from "react";
import axios from "axios";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/password-reset/", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>
          <div className="input-box">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send Reset Link</button>
          <button type="button" onClick={() => window.location.href = '/login'}>Back to Login</button>
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
