import React from "react";
import TaskCard from "./TaskCard";

const BoardView = ({ tasks }) => {
  // Check if tasks is undefined or not an array
  if (!Array.isArray(tasks)) {
    return <div>No tasks available.</div>; // Optional: Render a message if tasks is not valid
  }

  return (
    <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
      {tasks.length === 0 ? ( // Check if tasks array is empty
        <div>No tasks available.</div> // Optional: Render a message if there are no tasks
      ) : (
        tasks.map((task) => (
          <TaskCard task={task} key={task._id} /> // Use task._id as key for better stability
        ))
      )}
    </div>
  );
};

export default BoardView;
