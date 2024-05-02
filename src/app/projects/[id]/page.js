"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Drawer,
  Spin,
  Dropdown,
  Menu,
  Tooltip,
  notification,
} from "antd";
import {
  addTask,
  fetchProjectDetails,
  fetchTasks,
  fetchTeams,
  updateTask,
} from "@/app/api/fetchAPI";
import {
  PlusOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import DragAndDropTasks from "./DragAndDropTasks";
import PlusIcon from "./icons/PlusIcon";

const { Option } = Select;

const ProjectDetailsPage = ({ params }) => {
  const { id } = params;
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProjectDetails(id),
  });
  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => fetchTasks(id),
  });
  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState(""); // Initialize searchTerm state
  const [statusFilter, setStatusFilter] = useState(""); // Initialize statusFilter state
  const [dueFilter, setDueFilter] = useState(""); // Initialize dueFilter state
  const [assigneeFilter, setAssigneeFilter] = useState(""); // Initialize assigneeFilter state

  const [selectedTask, setSelectedTask] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const filterTasks = (tasks) => {
    let filteredTasks = tasks;

    if (searchTerm) {
      filteredTasks = filteredTasks?.filter((task) =>
        task?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    if (dueFilter === "overdue") {
      filteredTasks = filteredTasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate < new Date();
      });
    } else if (dueFilter === "today") {
      filteredTasks = filteredTasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00:00
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return dueDate >= today && dueDate < tomorrow;
      });
    } else if (dueFilter === "upcoming") {
      filteredTasks = filteredTasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        return dueDate >= tomorrow;
      });
    }

    if (assigneeFilter) {
      filteredTasks = filteredTasks?.filter((task) =>
        task?.assignedTo?.includes(parseInt(assigneeFilter))
      );
    }

    return filteredTasks;
  };

  const filteredTasks = filterTasks(tasks || []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update searchTerm state
  };

  const getAssignedTeamMembers = (task) => {
    const assignedTeamMembers = [];
    console.log({ task });
    if (teams) {
      task &&
        task.assignedTo.forEach((memberId) => {
          const team = teams?.find((t) => t.id === memberId);
          assignedTeamMembers?.push(team);
        });
    }

    return assignedTeamMembers;
  };

  const { mutate: addTaskMutation } = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", parseInt(id)]);
      setIsDrawerOpen(false);
      form.resetFields();
    },
  });

  const handleAddTask = (prevTask) => {
    if (prevTask) {
      setSelectedTask(prevTask);
      form.setFieldsValue(prevTask);
      setIsDrawerOpen(true);
    }

    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleSubmitTask = (values) => {
    addTaskMutation({ ...values, status: "todo", projectId: id });
    openNotification();
  };

  const {
    mutate: updateTaskMutation,
    isPending,
    status,
  } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const handleUpdateTask = (values) => {
    const updated = { ...selectedTask, ...values };
    updateTaskMutation({ ...updated, id: updated?.id });

    setSelectedTask(null);
    openNotification();
    handleDrawerClose();
  };

  const handleStatusChange = (updatedTask) => {
    updateTaskMutation({ ...updatedTask, id: updatedTask?.id });
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.key);
  };

  const handleDueFilterChange = (e) => {
    setDueFilter(e.key);
  };

  const handleAssigneeFilterChange = (e) => {
    setAssigneeFilter(e.key);
  };

  const openNotification = () => {
    api.open({
      message: "Notification Title",
      description: "description.",
    });
  };

  console.log({ status });

  const handleFormSubmit = (values) => {
    console.log({ selectedTask });
    if (!selectedTask?.id) {
      handleSubmitTask(values);
    }
    handleUpdateTask(values);
  };

  if (isProjectLoading || isTasksLoading) {
    return (
      <div className="flex justify-center h-screen place-items-center">
        <Spin tip="Loading projects..." />
      </div>
    );
  }

  return (
    <div className="p-4 h-full xl:h-screen">
      {contextHolder}
      <Card
        title={
          <div className="flex justify-between">
            <div>
              {" "}
              <h3>{project.name}</h3>
            </div>
            <a href="/projects">Go back to Previous Page</a>
          </div>
        }
        style={{ width: "100%" }}
        className="rounded-lg shadow-md bg-white h-[100%]"
      >
        <div bordered className="rounded-lg">
          <div span={3} className="text-gray-700">
            <b>Description:</b> {project.description}
          </div>

          {/* New */}
          <div>
            <div className="mt-4">
              <div className="flex justify-between content-center">
                <div className="mb-6">
                  <button
                    type="primary"
                    onClick={handleAddTask}
                    className="mt-4 ml-auto rounded-md shadow-sm flex justify-center items-center border border-1 py-1 px-4"
                  >
                    <PlusIcon /> Add Task
                  </button>
                </div>
                <div className="flex items-center flex-wrap md:flex-nowrap">
                  <Input
                    placeholder="Search tasks"
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="mr-4 rounded-md shadow-sm"
                  />
                  {/* Status Filter */}
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={handleStatusFilterChange}
                        className="rounded-md shadow-md"
                      >
                        <Menu.Item key="" className="hover:bg-gray-100">
                          All
                        </Menu.Item>
                        <Menu.Item key={"todo"} className="hover:bg-gray-100">
                          To Do
                        </Menu.Item>
                        <Menu.Item
                          key="in-progress"
                          className="hover:bg-gray-100"
                        >
                          In Progress
                        </Menu.Item>
                        <Menu.Item key="done" className="hover:bg-gray-100">
                          Done
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Tooltip title="Filter by status">
                      <Button className="rounded-md shadow-sm">
                        <FilterOutlined /> Status
                      </Button>
                    </Tooltip>
                  </Dropdown>

                  {/* Date Filter */}
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={handleDueFilterChange}
                        className="rounded-md shadow-md"
                      >
                        <Menu.Item key="" className="hover:bg-gray-100">
                          All
                        </Menu.Item>
                        <Menu.Item key="overdue" className="hover:bg-gray-100">
                          Overdue
                        </Menu.Item>
                        <Menu.Item key="today" className="hover:bg-gray-100">
                          Today
                        </Menu.Item>
                        <Menu.Item key="upcoming" className="hover:bg-gray-100">
                          Upcoming
                        </Menu.Item>
                      </Menu>
                    }
                    className="ml-2"
                  >
                    <Tooltip title="Filter by due date">
                      <Button className="rounded-md shadow-sm">
                        <FilterOutlined /> Due Date
                      </Button>
                    </Tooltip>
                  </Dropdown>

                  {/* Team Filter */}
                  <Dropdown
                    overlay={
                      <Menu
                        onClick={handleAssigneeFilterChange}
                        className="rounded-md shadow-md"
                      >
                        <Menu.Item key="" className="hover:bg-gray-100">
                          All
                        </Menu.Item>
                        {teams?.map((team) => (
                          <Menu.Item
                            key={team.id}
                            className="hover:bg-gray-100"
                          >
                            {team.name}
                          </Menu.Item>
                        ))}
                      </Menu>
                    }
                    className="ml-2"
                  >
                    <Tooltip title="Filter by assignee">
                      <Button className="rounded-md shadow-sm">
                        <FilterOutlined /> Assignee
                      </Button>
                    </Tooltip>
                  </Dropdown>
                </div>
              </div>
              {filteredTasks.length === 0 ? (
                <p className="text-gray-600">No tasks found</p>
              ) : (
                <div>
                  <DragAndDropTasks
                    tasks={filteredTasks}
                    onStatusChange={handleStatusChange}
                    isPending={isPending}
                    handleAddTask={handleAddTask}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Drawer
        title="Add Task"
        width={400}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        className="rounded-lg shadow-md"
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: "Please enter a task name" }]}
            className="mb-4"
          >
            <Input className="rounded-md shadow-sm" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
            className="mb-4"
          >
            <Input.TextArea className="rounded-md shadow-sm" />
          </Form.Item>
          <Form.Item
            name="assignedTo"
            label="Assigned To"
            rules={[{ required: true, message: "Please select team members" }]}
            className="mb-4"
          >
            <Select
              mode="multiple"
              placeholder="Select team members"
              showSearch // Enable search functionality
              optionFilterProp="children" // Specify which property of Option will be used for filtering
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              } // Filter options based on input
              className="rounded-md shadow-sm"
            >
              {teams?.map((member) => (
                <Option key={member.id} value={member.id}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[
              {
                required: true,
                message: "Please select a due date",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || new Date(value) >= new Date()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please select at least 1 day after today")
                  );
                },
              }),
            ]}
            className="mb-4"
          >
            <Input type="date" className="rounded-md shadow-sm" />
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                className="rounded-md shadow-sm"
              >
                Submit
              </Button>
              <Button
                onClick={handleDrawerClose}
                className="rounded-md shadow-sm"
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProjectDetailsPage;
