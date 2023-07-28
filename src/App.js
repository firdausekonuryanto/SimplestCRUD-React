import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import the Bootstrap CSS file
import Menu from "./Menu";
import Home from "./Home"; // Import your Home component
import Product from "./Product"; // Import your Products component

const App = () => {
  return (
    <Router>
      <Menu /> {/* Render the Menu component */}
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Product />} />
      </Routes>
    </Router>
  );
};

export default App;
