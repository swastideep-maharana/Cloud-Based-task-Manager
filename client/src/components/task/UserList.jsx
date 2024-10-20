import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { summary } from "../../assets/data"; // Ensure this has the correct structure
import clsx from "clsx";
import { getInitials } from "../../utils";
import { MdCheck } from "react-icons/md";

const UserList = ({ setTeam, team }) => {
  const data = summary.users || []; // Fallback to an empty array if undefined
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleChange = (el) => {
    setSelectedUsers(el);
    setTeam(el?.map((u) => u?._id)); // Use optional chaining
  };

  useEffect(() => {
    if (team?.length > 0) {
      setSelectedUsers(data.filter(user => team.includes(user._id))); // Set selected users based on team IDs
    } else if (data.length > 0) {
      setSelectedUsers([data[0]]); // Fallback to first user if team is empty
      setTeam([data[0]._id]); // Update team with the first user's ID
    }
  }, [team, data, setTeam]);

  return (
    <div>
      <p className="text-gray-700">Assign Task To: </p>
      <Listbox value={selectedUsers} onChange={handleChange} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 2xl:py-3 border border-gray-300 sm:text-sm">
            <span className="block truncate">
              {selectedUsers.length > 0
                ? selectedUsers.map((user) => user?.name).join(", ") // Optional chaining to avoid errors
                : "Select users"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {data
                .filter((user) => user && user.name) // Filter out undefined users and those without names
                .map((user) => (
                  <Listbox.Option
                    key={user._id} // Use a unique key
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={user}
                  >
                    {({ selected }) => (
                      <>
                        <div
                          className={clsx(
                            "flex items-center gap-2 truncate",
                            selected ? "font-medium" : "font-normal"
                          )}
                        >
                          <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                            <span className="text-center text-[10px]">
                              {getInitials(user.name)}
                            </span>
                          </div>
                          <span>{user.name}</span>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                            <MdCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default UserList;
