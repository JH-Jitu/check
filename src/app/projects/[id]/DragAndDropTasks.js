import { useEffect, useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import useStore from "@/store/taskStore/taskStore";
import { create } from "zustand";

function DragAndDropTask(props) {
  // converted in Zustand.........
  //   const [columns, setColumns] = useState(defaultCols);
  //   const [tasks, setTasks] = useState(defaultTasks);
  //   const [activeColumn, setActiveColumn] = useState(null);
  //   const [activeTask, setActiveTask] = useState(null);
  // .............................

  const { onStatusChange, handleAddTask } = props;

  const {
    columns,
    tasks,
    setTasks,
    activeColumn,
    activeTask,
    createTask,
    deleteTask,
    updateTask,
    onDragStart,
    // onDragEnd,
    onDragOver,
  } = useStore();

  const dragEndStore = create((set) => ({
    onDragEnd: (event) => {
      set({ activeColumn: null, activeTask: null });

      const { active, over } = event;
      // (statusChange) => set({ statusChange: active?.data?.current?.task });

      // As I need 'onStatusChange' this variable to update the value I had to write the component here.
      onStatusChange(active?.data?.current?.task);

      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isActiveAColumn = active.data.current?.type === "Column";
      if (!isActiveAColumn) return;

      const columns = get().columns;
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      set({
        columns: arrayMove(columns, activeColumnIndex, overColumnIndex),
      });
    },
  }));
  const { onDragEnd } = dragEndStore();

  const columnsId = useMemo(() => columns?.map((col) => col.id), [columns]);

  useEffect(() => {
    setTasks(props.tasks);
  }, [props.tasks]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns?.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.status === col.id)}
                  handleAddTask={handleAddTask}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter((task) => task.status === activeColumn.id)}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                handleAddTask={handleAddTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  //   function createTask(status) {
  //     const newTask = {
  //       id: generateId(),
  //       status,
  //       content: `Task ${tasks.length + 1}`,
  //     };

  //     setTasks([...tasks, newTask]);
  //   }

  //   function deleteTask(id) {
  //     const newTasks = tasks.filter((task) => task.id !== id);
  //     setTasks(newTasks);
  //   }

  //   function updateTask(id, content) {
  //     const newTasks = tasks.map((task) => {
  //       if (task.id !== id) return task;
  //       return { ...task, content };
  //     });

  //     setTasks(newTasks);
  //   }

  //   function updateColumn(id, title) {
  //     const newColumns = columns.map((col) => {
  //       if (col.id !== id) return col;
  //       return { ...col, title };
  //     });

  //     setColumns(newColumns);
  //   }

  //   function onDragStart(event) {
  //     if (event.active.data.current?.type === "Column") {
  //       setActiveColumn(event.active.data.current.column);
  //       return;
  //     }

  //     if (event.active.data.current?.type === "Task") {
  //       setActiveTask(event.active.data.current.task);
  //       return;
  //     }
  //   }

  //   function onDragEnd(event) {
  //     setActiveColumn(null);
  //     setActiveTask(null);

  //     const { active, over } = event;

  //     console.log({ active });
  //     onStatusChange(active?.data?.current?.task);

  //     if (!over) return;

  //     const activeId = active.id;
  //     const overId = over.id;

  //     if (activeId === overId) return;

  //     const isActiveAColumn = active.data.current?.type === "Column";
  //     if (!isActiveAColumn) return;

  //     console.log("DRAG END");

  //     setColumns((columns) => {
  //       const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

  //       const overColumnIndex = columns.findIndex((col) => col.id === overId);

  //       return arrayMove(columns, activeColumnIndex, overColumnIndex);
  //     });
  //   }

  //   function onDragOver(event) {
  //     const { active, over } = event;
  //     if (!over) return;

  //     const activeId = active.id;
  //     const overId = over.id;

  //     if (activeId === overId) return;

  //     const isActiveATask = active.data.current?.type === "Task";
  //     const isOverATask = over.data.current?.type === "Task";

  //     if (!isActiveATask) return;

  //     // Im dropping a Task over another Task
  //     if (isActiveATask && isOverATask) {
  //       setTasks((tasks) => {
  //         const activeIndex = tasks.findIndex((t) => t.id === activeId);
  //         const overIndex = tasks.findIndex((t) => t.id === overId);

  //         if (tasks[activeIndex].status != tasks[overIndex].status) {
  //           // Fix introduced after video recording
  //           tasks[activeIndex].status = tasks[overIndex].status;
  //           return arrayMove(tasks, activeIndex, overIndex - 1);
  //         }

  //         return arrayMove(tasks, activeIndex, overIndex);
  //       });
  //     }

  //     const isOverAColumn = over.data.current?.type === "Column";

  //     // Im dropping a Task over a column
  //     if (isActiveATask && isOverAColumn) {
  //       setTasks((tasks) => {
  //         const activeIndex = tasks.findIndex((t) => t.id === activeId);

  //         tasks[activeIndex].status = overId;
  //         console.log("DROPPING TASK OVER COLUMN", { activeIndex });
  //         return arrayMove(tasks, activeIndex, activeIndex);
  //       });
  //     }
  //   }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default DragAndDropTask;
