import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { authActions } from "../../_store";

const Nav = () => {
  const authUser = useSelector((x) => x.auth.user);
  const dispatch = useDispatch();
  const logout = () => dispatch(authActions.logout());

  // only show nav when logged in
  if (!authUser) return null;

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="navbar-nav">
        <NavLink to="/" className="nav-item nav-link">
          Home
        </NavLink>
        <NavLink to="/users" className="nav-item nav-link">Users</NavLink>
        <button onClick={logout} className="btn btn-link nav-item nav-link">
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Nav;
