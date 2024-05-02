"use client";

import { deleteProject, updateProject } from "@/app/api/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import confirm from "antd/es/modal/confirm";

const { Title, Text } = Typography;

const ProjectList = ({ projects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: updateProjectMutation } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      setIsModalOpen(false);
    },
  });

  const { mutate: deleteProjectMutation } = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  const handleViewProject = (project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    form.setFieldsValue(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (id) => {
    deleteProjectMutation(id);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      updateProjectMutation({ ...values, id: selectedProject.id });
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    form.resetFields();
  };

  return (
    <div className="">
      <div className="space-y-4 w-full">
        {projects.map((project) => (
          <Card
            key={project.id}
            title={
              <Title
                level={4}
                style={{ marginBottom: 0 }}
                className="text-lg font-semibold"
              >
                {project.name}
              </Title>
            }
            extra={
              <div className="py-2">
                <Text type="secondary" className="mr-5">
                  Team ID: {project.teamId}
                </Text>
                <div className="text-sm space-x-2 sm:space-x-4">
                  <Tooltip title="Click to show Project details page">
                    <Button
                      type="primary"
                      onClick={() => handleViewProject(project)}
                      styles={{ button: "#153448" }}
                    >
                      View
                    </Button>
                  </Tooltip>

                  <Tooltip title="Click to Edit Project">
                    <Button
                      type="default"
                      onClick={() => handleEditProject(project)}
                    >
                      Edit
                    </Button>
                  </Tooltip>

                  <Tooltip title="Click to Delete Project">
                    <Button
                      type="default"
                      onClick={() => {
                        confirm({
                          icon: <ExclamationCircleOutlined />,
                          content: (
                            <Descriptions.Item>
                              Are you sure you want to delete?
                            </Descriptions.Item>
                          ),
                          onOk() {
                            handleDeleteProject(project.id);
                          },
                          onCancel() {
                            console.log("Cancel");
                          },
                        });
                      }}
                      danger
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </div>
              </div>
            }
            className="w-full shadow-md rounded-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
              <Text>{project.description}</Text>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        title={selectedProject ? `Edit Project: ${selectedProject.name}` : ""}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={null}
        className="rounded-lg shadow-lg"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: "Please enter a project name" }]}
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
            <Input.TextArea className="rounded-md shadow-sm" rows={4} />
          </Form.Item>
          <Form.Item
            name="teamId"
            label="Team ID"
            rules={[{ required: true, message: "Please enter a team ID" }]}
            className="mb-4"
          >
            <Input type="number" className="rounded-md shadow-sm" />
          </Form.Item>
          <div className="flex justify-end">
            <Button onClick={handleModalCancel} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" onClick={handleModalOk}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList;
