import { Outlet } from "react-router-dom";
import DashboardNav from "../components/DashboardNav";
export default function DashboardLayout() {
  return (
    <div className="min-h-dvh">
      <DashboardNav />

      <main className="md:ml-64 pb-20 md:pb-0">
        <Outlet/>
      </main>
    </div>
  );
}