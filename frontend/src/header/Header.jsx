import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../customHooks/loginHook";

const Navigation = () => {
  const { isAuth, logout } = useAuth();

  return (
    <nav className="main-nav">
      <ul>
        <li>
          <Link to="/coins">Coins</Link>
        </li>
        <li>
          <Link to="/chart">Chart</Link>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/trade">Trade</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
