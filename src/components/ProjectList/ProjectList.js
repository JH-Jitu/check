"use client";

import { deleteProject, updateProject } from "@/app/api/fetchAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, Modal, Space, Typography } from "antd";
import React, { useState } from "react";

const { Title, Text } = Typography;

const ProjectList = ({ projects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

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
    // Handle view project logic here
    console.log("View project:", project);
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
      <Space size={20} direction="vertical" className="w-full">
        {projects.map((project) => (
          <Card
            key={project.id}
            title={
              <Title level={4} style={{ marginBottom: 0 }}>
                {project.name}
              </Title>
            }
            extra={
              <>
                {" "}
                <Text type="secondary" className="mr-5">
                  Team ID: {project.teamId}
                </Text>
                <Space size="middle" direction="horizontal">
                  <Button
                    type="primary"
                    onClick={() => handleViewProject(project)}
                  >
                    View
                  </Button>
                  <Button
                    type="default"
                    onClick={() => handleEditProject(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="default"
                    onClick={() => handleDeleteProject(project.id)}
                    danger
                  >
                    Delete
                  </Button>
                </Space>
              </>
            }
            className="w-full"
          >
            <div className="grid grid-cols-2">
              <Text>{project.description}</Text>
            </div>
          </Card>
        ))}
      </Space>

      <Modal
        title={selectedProject ? `Edit Project: ${selectedProject.name}` : ""}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
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
            label="Team ID"
            rules={[{ required: true, message: "Please enter a team ID" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectList;
