import React, { useState } from "react";
import { FaList } from "react-icons/fa";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loding";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const Tasks = () => {
  const params = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);
  const status = params?.status || "";

  const { data, isLoading, error } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: "",
  });

  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p>Error loading tasks. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        {!status && (
          <Button
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
            onClick={() => setOpen(true)} // Open the AddTask modal
          />
        )}
      </div>

      <div>
        <Tabs tabs={TABS} setSelected={setSelectedTab}>
          {!status && (
            <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
              <TaskTitle label="To Do" className={TASK_TYPE.todo} />
              <TaskTitle
                label="In Progress"
                className={TASK_TYPE["in progress"]}
              />
              <TaskTitle label="Completed" className={TASK_TYPE.completed} />
            </div>
          )}

          {data?.tasks?.length === 0 ? (
            <div className="text-center py-4">
              <p>No tasks available.</p>
            </div>
          ) : selectedTab !== 1 ? (
            <BoardView tasks={data?.tasks} />
          ) : (
            <Table tasks={data?.tasks} />
          )}
        </Tabs>

        <AddTask open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default Tasks;
