import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Menu = () => {
  return (
    <div>
      <div
        style={{
          height: "100px",
          width: "100%",
          color: "aliceblue",
          padding: "20px",
          background:
            "linear-gradient(90deg, rgba(9, 9, 121, 1) 0%, rgba(0, 212, 255, 1) 100%)",
        }}
      >
        <h2>TOKO Sunratu</h2>
        Menyediakan Segala Jenis Pakaian Wanita (Jubah, Atasan, Celana, Daster,
        Mukena, Dsb.)
      </div>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        style={{ paddingLeft: "10px" }}
      >
        <NavLink className="navbar-brand" to="/home">
          Sunratu Shop
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeclassname="active"
                  exact={true.toString()}
                  to="/products"
                >
                  Product
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeclassname="active"
                  exact={true.toString()}
                  to="/home"
                >
                  Home
                </NavLink>
              </li>
            </>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
