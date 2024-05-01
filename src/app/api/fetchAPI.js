import axios from "axios";

export const fetchProjects = async () => {
  const response = await axios.get("/api/mock-api?resource=projects");
  return response.data;
};

export const addProject = async (projectData) => {
  const response = await axios.post(
    "/api/mock-api?resource=projects",
    projectData
  );
  return response.data;
};

export const updateProject = async (data) => {
  const response = await axios.put(
    `/api/mock-api?resource=projects&id=${data.id}`,
    data
  );
  return response.data;
};

export const deleteProject = async (id) => {
  await axios.delete(`/api/mock-api?resource=projects&id=${id}`);
};

export const fetchProjectDetails = async (id) => {
  const response = await axios.get(`/api/mock-api?resource=projects&id=${id}`);
  return response.data;
};

export const fetchTeams = async () => {
  const response = await axios.get("/api/mock-api?resource=teams");
  return response.data;
};

export const fetchTasks = async (projectId) => {
  const response = await axios.get(
    `/api/mock-api?resource=tasks&projectId=${projectId}`
  );
  return response.data;
};

export const addTask = async (taskData) => {
  const response = await axios.post("/api/mock-api?resource=tasks", taskData);
  return response.data;
};
