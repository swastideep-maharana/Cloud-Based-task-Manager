import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import Tabs from "../components/Tabs";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import Loading from "../components/Loding";
import Button from "../components/Button";
import {
  useGetSigleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TASKTYPEICON = {
  Started: <MdOutlineDoneAll />,
  Completed: <FaThumbsUp />,
  "In Progress": <GrInProgress />,
  Commented: <MdOutlineMessage />,
  Bug: <FaBug />,
  Assigned: <FaUser />,
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSigleTaskQuery(id);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(act_types[0]);
  const [text, setText] = useState("");
  const [addActivity] = usePostTaskActivityMutation();

  if (isLoading) return <Loading />; // Show loading state

  const task = data?.task;

  const handleSubmit = async () => {
    try {
      await addActivity({ id, activity: text, type: selectedActivity });
      toast.success("Activity added successfully!");
      setText(""); // Clear the textarea
      refetch(); // Refetch the task to get updated activities
    } catch (error) {
      toast.error("Failed to add activity.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>

      <Tabs tabs={TABS} setSelected={setSelectedTab}>
        {selectedTab === 0 ? (
          <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-md p-8 overflow-y-auto">
            {/* LEFT */}
            <div className="w-full md:w-1/2 space-y-8">
              <div className="flex items-center gap-5">
                <div
                  className={clsx(
                    "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                    PRIOTITYSTYELS[task?.priority],
                    bgColor[task?.priority]
                  )}
                >
                  <span className="text-lg">{ICONS[task?.priority]}</span>
                  <span className="uppercase">{task?.priority} Priority</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={clsx(
                      "w-4 h-4 rounded-full",
                      TASK_TYPE[task.stage]
                    )}
                  />
                  <span className="text-black uppercase">{task?.stage}</span>
                </div>
              </div>

              <p className="text-gray-500">
                Created At: {new Date(task?.date).toDateString()}
              </p>

              <div className="flex items-center gap-8 p-4 border-y border-gray-200">
                <div className="space-x-2">
                  <span className="font-semibold">Assets:</span>
                  <span>{task?.assets?.length}</span>
                </div>

                <span className="text-gray-400">|</span>

                <div className="space-x-2">
                  <span className="font-semibold">Sub-Task:</span>
                  <span>{task?.subTasks?.length}</span>
                </div>
              </div>

              <div className="space-y-4 py-6">
                <p className="text-gray-600 font-semibold text-sm">TASK TEAM</p>
                <div className="space-y-3">
                  {task?.team?.map((m, index) => (
                    <div
                      key={index}
                      className="flex gap-4 py-2 items-center border-t border-gray-200"
                    >
                      <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600">
                        <span className="text-center">
                          {getInitials(m?.name)}
                        </span>
                      </div>

                      <div>
                        <p className="text-lg font-semibold">{m?.name}</p>
                        <span className="text-gray-500">{m?.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 py-6">
                <p className="text-gray-500 font-semibold text-sm">SUB-TASKS</p>
                <div className="space-y-8">
                  {task?.subTasks?.map((el, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-50-200">
                        <MdTaskAlt className="text-violet-600" size={26} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex gap-2 items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(el?.date).toDateString()}
                          </span>
                          <span className="px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold">
                            {el?.tag}
                          </span>
                        </div>
                        <p className="text-gray-700">{el?.title}</p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
            {/* RIGHT */}
            <div className="w-full md:w-1/2 space-y-8">
              <p className="text-lg font-semibold">ASSETS</p>
              <div className="w-full grid grid-cols-2 gap-4">
                {task?.assets?.map((el, index) => (
                  <img
                    key={index}
                    src={el}
                    alt={task?.title}
                    className="w-full rounded h-28 md:h-36 2xl:h-52 cursor-pointer transition-all duration-700 hover:scale-125 hover:z-50"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Activities activity={task?.activities} id={id} />
        )}
      </Tabs>
    </div>
  );
};

const Activities = ({ activity, id }) => {
  const [selected, setSelected] = useState(act_types[0]);
  const [text, setText] = useState("");
  const [addActivity] = usePostTaskActivityMutation();
  const isLoading = false;

  const handleSubmit = async () => {
    try {
      await addActivity({ id, activity: text, type: selected });
      toast.success("Activity added successfully!");
      setText(""); // Clear the textarea
    } catch (error) {
      toast.error("Failed to add activity.");
    }
  };

  const Card = ({ item }) => (
    <div className="flex space-x-4">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-10 h-10 flex items-center justify-center">
          {TASKTYPEICON[item?.type]} {/* Use TASKTYPEICON here */}
        </div>
        <div className="w-px h-16 bg-gray-300" />
      </div>

      <div className="flex flex-col">
        <p className="text-gray-600 text-sm">{item?.activity}</p>
        <div className="flex gap-3">
          <span className="text-gray-400 text-xs">
            {moment(item?.date).fromNow()}
          </span>
          <span className="text-gray-400 text-xs">{item?.user}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Activities</h2>
        <div className="flex gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            {act_types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Button onClick={handleSubmit}>Add Activity</Button>
        </div>
      </div>

      <div className="space-y-4">
        {activity?.map((el, index) => (
          <Card key={index} item={el} />
        ))}
      </div>
    </div>
  );
};

export default TaskDetails;
