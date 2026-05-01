import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthContext";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(AuthContext);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "" });
  const [taskError, setTaskError] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const endpoint = user?.role === "admin" ? "/tasks" : "/tasks/my";
        const res = await API.get(endpoint);
        setTasks(res.data.data || res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getTasks();

    if (user?.role === "admin") {
      API.get("/projects").then(res => setProjects(res.data.data || res.data)).catch(console.log);
    }
  }, [user]);

  const selectedProject = projects.find(p => p._id === taskForm.projectId);
  const availableMembers = selectedProject ? selectedProject.members : [];

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError("");
    if (!taskForm.title || !taskForm.projectId || !taskForm.assignedTo) {
      return setTaskError("Please fill required fields (Title, Project, Assignee)");
    }
    
    try {
      await API.post("/tasks", taskForm);
      const endpoint = user?.role === "admin" ? "/tasks" : "/tasks/my";
      const freshTasks = await API.get(endpoint);
      setTasks(freshTasks.data.data || freshTasks.data);
      
      setShowTaskForm(false);
      setTaskForm({ title: "", description: "", projectId: "", assignedTo: "", dueDate: "" });
    } catch (err) {
      setTaskError(err.response?.data?.message || err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}`, { status });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, status } : task
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />

        <div className="bg-gray-50 min-h-screen p-6 text-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.role === "admin" ? "Project Tasks" : "My Tasks"}
            </h1>
            {user?.role === "admin" && (
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
              >
                {showTaskForm ? "Cancel" : "+ Create Task"}
              </button>
            )}
          </div>

          {showTaskForm && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 max-w-2xl">
              <h2 className="text-lg font-bold mb-4">New Task</h2>
              {taskError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{taskError}</p>}
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  type="text"
                  placeholder="Task Title"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                />
                <textarea
                  placeholder="Task Description"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <select 
                    className="p-2 border border-gray-300 rounded bg-white text-gray-700"
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value, assignedTo: "" })}
                  >
                    <option value="">Select Project...</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>

                  <select 
                    className="p-2 border border-gray-300 rounded bg-white text-gray-700 disabled:bg-gray-100 disabled:text-gray-400"
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    disabled={!taskForm.projectId}
                  >
                    <option value="">Assign To...</option>
                    {availableMembers?.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </div>

                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded text-gray-700"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                />
                
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors">
                  Submit Task
                </button>
              </form>
            </div>
          )}

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found</p>
          ) : (
            <div className="max-w-3xl">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onUpdate={updateStatus}
                  onDelete={deleteTask}
                  isAdmin={user?.role === "admin"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
