import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import codingImage from "../assets/coding.png";

const Signup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
    gender: "",
    mobile: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://cipherstudio-zicj.onrender.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful! Please login now.");
      navigate("/login");
    } else {
      alert(data.message || "Signup failed!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img src={codingImage} alt="coding" className="auth-illustration" />
      </div>

      <div className="auth-right">
        <h2 className="welcome-text">Welcome User ! 👋</h2>
        <p className="subtitle">Signup and begin your coding journey!</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="name-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email ID"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
            required
          />
          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button type="submit" className="login-btn">Signup</button>

          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/login" className="highlight">Login!</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
