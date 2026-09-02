import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Agent from "./pages/Agent";
import Manager from "./pages/Manager";
import Reception from "./pages/Reception";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* =====================================
            LOGIN
        ===================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =====================================
            ADMIN
        ===================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <Admin />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            MANAGER
        ===================================== */}

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="Manager">
              <Manager />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            AGENT
        ===================================== */}

        <Route
          path="/agent"
          element={
            <ProtectedRoute role="Agent">
              <Agent />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            RECEPTION
        ===================================== */}

        <Route
          path="/reception"
          element={
            <ProtectedRoute role="Reception">
              <Reception />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            REPORTS
        ===================================== */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute role="Manager">
              <Reports />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            FALLBACK
        ===================================== */}

        <Route
          path="*"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;