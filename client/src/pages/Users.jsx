import React, { useState } from "react";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import { getInitials } from "../utils";
import clsx from "clsx";
import ConfirmatioDialog, { UserAction } from "../components/Dialogs";
import {
  useGetTeamListQuery,
  useUserActionMutation,
  useDeleteUserMutation,
} from "../redux/slices/api/userApiSlice";
import { toast } from "sonner";
import AddUser from "../components/AddUser";

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, isLoading, isError, refetch } = useGetTeamListQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async () => {
    if (!selected) return;

    const newIsActive = !selected.isActive; // Determine new status
    setSelected((prev) => ({ ...prev, isActive: newIsActive }));

    try {
      await userAction({ isActive: newIsActive, _id: selected._id }).unwrap();
      toast.success(
        `User ${newIsActive ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change user status.");
    }
  };

  const deleteHandler = async () => {
    if (selected) {
      try {
        await deleteUser(selected._id).unwrap();
        toast.success("User deleted successfully!");
        refetch(); // Refetch the team list
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete user.");
      } finally {
        setOpenDialog(false);
      }
    }
  };

  const deleteClick = (user) => {
    setSelected(user);
    setOpenDialog(true);
  };

  const editClick = (user) => {
    setSelected(user);
    setOpen(true);
  };

  const userStatusClick = (user) => {
    setSelected(user);
    setOpenAction(true);
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">
              {getInitials(user.name)}
            </span>
          </div>
          {user.name}
        </div>
      </td>
      <td className="p-2">{user.title}</td>
      <td className="p-2">{user.email || "user@example.com"}</td>
      <td className="p-2">{user.role}</td>
      <td>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx(
            "w-fit px-4 py-1 rounded-full",
            user.isActive ? "bg-blue-200" : "bg-yellow-100"
          )}
          aria-label={`Mark user as ${user.isActive ? "deactivate" : "activate"}`}
        >
          {user.isActive ? "Active" : "Disabled"}
        </button>
      </td>
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(user)}
        />
        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(user)}
        />
      </td>
    </tr>
  );

  if (isLoading) return <div>Loading...</div>; // Loading state

  if (isError) return <div>Error loading users.</div>; // Error state

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {data?.length > 0 ? (
                  data.map((user) => <TableRow key={user._id} user={user} />)
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={selected?._id || "new-user"}
      />

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;
