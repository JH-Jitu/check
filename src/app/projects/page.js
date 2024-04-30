"use client";

import { useEffect } from "react";
import { Button, Space, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/fetchAPI";
import useProjectStore from "@/store/projectStore/projectStore";
import useAuthStore from "@/store/authStore/authStore";
import ProjectList from "@/components/ProjectList/ProjectList";
// import ProjectList from '../../components/ProjectList';

const ProjectsOverviewPage = () => {
  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });

  const setProjects = useProjectStore((state) => state.setProjects);
  const user = useAuthStore((state) => state?.user);
  console.log({ user });

  useEffect(() => {
    if (projects) {
      setProjects(projects);
    }
  }, [projects, setProjects]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <Space>
          <Button type="primary">Add Project</Button>
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
    </div>
  );
};

export default ProjectsOverviewPage;
