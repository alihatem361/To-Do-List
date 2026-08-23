import axios from "axios";

const api = axios.create({
  baseURL: "https://your-backend-url.com/api",
  timeout: 10000,
});

export const getTasks = () => {
  return api.get("/tasks");
};

export const createTask = (task) => {
  return api.post("/tasks", task);
};

export const updateTask = (id, task) => {
  return api.put(`/tasks/${id}`, task);
};

export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};

export default api;