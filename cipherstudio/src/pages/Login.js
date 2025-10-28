import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import codingImage from "../assets/coding.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://cipherstudio-zicj.onrender.com/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("cipherUser", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert(data.message || "Invalid credentials!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img src={codingImage} alt="coding" className="auth-illustration" />
      </div>

      <div className="auth-right">
        <h2 className="welcome-text">Welcome User ! 👋</h2>
        <p className="subtitle">SignIn and begin with your coding!</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email ID:</label>
          <input
            type="email"
            placeholder="Enter your email ID"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-section">
            <span className="forgot-text">Forgot Password?</span>
          </div>

          <button type="submit" className="login-btn">Login</button>

          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/signup" className="highlight">Get Started!</Link>
          </p>

          <div className="or-divider">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <button type="button" className="google-btn">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
            />
            Sign In with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
