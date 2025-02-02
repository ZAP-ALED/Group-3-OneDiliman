import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter,RouterProvider,} from "react-router-dom";
import './index.css';
import LandingPage from "./pages/LandingPage/LandingPage";
import LogInPage from "./pages/LogIn/LoginPage";
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import OrgPage from './pages/OrgPage/OrgPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ManageMembers from './pages/OrgPage/ManageMembers';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/dashboard/:orgId",
    element: <OrgPage />,
  },
  {
    path: "/dashboard/:orgId/manageMembers/:view",
    element: <ManageMembers />,
  },
  {
    path: "/signup",
    element: <SignUpPage />
  },
  {
    path: "/admin/:view",
    element: <AdminPage />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
