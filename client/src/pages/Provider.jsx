import { Outlet } from "react-router-dom";
import ProviderSubMenu from "../components/ProviderSubMenu";

export default function Provider() {
  return (
    <>
      <ProviderSubMenu />
      <Outlet />
    </>
  );
}
