"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const DragAndDropTasks = ({ tasks, onStatusChange }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const itemsMoved = Array.from(tasks);
    const [movedTask] = itemsMoved.splice(result.source.index, 1);
    itemsMoved.splice(result.destination.index, 0, {
      ...movedTask,
      status: result.destination.droppableId,
    });

    onStatusChange(itemsMoved);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex">
        {["todo", "in-progress", "done"].map((status, index) => (
          <StrictModeDroppable key={status} droppableId={status}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="bg-gray-200 p-4 mr-4 rounded-md"
              >
                <h3 className="text-lg font-semibold mb-2">{status}</h3>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="bg-white p-2 mb-2 rounded-md shadow-md"
                        >
                          {task.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default DragAndDropTasks;

export const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};
