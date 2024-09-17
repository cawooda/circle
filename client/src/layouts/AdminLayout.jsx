import React from "react";

import { Outlet } from "react-router-dom";
import SubMenu from "../components/SubMenu";
import { useUser } from "../contexts/UserContext";
import { AdminProvider } from "../contexts/AdminContext";

const menu = [
  { label: "Users", link: "users" },
  { label: "Service Agreements", link: "service-agreements" },
  { label: "Shifts", link: "shifts" },
  { label: "Invoices", link: "invoices" },
  { label: "Providers", link: "providers" },
];

export default function AdminLayout() {
  const { user, setUser, loading, error } = useUser();
  return (
    <>
      <AdminProvider>
        <SubMenu items={menu} />
        <Outlet />
      </AdminProvider>
    </>
  );
}
