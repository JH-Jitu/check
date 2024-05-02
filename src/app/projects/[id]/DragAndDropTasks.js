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
    <div className="flex min-h-screen w-full flex-col items-center px-4 md:px-10 overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4 flex-wrap xl:flex-nowrap w-full justify-center">
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
                className="mb-4 md:mb-0"
              />
            ))}
          </SortableContext>
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
}

export default DragAndDropTask;
