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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  addTask,
  fetchProjectDetails,
  fetchTasks,
  fetchTeams,
} from "@/app/api/fetchAPI";

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

  const getAssignedTeamMembers = (tasks) => {
    const assignedTeamMembers = [];
    console.log({ tasks });
    if (teams) {
      tasks?.forEach((task) => {
        task &&
          task.assignedTo.forEach((memberId) => {
            const team = teams.find((t) => t.id === memberId);
            assignedTeamMembers.push(team);
          });
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

  const handleAddTask = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleSubmitTask = (values) => {
    addTaskMutation({ ...values, projectId: id });
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
          <Descriptions.Item label="Team Members" span={3}>
            <div className="mt-4">
              {getAssignedTeamMembers(tasks).length === 0 ? (
                <p>No team members assigned</p>
              ) : (
                <ul>
                  {getAssignedTeamMembers(tasks).map((member, index) => (
                    <li key={index}>{member.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Tasks" span={3}>
            <div className="mt-4">
              <h3>Tasks</h3>
              {tasks?.length === 0 ? (
                <p>No tasks found</p>
              ) : (
                <ul>
                  {tasks?.map((task, index) => (
                    <li key={index}>{task.name}</li>
                  ))}
                </ul>
              )}
              <Button type="primary" onClick={handleAddTask}>
                <PlusOutlined /> Add Task
              </Button>
            </div>
          </Descriptions.Item>
        </Descriptions>

        {/* <div className="mt-4">
          <h3>Recent Activities</h3>
          {project.recentActivities.length === 0 ? (
            <p>No recent activities found</p>
          ) : (
            <ul>
              {project.recentActivities.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          )}
        </div> */}
      </Card>

      <Drawer
        title="Add Task"
        width={400}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitTask}>
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
            <Select mode="multiple" placeholder="Select team members">
              {teams.map((member) => (
                <Option key={member.id} value={member.id}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Please select a due date" }]}
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
