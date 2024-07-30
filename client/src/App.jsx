import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";

// Pages
import Provider from "./pages/Provider";
import Customer from "./pages/Customer";
import Admin from "./pages/Admin";

import UsersAdmin from "./pages/Admin/UsersAdmin";
import ServiceAgreementsAdmin from "./pages/Admin/ServiceAgreementsAdmin";
import InvoicesAdmin from "./pages/Admin/InvoicesAdmin";
import ShiftsAdmin from "./pages/Admin/ShiftsAdmin";
import ProviderServiceAgreement from "./pages/Provider/ProviderServiceAgreement";
import ProviderServiceAgreements from "./pages/Provider/ProviderServiceAgreements";
import ProviderShifts from "./pages/Provider/ProviderShifts";

import CustomerServiceAgreement from "./pages/Customer/CustomerServiceAgreement";
import CustomerServiceAgreementList from "./pages/Customer/CustomerServiceAgreementList";
import CustomerShifts from "./pages/Customer/CustomerShifts";
import CustomerInvoices from "./pages/Customer/CustomerInvoices";
import Signed from "./pages/Customer/Signed";

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
        path: "customer",
        element: <Customer />,
        children: [
          {
            path: "agreement/:agreementNumber",
            element: <CustomerServiceAgreement />,
          },
          {
            path: "service-agreements",
            element: <CustomerServiceAgreementList />,
          },
          {
            path: "shifts",
            element: <CustomerShifts />,
          },
          {
            path: "invoices",
            element: <CustomerInvoices />,
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
