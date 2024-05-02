import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "./icons/TrashIcon";
import { Button, Descriptions, Modal } from "antd";
import { fetchTeams } from "@/app/api/fetchAPI";
import { useQuery } from "@tanstack/react-query";

function TaskCard({
  task,
  deleteTask,
  // updateTask,
  handleAddTask,
}) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setNodeRef, attributes, listeners, transition, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "Task",
        task,
      },
      disabled: editMode,
    });

  const style = {
    transition,
    // transform: CSS.Transform.toString(transform),
  };

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getAssignedTeamMembers = (task) => {
    const assignedTeamMembers = [];
    console.log({ task });
    if (teams) {
      task &&
        task?.assignedTo?.forEach((memberId) => {
          const team = teams.find((t) => t.id === memberId);
          assignedTeamMembers.push(team);
        });
    }

    return assignedTeamMembers;
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-indigo-200 p-4 rounded-lg hover:shadow-lg cursor-grab relative task"
      onMouseEnter={() => {
        toggleEditMode();
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-gray-800">
        {task.name}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-black absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity duration-300"
        >
          <TrashIcon />
        </button>
      )}
      <div className="flex justify-end">
        <Button
          type="default"
          onClick={() => setIsModalOpen((prevState) => !prevState)}
          className="mr-2 rounded-md shadow-sm"
        >
          Details
        </Button>
        <Button
          type="default"
          onClick={() => handleAddTask(task)}
          className="rounded-md shadow-sm"
        >
          Edit
        </Button>
      </div>
      <Modal
        title={task ? `${task.name}` : ""}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <>
          <Descriptions.Item className="mb-4" label="Team Members" span={3}>
            <b>Description:</b>
            <div>{task?.description}</div>
          </Descriptions.Item>
          <Descriptions.Item className="mb-4" label="Team Members" span={3}>
            <b>Due Date</b>
            <div>
              {new Date(task?.dueDate).toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </Descriptions.Item>
          <Descriptions.Item className="mb-4" label="Team Members" span={3}>
            <b>Status</b>
            <div className="capitalize">{task?.status}</div>
          </Descriptions.Item>
          <Descriptions.Item className="mb-4" label="Team Members" span={3}>
            <b>Assigned Team Members</b>
            <div>
              {task?.assignedTo?.length === 0 ? (
                <p>No team members assigned</p>
              ) : (
                <ul className="grid grid-cols-2">
                  {getAssignedTeamMembers(task).map((member, index) => (
                    <li key={index}>
                      <b>{member.name}</b>
                      {member?.members?.map((person, index) => (
                        <li key={index}>{person?.name}</li>
                      ))}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Descriptions.Item>
        </>
      </Modal>
    </div>
  );
}

export default TaskCard;
