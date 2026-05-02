import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", description: "" });
  const [projectError, setProjectError] = useState("");
  
  const [memberInputs, setMemberInputs] = useState({});
  const [memberErrors, setMemberErrors] = useState({});

  const getProjects = async () => {
    try {
      const res = await API.get("/api/projects");
      setProjects(res.data.data || res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setProjectError("");
    if (!projectForm.name || !projectForm.description) return setProjectError("Please fill all fields");
    try {
      const res = await API.post("/api/projects", { ...projectForm, members: [] });
      setProjects([...projects, res.data.data || res.data]);
      setShowProjectForm(false);
      setProjectForm({ name: "", description: "" });
    } catch (err) {
      setProjectError(err.response?.data?.message || err.message);
    }
  };

  const handleAddMember = async (e, projectId) => {
    e.preventDefault();
    const userId = memberInputs[projectId];
    if (!userId) return;
    try {
      await API.post(`/api/projects/${projectId}/members`, { userId });
      setMemberInputs({ ...memberInputs, [projectId]: "" });
      setMemberErrors({ ...memberErrors, [projectId]: "" });
      await getProjects();
    } catch (err) {
      setMemberErrors({ ...memberErrors, [projectId]: err.response?.data?.message || err.message });
    }
  };

  const removeMember = async (projectId, memberId) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await API.delete(`/api/projects/${projectId}/remove-member/${memberId}`);
      setProjects((prev) => 
        prev.map(p => {
          if (p._id === projectId) {
            return { ...p, members: p.members.filter(m => m._id !== memberId) };
          }
          return p;
        })
      );
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
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            {user?.role === "admin" && (
              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
              >
                {showProjectForm ? "Cancel" : "+ Create Project"}
              </button>
            )}
          </div>

          {showProjectForm && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6 max-w-2xl">
              <h2 className="text-lg font-bold mb-4">New Project</h2>
              {projectError && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{projectError}</p>}
              <form onSubmit={handleCreateProject} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                />
                <textarea
                  placeholder="Project Description"
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors">
                  Submit Project
                </button>
              </form>
            </div>
          )}

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects found</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {project.name}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {project.description}
                  </p>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Members</h3>
                    </div>
                    
                    {user?.role === "admin" && (
                      <form onSubmit={(e) => handleAddMember(e, project._id)} className="mb-4 flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="User ID or Email" 
                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            value={memberInputs[project._id] || ""}
                            onChange={(e) => setMemberInputs({ ...memberInputs, [project._id]: e.target.value })}
                          />
                          <button type="submit" className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 text-sm rounded hover:bg-emerald-100 transition-colors">
                            Add Member
                          </button>
                        </div>
                        {memberErrors[project._id] && <span className="text-xs text-red-500">{memberErrors[project._id]}</span>}
                      </form>
                    )}

                    {project.members?.length === 0 ? (
                       <p className="text-sm text-gray-400">No members assigned.</p>
                    ) : (
                      <ul className="space-y-2">
                        {project.members?.map(member => (
                          <li key={member._id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">{member.name} <span className="text-gray-400 font-normal ml-1">({member.email})</span></span>
                            {user?.role === "admin" && (
                              <button 
                                onClick={() => removeMember(project._id, member._id)}
                                className="text-xs text-red-500 font-medium hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
