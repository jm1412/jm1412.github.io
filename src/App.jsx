import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import { lazy } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Gasto from "./pages/Gasto";

// Lazy load the route components

function App() {
  return (
    <Router>
      <div>
        <MenuBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gasto" element={<Gasto />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
