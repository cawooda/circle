import { Outlet } from "react-router-dom";
import AdminOptionsPanel from "../components/AdminOptionsPanel";

const mainGridItemProps = {
  as: "main",
  colSpan: { base: 6, md: 4, xl: 5 },
};

export default function AdminLayout() {
  return (
    // repeats the grid column 6 * 1 fraction
    <>
      <Outlet />
    </>
  );
}
