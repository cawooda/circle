import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import ServiceSign from "./ServiceSign";

// Pages
import ProviderLayout from "./layouts/ProviderLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import {
  UsersAdmin,
  ServiceAgreementsAdmin,
  ShiftsAdmin,
  InvoicesAdmin,
  ProviderAdmin,
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
import AuthLink from "./AuthLink";
import UserVerify from "./pages/UserVerify";
import AuthReset from "./pages/AuthReset";
<pages></pages>;

import "./index.css";

import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import SigninForm from "./components/SigninForm";

// Router configuration
const router = createBrowserRouter([
  {
    path: "signed",
    element: <ServiceSign />,
    children: [{ path: "", element: <Signed /> }],
  },
  {
    path: "agreement",
    element: <ServiceSign />,
    children: [
      { path: ":agreementNumber", element: <CustomerServiceAgreement /> },
    ],
  },
  {
    path: "auth",
    element: <AuthLink />,
    children: [{ path: ":authLinkNumber", element: <UserVerify /> }],
  },
  {
    path: "login",
    element: <AuthLink />,
    children: [{ path: "", element: <SigninForm /> }],
  },
  {
    path: "/",
    element: <App />,
    children: [
      { path: "reset/:authLinkNumber", element: <AuthReset /> },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            path: "users",
            element: <UsersAdmin />,
          },
          {
            path: "providers",
            element: <ProviderAdmin />,
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
