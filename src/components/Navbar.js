import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

export default function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div className="navbar navbar-expand-lg  bg-info">
      <div className="container-fluid ">
        <Link className="navbar-brand  " to="/">
          Digital Notebook{" "}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {localStorage.getItem("token") && (
              <li className="nav-item user" style={{ marginLeft: "76vw" }}>
                <Link
                  className={`nav-link ${
                    location.pathname === "/user" ? "active" : ""
                  } `}
                  to="/user"
                >
                  <FaUserAlt />
                </Link>
              </li>
            )}
          </ul>
          <form className="d-flex" role="search">
            {!localStorage.getItem("token") ? (
              <Link
                className="btn btn-light text-info mx-1"
                to="/login"
                role="button"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="btn btn-light text-info"
              >
                Logout
              </button>
            )}
            {!localStorage.getItem("token") && (
              <Link
                className="btn btn-light text-info mx-1"
                to="/signup"
                role="button"
              >
                Signup
              </Link>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
