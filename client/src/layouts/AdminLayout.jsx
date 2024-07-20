import { Outlet } from "react-router-dom";
import AdminOptionsPanel from "../components/AdminOptionsPanel";

const mainGridItemProps = {
  as: "main",
  colSpan: { base: 12, md: 10, xl: 5 },
};

export default function AdminLayout() {
  return (
    // repeats the grid column 6 * 1 fraction
    <>
      <AdminOptionsPanel />

      <Outlet />
    </>
  );
}
