import React, { useState, useEffect } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [project, setProject] = useState({
    name: "",
    description: "",
    status: "Planning",
    startDate: "",
    endDate: "",
    budget: "",
    manager: "",
    progress: 0,
  });

  // ✅ Load project data for editing
  useEffect(() => {
    if (isEdit) {
      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      const existingProject = projects.find((p) => p.id === parseInt(id));
      if (existingProject) {
        setProject(existingProject);
      }
    }
  }, [id, isEdit]);

  // ✅ Handle form submit (safe localStorage update)
  const handleSubmit = (e) => {
    e.preventDefault();

    const projects = JSON.parse(localStorage.getItem("projects")) || [];

    if (isEdit) {
      // 🔄 Update existing project safely
      const updatedProjects = projects.map((p) =>
        p.id === parseInt(id)
          ? { ...project, id: parseInt(id), budget: Number(project.budget) }
          : p
      );
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    } else {
      // ➕ Add new project safely (merge with existing ones)
      const newProject = {
        ...project,
        id: Date.now(),
        budget: Number(project.budget) || 0,
      };

      const updatedProjects = [...projects, newProject];
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    }

    // ✅ Redirect to projects page
    navigate("/projects");
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/projects"
          className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-blue-800">
          {isEdit ? "Edit Project" : "Create New Project"}
        </h1>
      </div>

      {/* Project Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                required
                value={project.name}
                onChange={(e) => setProject({ ...project, name: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project name"
              />
            </div>

            {/* Project Manager */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Manager *
              </label>
              <input
                type="text"
                required
                value={project.manager}
                onChange={(e) =>
                  setProject({ ...project, manager: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project manager"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
                rows="3"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter project description"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={project.startDate}
                onChange={(e) =>
                  setProject({ ...project, startDate: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={project.endDate}
                onChange={(e) =>
                  setProject({ ...project, endDate: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget ($)
              </label>
              <input
                type="number"
                value={project.budget}
                onChange={(e) =>
                  setProject({ ...project, budget: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter budget"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={project.status}
                onChange={(e) =>
                  setProject({ ...project, status: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Progress */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress ({project.progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) =>
                  setProject({ ...project, progress: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Save size={16} /> {isEdit ? "Update Project" : "Create Project"}
            </button>
            <Link
              to="/projects"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
