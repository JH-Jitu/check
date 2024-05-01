"use client";
import { useEffect, useState } from "react";
import { Button, Space, Spin, Drawer, Form, Input, Select, Alert } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useProjectStore from "@/store/projectStore/projectStore";
import useAuthStore from "@/store/authStore/authStore";
import ProjectList from "@/components/ProjectList/ProjectList";
import { addProject, fetchProjects, fetchTeams } from "../api/fetchAPI";

const { Option } = Select;

const ProjectsOverviewPage = () => {
  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });

  const setProjects = useProjectStore((state) => state.setProjects);
  const user = useAuthStore((state) => state?.user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [error, setError] = useState(false);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate: addProjectMutation } = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setIsDrawerOpen(false);
      form.resetFields();
    },
    onError: () => {
      setError(true);
    },
  });

  useEffect(() => {
    if (projects) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  const handleAddProject = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleSubmitProject = (values) => {
    addProjectMutation(values);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Space>
          <Button type="primary" onClick={handleAddProject}>
            Add Project
          </Button>
          <Button onClick={refetch}>Refresh</Button>
        </Space>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Spin tip="Loading projects..." />
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
      <Drawer
        title="Add Project"
        width={400}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        className="pb-[80px]"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitProject}>
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: "Please enter a project name" }]}
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
            name="teamId"
            label="Team"
            rules={[{ required: true, message: "Please select a team" }]}
          >
            <Select placeholder="Select a team">
              {teams?.map((team) => (
                <Option key={team.id} value={team.id}>
                  {team.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handleDrawerClose}>Cancel</Button>
            </Space>
          </Form.Item>
          {error && (
            <Form.Item>
              <Alert
                className="mb-6"
                message={"There was an error to add project"}
                type="error"
                showIcon
                closable
              />
            </Form.Item>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default ProjectsOverviewPage;
