import {
  LayoutDashboard,
  Receipt,
  ChartNoAxesCombined,
  User,
  Plus,
  CircleHelp
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function DashboardNav() {
  
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: Receipt,
    },
    {
      name:"Add",
      path:"/add",
      icon:Plus
    },
    {
      name: "Reports",
      path: "/reports",
      icon: ChartNoAxesCombined,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
    {
      name: "Help",
      path: "/help",
      icon: CircleHelp,
    },
  ];

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-green-900 text-white flex-col">

        <div className="p-6">
          <h1 className="text-2xl font-bold">
            Expense Tracker
          </h1>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-green-100 hover:bg-green-800"
                  }`
                }
              >
                <Icon size={21} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>


      {/* ================= MOBILE BOTTOM NAVBAR ================= */}
     {/* ================= MOBILE BOTTOM NAVBAR ================= */}
<nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-green-900 text-white border-t border-green-700">

  <div className="relative grid grid-cols-5 items-center justify-around h-16">

    {navItems.map((item) => {
      const Icon = item.icon;

      // Special Add button
      if (item.name === "Add") {
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="
              absolute
              left-1/2
              -translate-x-1/2
              -top-7
              w-14
              h-14
              rounded-full
              bg-blue-800/80
              text-white
              flex
              items-center
              border-4
              border-white
              justify-center
              shadow-xl
              z-10
            "
          >
            <Icon size={28} strokeWidth={2.5} />
          </NavLink>
        );
      }

      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-xs ${
              isActive
                ? "text-amber-300"
                : "text-green-100"
            }`
          }
        >
          <Icon size={22} />
          <span>{item.name}</span>
        </NavLink>
      );
    })}

  </div>
</nav>
    </>
  );
}