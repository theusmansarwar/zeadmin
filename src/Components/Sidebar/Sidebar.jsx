import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import {
  MdDashboard,
  MdWork,
  MdCategory,
  MdComment,
  MdPeople,
  MdOutlinePersonAddAlt,
  MdOutlineBusinessCenter,
  MdGroups2,
  MdOutlineCategory,
} from "react-icons/md";
import { FaBlog } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { GiNotebook } from "react-icons/gi";

const allItems = [
  { id: 1, name: "Dashboard", route: "/dashboard", icon: <MdDashboard /> },
  { id: 2, name: "Leads", route: "/leads", icon: <MdWork /> },
  { id: 3, name: "Industries", route: "/industries", icon: <MdOutlineBusinessCenter /> },
  { id: 4, name: "Blogs", route: "/blogs", icon: <FaBlog /> },
  { id: 5, name: "Featured Blogs", route: "/blogs/featured", icon: <FaStar /> },
  { id: 6, name: "Categories", route: "/categories", icon: <MdCategory /> },
  { id: 7, name: "Comments", route: "/comments", icon: <MdComment /> },
  { id: 8, name: "Testimonials", route: "/testimonials", icon: <MdPeople /> },
  { id: 9, name: "Users", route: "/users", icon: <MdOutlinePersonAddAlt /> },
  { id: 10, name: "Users Type", route: "/usertype", icon: <MdOutlineCategory /> },
  { id: 12, name: "Case Studies", route: "/casestudies", icon: <GiNotebook /> },
  { id: 13, name: "Teams", route: "/teams", icon: <MdGroups2 /> },
  { id: 14, name: "Team Categories", route: "/team-categories", icon: <MdOutlineCategory /> },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 mt-4">
          {allItems.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 text-xs text-gray-400 border-t border-gray-700">
        © {new Date().getFullYear()} Admin Dashboard
      </div>
    </aside>
  );
};

export default Sidebar;
