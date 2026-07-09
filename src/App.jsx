import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Reception from "./pages/Reception";
import Manager from "./pages/Manager";
import Agent from "./pages/Agent";

function App() {
  return (
    <BrowserRouter>
      <Routes>

  <Route path="/" element={<Login />} />

  <Route path="/login" element={<Login />} />

  <Route
    path="/agent"
    element={
      <ProtectedRoute role="Agent">
        <Agent />
      </ProtectedRoute>
    }
  />

  <Route
    path="/manager"
    element={
      <ProtectedRoute role="Manager">
        <Manager />
      </ProtectedRoute>
    }
  />

  <Route
  path="/reports"
  element={
    <ProtectedRoute role="Manager">
      <Reports />
    </ProtectedRoute>
  }
/>

  <Route
    path="/reception"
    element={
      <ProtectedRoute role="Manager">
        <Reception />
      </ProtectedRoute>
    }
  />

</Routes>
    </BrowserRouter>
  );
}

export default App;