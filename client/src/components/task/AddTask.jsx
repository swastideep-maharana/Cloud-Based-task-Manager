import React, { useState, useEffect } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button.jsx";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../utils/firebase.js";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/api/taskApiSlice";
import { toast } from "sonner";
import { dateFormatter } from "../../utils/index.js";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
  const defaultValues = {
    title: task?.title || "",
    date: dateFormatter(task?.date || new Date()),
    team: [],
    stage: "",
    priority: "",
    assets: [],
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });

  const [team, setTeam] = useState([]);
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileURLs, setUploadedFileURLs] = useState([]);

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        date: dateFormatter(task.date),
      });
      setTeam(task.team || []);
      setStage(task.stage?.toUpperCase() || LISTS[0]);
      setPriority(task.priority?.toUpperCase() || PRIORITY[2]);
    }
  }, [task, reset]);

  const submitHandler = async (data) => {
    setUploading(true);

    try {
      // Upload files and prepare task data
      const uploadPromises = assets.map(uploadFile);
      const fileURLs = await Promise.all(uploadPromises);
      setUploadedFileURLs(fileURLs);

      // Prepare task data
      const taskData = {
        ...data,
        assets: [...fileURLs],
        team,
        stage,
        priority,
      };

      console.log('Task Data:', taskData); // Log task data

      // Check if it's an update or a new task
      if (task && task._id) {
        console.log('Updating task with ID:', task._id); // Log task ID
        const res = await updateTask({ ...taskData, id: task._id }).unwrap();
        toast.success(res.message);
      } else {
        const res = await createTask(taskData).unwrap();
        toast.success(res.message);
      }

      setOpen(false);
    } catch (err) {
      console.error("Error creating/updating task:", err);
      console.error("Error response:", err?.data); // Log error response
      toast.error(err?.data?.message || err.error || "An unexpected error occurred.");
    } finally {
      setUploading(false);
      setAssets([]);
    }
  };

  const handleSelect = (e) => {
    setAssets(Array.from(e.target.files));
  };

  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const name = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file", error.message);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL))
            .catch(reject);
        }
      );
    });
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          {task ? "UPDATE TASK" : "ADD TASK"}
        </Dialog.Title>

        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="Task Title"
            type="text"
            name="title"
            label="Task Title"
            className="w-full rounded"
            register={register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />

          <UserList setTeam={setTeam} team={team} />

          <div className="flex gap-4">
            <SelectList
              label="Task Stage"
              lists={LISTS}
              selected={stage}
              setSelected={setStage}
            />

            <Textbox
              placeholder="Date"
              type="date"
              name="date"
              label="Task Date"
              className="w-full rounded"
              register={register("date", { required: "Date is required!" })}
              error={errors.date?.message}
            />
          </div>

          <div className="flex gap-4">
            <SelectList
              label="Priority Level"
              lists={PRIORITY}
              selected={priority}
              setSelected={setPriority}
            />

            <div className="w-full flex items-center justify-center mt-4">
              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                htmlFor="imgUpload"
              >
                <input
                  type="file"
                  className="hidden"
                  id="imgUpload"
                  onChange={handleSelect}
                  accept=".jpg, .png, .jpeg"
                  multiple
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            {uploading ? (
              <span className="text-sm py-2 text-red-500">
                Uploading assets...
              </span>
            ) : (
              <Button
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              />
            )}

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;
