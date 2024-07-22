import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Provider from "./pages/Provider";
import Support from "./pages/Support";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminShifts from "./pages/Admin/AdminShifts";
import AdminServiceAgreements from "./pages/Admin/AdminServiceAgreements";

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "shifts", element: <AdminShifts /> },
          { path: "service-agreements", element: <AdminServiceAgreements /> },
        ],
      },
      ,
      { path: "provider", element: <Provider /> },
      { path: "support", element: <Support /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
