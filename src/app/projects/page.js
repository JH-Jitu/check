"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Spin, Tabs } from "antd";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { data: project, isLoading } = useQuery(["project", id], fetchProject);
  const setTasks = useStore((state) => state.setTasks);

  useEffect(() => {
    if (project && project.tasks) {
      setTasks(project.tasks);
    }
  }, [project, setTasks]);

  const fetchProject = async () => {
    // Fetch project details from your mock API or data source
    const response = await fetch(`/api/projects/${id}`);
    return response.json();
  };

  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskModal(false);
  };

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex justify-center">
          <Spin tip="Loading project details..." />
        </div>
      ) : (
        <>
          <ProjectDetails project={project} />
          <div className="mt-4">
            <Tabs defaultActiveKey="tasks">
              <Tabs.TabPane tab="Tasks" key="tasks">
                <div className="mb-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAddTask}
                  >
                    Add Task
                  </button>
                </div>
                <TaskList tasks={project.tasks} projectId={project.id} />
              </Tabs.TabPane>
            </Tabs>
          </div>
          {showTaskModal && (
            <TaskModal
              visible={showTaskModal}
              onCancel={handleCloseModal}
              projectId={project.id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
