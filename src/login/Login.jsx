import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import useAuth from "../customHooks/loginHook";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      return;
    }

    const endpoint = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/register";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setAuth(data.token);
      navigate("/coins");
    }
  };

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <h1 className="LoginHeader">{isLogin ? "Login" : "Register"}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        )}
        {!isLogin && password !== confirmPassword ? (
          <p className="passwordRed">Passwords do not match!</p>
        ) : (
          ""
        )}
        <button type="submit">Submit</button>
        <p onClick={() => setIsLogin(!isLogin)} className="loginPointer">
          {isLogin ? "Don't have an account? SIGN UP" : "Already a User? Login"}
        </p>
        {isLogin && <p className="loginPointer">Forgot password?</p>}
      </form>
    </div>
  );
}

export default Login;
