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
import ProviderServiceAgreement from "./pages/Provider/ProviderServiceAgreement";
import ProviderServiceAgreements from "./pages/Provider/ProviderServiceAgreements";
import ProviderShifts from "./pages/Provider/ProviderShifts";

import SupportServiceAgreement from "./pages/Support/SupportServiceAgreement";
import SupportServiceAgreementList from "./pages/Support/SupportServiceAgreementList";
import SupportShifts from "./pages/Support/SupportShifts";
import SupportInvoices from "./pages/Support/SupportInvoices";
import Signed from "./pages/Support/Signed";

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "signed", element: <Signed /> },
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
            path: "service-agreement",
            element: <ProviderServiceAgreement />,
          },
          {
            path: "service-agreements",
            element: <ProviderServiceAgreements />,
          },
          {
            path: "shifts",
            element: <ProviderShifts />,
          },
        ],
      },
      {
        path: "support",
        element: <Support />,
        children: [
          {
            path: "agreement/:agreementNumber",
            element: <SupportServiceAgreement />,
          },
          {
            path: "service-agreements",
            element: <SupportServiceAgreementList />,
          },
          {
            path: "shifts",
            element: <SupportShifts />,
          },
          {
            path: "invoices",
            element: <SupportInvoices />,
          },
        ],
      },
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
