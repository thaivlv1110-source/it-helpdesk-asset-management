import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  useAuth,
} from "./auth/AuthContext";

import ProtectedRoute
  from "./auth/ProtectedRoute";

import AppLayout
  from "./components/AppLayout";

import LoginPage
  from "./pages/LoginPage";

import EmployeeDashboard
  from "./pages/EmployeeDashboard";

import SupportDashboard
  from "./pages/SupportDashboard";

import AdminDashboard
  from "./pages/AdminDashboard";

import TicketsPage
  from "./pages/TicketsPage";

import TicketDetailPage
  from "./pages/TicketDetailPage";

import AssetsPage
  from "./pages/AssetsPage";

import AssetDetailPage
  from "./pages/AssetDetailPage";

import AdminUsersPage
  from "./pages/AdminUsersPage";

/* =====================================
   DASHBOARD ROUTER
===================================== */

const DashboardRouter =
  () => {
    const {
      user,
    } = useAuth();

    if (
      user?.role ===
      "ADMIN"
    ) {
      return (
        <AdminDashboard />
      );
    }

    if (
      user?.role ===
      "IT_SUPPORT"
    ) {
      return (
        <SupportDashboard />
      );
    }

    if (
      user?.role ===
      "EMPLOYEE"
    ) {
      return (
        <EmployeeDashboard />
      );
    }

    return null;
  };

/* =====================================
   APP
===================================== */

const App = () => {
  return (
    <Routes>
      {/* LOGIN */}

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />

      {/* AUTHENTICATED AREA */}

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* DASHBOARD */}

        <Route
          index
          element={
            <DashboardRouter />
          }
        />

        {/* TICKETS */}

        <Route
          path="tickets"
          element={
            <TicketsPage />
          }
        />

        <Route
          path="tickets/:id"
          element={
            <TicketDetailPage />
          }
        />

        {/* ASSETS */}

        <Route
          path="assets"
          element={
            <AssetsPage />
          }
        />

        <Route
          path="assets/:id"
          element={
            <AssetDetailPage />
          }
        />

        {/* SUPPORT */}

        <Route
          path="support/tickets"
          element={
            <ProtectedRoute
              allowedRoles={[
                "IT_SUPPORT",
                "ADMIN",
              ]}
            >
              <TicketsPage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN USERS */}

        <Route
          path="admin/users"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
              ]}
            >
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* FALLBACK */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;