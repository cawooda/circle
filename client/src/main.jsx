import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// Layouts
import RootLayout from "./layouts/RootLayout";

// Pages
import ProviderLayout from "./layouts/ProviderLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import {
  UsersAdmin,
  ServiceAgreementsAdmin,
  ShiftsAdmin,
  InvoicesAdmin,
} from "./pages/Admin";

import {
  CustomerInvoices,
  CustomerServiceAgreement,
  CustomerServiceAgreementList,
  CustomerShifts,
  Signed,
} from "./pages/Customer";

import {
  ProviderServiceAgreement,
  ProviderServiceAgreements,
  ProviderShifts,
  ProviderInvoices,
} from "./pages/Provider";

import "./index.css";

import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "signed", element: <Signed /> },
      {
        path: "admin",
        element: <AdminLayout />,
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
        element: <ProviderLayout />,
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
          {
            path: "invoices",
            element: <ProviderInvoices />,
          },
        ],
      },
      {
        path: "customer",
        element: <CustomerLayout />,
        children: [
          {
            path: "agreement/:agreementNumber",
            element: <CustomerServiceAgreement />,
          },
          {
            path: "agreement",
            element: <CustomerLayout />,
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
