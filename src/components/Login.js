import React, { useState } from "react";
import { useUser } from "./UserContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import "./Login.css"; // assuming CSS is in a separate file

export default function Login() {
  const { setUser } = useUser();
  const [input, setInput] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.username && input.password) {
      setUser({ name: input.username, isGuest: false });
    } else {
      alert("Please enter username and password");
    }
  };

  const handleGuest = () => {
    setUser({ name: "Guest", isGuest: true });
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src="https://www.astrolitetech.com/assets/uploads/logo.png" alt="Company Logo" className="company-logo" />
      </div>

      <div className="login-right">
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={input.username}
            onChange={handleChange}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={input.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              style={{ paddingRight: "44px" }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 14,
                top: "35%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#667eea",
                fontSize: "1.2rem",
                userSelect: "none",
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setShowPassword((prev) => !prev);
              }}
              role="button"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit">Login</button>
          <button type="button" className="guest-btn" onClick={handleGuest}>
            Continue as Guest
          </button>
          <p className="footer-text">Welcome back! Please login to continue.</p>
        </form>
      </div>
    </div>
  );
}
