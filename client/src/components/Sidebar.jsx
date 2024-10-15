import React from "react";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";

// Sidebar link data
const linkData = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard />,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: <FaTasks />,
  },
  {
    label: "Completed",
    path: "/completed/completed",
    icon: <MdTaskAlt />,
  },
  {
    label: "In Progress",
    path: "/in-progress/in-progress",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "To Do",
    path: "/todo/todo",
    icon: <MdOutlinePendingActions />,
  },
  {
    label: "Team",
    path: "/team",
    icon: <FaUsers />,
  },
  {
    label: "Trash",
    path: "/trash",
    icon: <FaTrashAlt />,
  },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // Get the current path
  const currentPath = location.pathname.split("/")[1];

  // Sidebar links based on user role
  const SidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  // Close the sidebar when a link is clicked
  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  // Render NavLink component for each sidebar link
  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.path}
        onClick={closeSidebar}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#564ed2]",
          currentPath === el.path.split("/")[0]
            ? "bg-blue-700 text-neutral-100"
            : ""
        )}
      >
        {el.icon}
        <span className="hover:text-[#2564ed]">{el.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5">
      <h1 className="flex gap-1 items-center">
        <p className="bg-blue-600 p-2 rounded-full">
          <MdOutlineAddTask className="text-white text-2xl font-black" />
        </p>
        <span className="text-2xl font-bold text-black">Task Me</span>
      </h1>

      <div className="flex-1 flex flex-col gap-y-5 py-8">
        {SidebarLinks.map((link) => (
          <NavLink key={link.label} el={link} />
        ))}
      </div>

      <div className="">
        <button className="w-full flex gap-2 p-2 items-center text-lg text-gray-800 dark:text-white">
          <MdSettings />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
