import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import {
  useGetNotificationQuery,
  useMarkNotiAsReadMutation,
} from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";

const ICONS = {
  alert: (
    <HiBellAlert className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
  message: (
    <BiSolidMessageRounded className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { data = [], refetch } = useGetNotificationQuery(); // Fetch notifications
  const [markAsRead] = useMarkNotiAsReadMutation(); // Mutation to mark as read

  const readHandler = async (type, id) => {
    await markAsRead({ type, id }).unwrap(); // Mark notification as read
    refetch(); // Refetch notifications after marking
  };

  const viewHandler = async (el) => {
    setSelected(el); // Set the selected notification
    readHandler("one", el._id); // Mark as read
    setOpen(true); // Open the modal
  };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },
    {
      name: "Mark All Read",
      href: "#",
      onClick: () => readHandler("all", ""), // Mark all as read
    },
  ];

  return (
    <>
      <Popover className="relative">
        <Popover.Button className="inline-flex items-center outline-none">
          <div className="w-8 h-8 flex items-center justify-center text-gray-800 relative">
            <IoIosNotificationsOutline className="text-2xl" />
            {data.length > 0 && (
              <span className="absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600">
                {data.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4">
            {({ close }) =>
              data.length > 0 && (
                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                  <div className="p-4">
                    {data.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className="group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white">
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className="cursor-pointer"
                          onClick={() => viewHandler(item)}
                        >
                          <div className="flex items-center gap-3 font-semibold text-gray-900 capitalize">
                            <p>{item.notiType}</p>
                            <span className="text-xs font-normal lowercase">
                              {moment(item.createdAt).fromNow()}
                            </span>
                          </div>
                          <p className="line-clamp-1 mt-1 text-gray-600">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 divide-x bg-gray-50">
                    {callsToAction.map((item) => (
                      <Link
                        key={item.name}
                        onClick={
                          item?.onClick ? () => item.onClick() : () => close()
                        }
                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            }
          </Popover.Panel>
        </Transition>
      </Popover>

      <ViewNotification open={open} setOpen={setOpen} selected={selected} />
    </>
  );
};

// ViewNotification component for modal
const ViewNotification = ({ open, setOpen, selected }) => {
  if (!selected) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Notification Details</h2>
        <p>{selected.text}</p>
        {selected?.task?.title && (
          <p className="font-semibold mt-2">Task: {selected.task.title}</p>
        )}
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
