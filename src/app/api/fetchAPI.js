import axios from "axios";

export const fetchProjects = async () => {
  const response = await axios.get("/api/mock-api?resource=projects");
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
