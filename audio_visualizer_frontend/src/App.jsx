import React from "react";
import { Routes, Route, NavLink, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Visualizer from "./pages/Visualizer";

function useAuth() {
  const token = localStorage.getItem("token");
  return { isAuthed: Boolean(token), token };
}

function Header() {
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <header>
      <div className="container header-row">
        <div className="brand">🎵 Audio Visualizer</div>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          {isAuthed && <NavLink to="/visualizer">Visualizer</NavLink>}
          {!isAuthed && <NavLink to="/login">Login</NavLink>}
          {!isAuthed && <NavLink to="/signup">Signup</NavLink>}
          {isAuthed && <button className="button ghost" onClick={logout}>Logout</button>}
        </nav>
      </div>
    </header>
  );
}

function PrivateRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Header />
      <div className="container" style={{ paddingTop: 24 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visualizer" element={<PrivateRoute><Visualizer /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}
