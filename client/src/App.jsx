import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { Fragment, useRef } from "react";
import { Transition } from "@headlessui/react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import Users from "./pages/Users.jsx";
import Trash from "./pages/Trash.jsx";
import TaskDetails from "./pages/TaskDetails.jsx";
import { Toaster } from "sonner";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import { setOpenSidebar } from "./redux/slices/authSlice.js";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <MobileSideBar />
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="p-4 2xl:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}

const MobileSideBar = () => {
  const { isSideBarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSideBarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={(mobileMenuRef.current = Node)}
          className={clsx(
            "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform",
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={closeSidebar}
        >
          <div className="bg-white w-3/4 h-full">
            <div className="w-full flex justify-end px-5 mt-5">
              <button
                onClick={() => closeSidebar()}
                className="flex justify-end items-end"
              >
                <IoClose size={25} />
              </button>
            </div>

            <div className="-mt-10">
              <Sidebar />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/todo/:status" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Route>

        <Route path="/log-in" element={<Login />} />
      </Routes>
      <Toaster richColor />
    </main>
  );
}

export default App;
