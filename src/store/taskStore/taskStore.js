import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

const defaultTasks = [
  {
    id: "1",
    status: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    status: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    status: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    status: "doing",
    content: "Analyze competitors",
  },
  {
    id: "5",
    status: "done",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    status: "done",
    content: "Dev meeting",
  },
  {
    id: "7",
    status: "done",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    status: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    status: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    status: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    status: "todo",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    status: "doing",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    status: "doing",
    content: "Design and implement responsive UI",
  },
];

const defaultCols = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "in-progress",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

// Define the store
const useStore = create((set, get) => ({
  columns: defaultCols,
  tasks: defaultTasks,
  activeColumn: null,
  activeTask: null,
  teams: [],
  statusChange: null,

  setColumns: (columns) => set({ columns }),
  setTasks: (tasks) => set({ tasks }),
  setActiveColumn: (activeColumn) => set({ activeColumn }),
  setActiveTask: (activeTask) => set({ activeTask }),
  setTeams: (teams) => set({ teams }),
  setStatusChange: (statusChange) => set({ statusChange }),

  createTask: (status) => {
    const tasks = get().tasks;
    const newTask = {
      id: generateId(),
      status,
      content: `Task ${tasks.length + 1}`,
    };
    set({ tasks: [...tasks, newTask] });
  },

  deleteTask: (id) => {
    const tasks = get().tasks;
    set({ tasks: tasks.filter((task) => task.id !== id) });
  },

  updateTask: (id, content) => {
    const tasks = get().tasks;
    set({
      tasks: tasks.map((task) =>
        task.id !== id ? task : { ...task, content }
      ),
    });
  },

  updateColumn: (id, title) => {
    const columns = get().columns;
    set({
      columns: columns.map((col) => (col.id !== id ? col : { ...col, title })),
    });
  },

  onDragStart: (event) => {
    if (event.active.data.current?.type === "Column") {
      set({ activeColumn: event.active.data.current.column });
    } else if (event.active.data.current?.type === "Task") {
      set({ activeTask: event.active.data.current.task });
    }
  },

  onDragEnd: (event) => {
    set({ activeColumn: null, activeTask: null });

    const { active, over } = event;
    // (statusChange) => set({ statusChange: active?.data?.current?.task });
    // this?.statusChange(active?.data?.current?.task);

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

  onDragOver: (event) => {
    const { active, over } = event;
    // onStatusChange(active?.data?.current?.task);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const tasks = get().tasks;
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (tasks[activeIndex].status !== tasks[overIndex].status) {
        tasks[activeIndex].status = tasks[overIndex].status;
        set({ tasks: arrayMove(tasks, activeIndex, overIndex - 1) });
      } else {
        set({ tasks: arrayMove(tasks, activeIndex, overIndex) });
      }
    } else if (isActiveATask) {
      // Dropping a Task over a column
      const isOverAColumn = over.data.current?.type === "Column";
      if (isOverAColumn) {
        const tasks = get().tasks;
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex].status = overId;
        set({ tasks: arrayMove(tasks, activeIndex, activeIndex) });
      }
    }
  },
}));

export default useStore;
