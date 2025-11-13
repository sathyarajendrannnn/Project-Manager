import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Trash, Calendar, Users, Target, Edit3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const ProjectList = () => {
  const location = useLocation();
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Website Redesign",
            description: "Complete website redesign with modern UI/UX",
            status: "In Progress",
            startDate: "2024-01-15",
            endDate: "2024-03-30",
            budget: 50000,
            manager: "Sarah Johnson",
            progress: 65,
          },
          {
            id: 2,
            name: "Mobile App Development",
            description: "Cross-platform mobile application",
            status: "Planning",
            startDate: "2024-02-01",
            endDate: "2024-06-15",
            budget: 75000,
            manager: "Mike Chen",
            progress: 20,
          },
          {
            id: 3,
            name: "CRM System Upgrade",
            description: "Upgrade existing CRM to latest version",
            status: "Completed",
            startDate: "2023-11-01",
            endDate: "2024-01-31",
            budget: 30000,
            manager: "Emily Davis",
            progress: 100,
          },
        ];
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleDeleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const statusColors = {
    Planning: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Completed: "bg-green-100 text-green-700",
    OnHold: "bg-red-100 text-red-700",
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(search.toLowerCase()) ||
                         project.manager.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Navigation Bar */}
      <div className="flex gap-3 border-b border-gray-200 pb-3 mb-6">
        {[
          { path: "/projects", label: "Projects" },
          { path: "/tasks", label: "Tasks" },
          { path: "/milestones", label: "Milestones" },
        ].map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-5 py-2 text-sm font-medium rounded-t-md transition-all duration-200 ${
              location.pathname === tab.path
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Header with Search and Filter */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">Project Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
            <Search className="text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm w-48"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-lg text-sm"
          >
            <option value="All">All Status</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="OnHold">On Hold</option>
          </select>
          <Link
            to="/projects/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <PlusCircle size={16} /> New Project
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">Projects List</h2>
          <span className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-blue-800">{project.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={14} />
                  <span>{project.manager}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>{project.startDate} to {project.endDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target size={14} />
                  <span>Budget: ${project.budget.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  to={`/projects/edit/${project.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <Edit3 size={14} /> Edit
                </Link>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                >
                  <Trash size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No projects found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;