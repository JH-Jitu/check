import axios from "axios";

export const fetchProjects = async () => {
  const response = await axios.get("/api/mock-api?resource=projects");
  return response.data;
};
