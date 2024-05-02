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

  const filterTasks = (tasks) => {
    let filteredTasks = tasks;

    if (searchTerm) {
      filteredTasks = filteredTasks.filter((task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === statusFilter
      );
    }

    if (dueFilter === "overdue") {
      filteredTasks = filteredTasks.filter((task) => task.dueDate < new Date());
    } else if (dueFilter === "today") {
      const today = new Date();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.dueDate >= today &&
          task.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      );
    } else if (dueFilter === "upcoming") {
      const today = new Date();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.dueDate >= new Date(today.getTime() + 24 * 60 * 60 * 1000)
      );
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
    <div className="p-4">
      <Card title={project.name} style={{ width: "100%" }}>
        <Descriptions bordered>
          <Descriptions.Item label="Description" span={3}>
            {project.description}
          </Descriptions.Item>

          <Descriptions.Item label="Tasks" span={3}>
            <div className="mt-4">
              <h3>Tasks</h3>
              {tasks?.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                <ul>
                  {tasks?.map((task, index) => (
                    <li key={index}>
                      {task.name}
                      <Descriptions.Item label="Team Members" span={3}>
                        <div className="mt-4">
                          {task?.assignedTo?.length === 0 ? (
                            <p>No team members assigned</p>
                          ) : (
                            <ul>
                              {getAssignedTeamMembers(task).map(
                                (member, index) => (
                                  <li key={index}>{member.name}</li>
                                )
                              )}
                            </ul>
                          )}
                        </div>
                      </Descriptions.Item>
                    </li>
                  ))}
                </ul>
              )}
              <Button type="primary" onClick={handleAddTask}>
                <PlusOutlined /> Add Task
              </Button>
            </div>
          </Descriptions.Item>

          {/* New */}
          <Descriptions.Item>
            <div className="mt-4">
              <div className="flex justify-between mb-4">
                <h3>Tasks</h3>
                <div className="flex items-center">
                  <Input
                    placeholder="Search tasks"
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={handleSearch}
                    className="mr-4"
                  />
                  <Dropdown
                    overlay={
                      <Menu onClick={handleStatusFilterChange}>
                        <Menu.Item key="">All</Menu.Item>
                        <Menu.Item key={"todo"}>To Do</Menu.Item>
                        <Menu.Item key="in-progress">In Progress</Menu.Item>
                        <Menu.Item key="done">Done</Menu.Item>
                      </Menu>
                    }
                  >
                    <Tooltip title="Filter by status">
                      <Button>
                        <FilterOutlined /> Status
                      </Button>
                    </Tooltip>
                  </Dropdown>
                  <Dropdown
                    overlay={
                      <Menu onClick={handleDueFilterChange}>
                        <Menu.Item key="">All</Menu.Item>
                        <Menu.Item key="overdue">Overdue</Menu.Item>
                        <Menu.Item key="today">Today</Menu.Item>
                        <Menu.Item key="upcoming">Upcoming</Menu.Item>
                      </Menu>
                    }
                    className="ml-2"
                  >
                    <Tooltip title="Filter by due date">
                      <Button>
                        <FilterOutlined /> Due Date
                      </Button>
                    </Tooltip>
                  </Dropdown>
                  <Dropdown
                    overlay={
                      <Menu onClick={handleAssigneeFilterChange}>
                        <Menu.Item key="">All</Menu.Item>
                        {teams?.map((team) => (
                          <Menu.Item key={team.id}>{team.name}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    className="ml-2"
                  >
                    <Tooltip title="Filter by assignee">
                      <Button>
                        <FilterOutlined /> Assignee
                      </Button>
                    </Tooltip>
                  </Dropdown>
                </div>
              </div>
              {filteredTasks.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                <DragAndDropTasks
                  tasks={filteredTasks}
                  onStatusChange={handleStatusChange}
                  isPending={isPending}
                  handleAddTask={handleAddTask}
                />
              )}
              <Button
                type="primary"
                onClick={handleAddTask}
                className="mt-4 block ml-auto"
              >
                <PlusOutlined /> Add Task
              </Button>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Drawer
        title="Add Task"
        width={400}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: "Please enter a task name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="assignedTo"
            label="Assigned To"
            rules={[{ required: true, message: "Please select team members" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select team members"
              showSearch // Enable search functionality
              optionFilterProp="children" // Specify which property of Option will be used for filtering
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              } // Filter options based on input
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
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handleDrawerClose}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProjectDetailsPage;
