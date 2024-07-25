import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";

// Pages
import Provider from "./pages/Provider";
import Support from "./pages/Support";
import Admin from "./pages/Admin";

import UsersAdmin from "./pages/Admin/UsersAdmin";
import ServiceAgreementsAdmin from "./pages/Admin/ServiceAgreementsAdmin";
import InvoicesAdmin from "./pages/Admin/InvoicesAdmin";
import ShiftsAdmin from "./pages/Admin/ShiftsAdmin";
import ProviderServiceAgreements from "./pages/Provider/ProviderServiceAgreement";
import ProviderShifts from "./pages/Provider/ProviderShifts";


// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "admin",
        element: <Admin />,
        children: [
          {
            path: "users",
            element: <UsersAdmin />,
          },
          {
            path: "service-agreements",
            element: <ServiceAgreementsAdmin />,
          },
          {
            path: "shifts",
            element: <ShiftsAdmin />,
          },
          {
            path: "invoices",
            element: <InvoicesAdmin />,
          },
        ],
      },
      {
        path: "provider",
        element: <Provider />,
        children: [
          {
            path: "service-agreements",
            element: <ProviderServiceAgreements />,
          },
          {
            path: "service-agreements",
            element: <ProviderShifts />,
          },
        ],
      },
      { path: "support", element: <Support /> },
    ],
  },
]);

function App() {
  return (
    <>
      
        <RouterProvider router={router} />
      
    </>
  );
}

export default App;
