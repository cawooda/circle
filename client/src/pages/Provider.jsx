import { Outlet } from "react-router-dom";
import ProviderSubMenu from "../pages/Provider/_ProviderSubMenu";

export default function Provider() {
  return (
    <>
      <ProviderSubMenu />
      <Outlet />
    </>
  );
}
