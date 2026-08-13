import { BrowserRouter, Routes, Route } from "react-router-dom";

import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Reception from "./pages/Reception";
import Manager from "./pages/Manager";
import Agent from "./pages/Agent";
import Settings from "./pages/Settings";


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            AGENT
        ================================================= */}

        <Route
          path="/agent"
          element={

            <ProtectedRoute role="Agent">

              <Agent />

            </ProtectedRoute>

          }
        />


        {/* =================================================
            MANAGER
        ================================================= */}

        <Route
          path="/manager"
          element={

            <ProtectedRoute role="Manager">

              <Manager />

            </ProtectedRoute>

          }
        />


        {/* =================================================
            REPORTS
        ================================================= */}

        <Route
          path="/reports"
          element={

            <ProtectedRoute role="Manager">

              <Reports />

            </ProtectedRoute>

          }
        />


        {/* =================================================
            RECEPTION
        ================================================= */}

        <Route
          path="/reception"
          element={

            <ProtectedRoute role="Manager">

              <Reception />

            </ProtectedRoute>

          }
        />


        {/* =================================================
            SETTINGS
        ================================================= */}

        <Route
          path="/settings"
          element={

            <ProtectedRoute>

              <Settings />

            </ProtectedRoute>

          }
        />


      </Routes>

    </BrowserRouter>

  );

}


export default App;