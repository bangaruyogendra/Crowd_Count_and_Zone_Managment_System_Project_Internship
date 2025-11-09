import { FaUser, FaLock } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import React, { useState, useEffect } from "react";
import "./LoginRegister.css";
import "./Terms_and_Conditions.css";
import axios from "axios";
import UserManagment from "../pages/User_Managment";
import { useNavigate } from "react-router-dom";
import Terms_and_Conditions from "./Terms_and_Conditions";

const LoginRegister = () => {
  const [action, setAction] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const registerLink = () => setAction("active");
  const loginLink = () => setAction("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePasswordReset = () => navigate("/password-reset");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: formData.username,
        password: formData.password,
      });
      alert(res.data.message);
      setIsLoggedIn(true);
      localStorage.setItem("loginTime", Date.now());
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData
      );
      alert(res.data.message);
      setFormData({ username: "", email: "", password: "" });
      setAction("");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  useEffect(() => {
    const clearSession = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const timePassed = Date.now() - parseInt(loginTime);
        const limit = 10 * 60 * 1000;
        if (timePassed > limit) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("loginTime");
          setIsLoggedIn(false);
        }
      }
    }, 60000);

    return () => clearInterval(clearSession);
  }, []);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
    if (!rememberMe) {
      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
  };

  if (isLoggedIn) return <UserManagment />;

  return (
    <div className={`wrapper ${action}`}>
      {/* LOGIN FORM */}
      <div className="form-box login">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forget">
            <label>
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} onClick={handleRememberMe} /> Remember me
            </label>
            <a href="#" onClick={handlePasswordReset}>
              Forgot password?
            </a>
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={registerLink}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* REGISTER FORM */}
      <div className="form-box register">
        <form onSubmit={handleRegister}>
          <h1>Registration</h1>
          <div className="input-box">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleChange}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
            <IoIosMail className="icon" />
          </div>

          <div className="input-box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <FaLock className="icon" />
          </div>

          <div className="remember-forget">
            <label>
              <input type="checkbox" />{" "}
              <span>
                <a href="#" onClick={() => setShowTerms(true)}>
                  I agree to Terms & Conditions
                </a>
              </span>
            </label>
          </div>

          <button type="submit">Register</button>
          <div className="register-link">
            <p>
              Already have an account?{" "}
              <a href="#" onClick={loginLink}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>

      
      {showTerms && (
        <div className="terms-overlay" onClick={() => setShowTerms(false)}>
          <div
            className="terms-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setShowTerms(false)}>
              ✖
            </button>
            <Terms_and_Conditions />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
