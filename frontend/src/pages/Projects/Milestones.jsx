import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Trash,
  Calendar,
  Target,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Milestones = () => {
  const location = useLocation();
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    project: "",
    dueDate: "",
    status: "Upcoming",
    description: "",
  });
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("All");
  const [editingMilestone, setEditingMilestone] = useState(null);

  // ✅ Utility function for safe localStorage updates
  const updateLocalStorage = (key, newData) => {
    const existingData = JSON.parse(localStorage.getItem(key)) || [];
    const mergedData = Array.isArray(existingData)
      ? [...existingData, ...newData]
      : { ...existingData, ...newData };
    localStorage.setItem(key, JSON.stringify(mergedData));
  };

  // ✅ Load milestones safely from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("milestones");
    if (saved) {
      setMilestones(JSON.parse(saved));
    } else {
      const defaultMilestones = [
        {
          id: 1,
          name: "Design Phase Completion",
          project: "Website Redesign",
          dueDate: "2024-02-28",
          status: "Completed",
          description: "Complete all design mockups and get client approval",
        },
        {
          id: 2,
          name: "Development Sprint 1",
          project: "Mobile App Development",
          dueDate: "2024-03-15",
          status: "Upcoming",
          description: "Complete user authentication and basic UI components",
        },
      ];
      setMilestones(defaultMilestones);
      localStorage.setItem("milestones", JSON.stringify(defaultMilestones));
    }
  }, []);

  // ✅ Save milestones to localStorage only when they change
  useEffect(() => {
    localStorage.setItem("milestones", JSON.stringify(milestones));
  }, [milestones]);

  // ✅ Add milestone without removing other localStorage data
  const handleAddMilestone = () => {
    if (!newMilestone.name.trim()) return;
    const milestoneToAdd = { ...newMilestone, id: Date.now() };
    const updatedMilestones = [...milestones, milestoneToAdd];
    setMilestones(updatedMilestones);
    updateLocalStorage("milestones", [milestoneToAdd]); // merge safely
    setNewMilestone({
      name: "",
      project: "",
      dueDate: "",
      status: "Upcoming",
      description: "",
    });
  };

  const handleDeleteMilestone = (id) => {
    if (window.confirm("Are you sure you want to delete this milestone?")) {
      const updated = milestones.filter((m) => m.id !== id);
      setMilestones(updated);
      localStorage.setItem("milestones", JSON.stringify(updated));
    }
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone({ ...milestone });
  };

  const handleUpdateMilestone = () => {
    if (!editingMilestone.name.trim()) return;
    const updatedMilestones = milestones.map((m) =>
      m.id === editingMilestone.id ? editingMilestone : m
    );
    setMilestones(updatedMilestones);
    localStorage.setItem("milestones", JSON.stringify(updatedMilestones));
    setEditingMilestone(null);
  };

  const handleCancelEdit = () => {
    setEditingMilestone(null);
  };

  const statusColors = {
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Upcoming: "bg-blue-100 text-blue-700",
    Delayed: "bg-red-100 text-red-700",
  };

  const projects = [...new Set(milestones.map((m) => m.project))];

  const filteredMilestones = milestones.filter((milestone) => {
    const matchesSearch =
      milestone.name.toLowerCase().includes(search.toLowerCase()) ||
      milestone.project.toLowerCase().includes(search.toLowerCase());
    const matchesProject =
      filterProject === "All" || milestone.project === filterProject;
    return matchesSearch && matchesProject;
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
        <h1 className="text-3xl font-bold text-blue-800">Milestone Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
            <Search className="text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search milestones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm w-48"
            />
          </div>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="p-2 border rounded-lg text-sm"
          >
            <option value="All">All Projects</option>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Milestone */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle size={20} /> Add New Milestone
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Milestone Name"
            value={newMilestone.name}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, name: e.target.value })
            }
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Project"
            value={newMilestone.project}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, project: e.target.value })
            }
            className="p-2 border rounded-lg"
          />
          <input
            type="date"
            value={newMilestone.dueDate}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, dueDate: e.target.value })
            }
            className="p-2 border rounded-lg"
          />
          <select
            value={newMilestone.status}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, status: e.target.value })
            }
            className="p-2 border rounded-lg"
          >
            <option value="Upcoming">Upcoming</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
          </select>
          <input
            type="text"
            placeholder="Description"
            value={newMilestone.description}
            onChange={(e) =>
              setNewMilestone({ ...newMilestone, description: e.target.value })
            }
            className="p-2 border rounded-lg col-span-2"
          />
        </div>
        <button
          onClick={handleAddMilestone}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Milestone
        </button>
      </div>

      {/* Milestones List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">Milestones List</h2>
          <span className="text-sm text-gray-600">
            Showing {filteredMilestones.length} of {milestones.length} milestones
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2">Name</th>
              <th className="p-2">Project</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Description</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMilestones.map((milestone) => (
              <tr key={milestone.id} className="border-b hover:bg-blue-50">
                {editingMilestone?.id === milestone.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editingMilestone.name}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editingMilestone.project}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            project: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        value={editingMilestone.dueDate}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            dueDate: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={editingMilestone.status}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            status: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editingMilestone.description}
                        onChange={(e) =>
                          setEditingMilestone({
                            ...editingMilestone,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateMilestone}
                          className="text-green-600 hover:text-green-700 flex items-center gap-1"
                        >
                          <Save size={14} /> Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-700 flex items-center gap-1"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 font-medium">{milestone.name}</td>
                    <td className="p-2">{milestone.project}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {milestone.dueDate}
                      </div>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${statusColors[milestone.status]}`}
                      >
                        <Target size={12} className="inline mr-1" />
                        {milestone.status}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-gray-600">
                      {milestone.description}
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditMilestone(milestone)}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMilestones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No milestones found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Milestones;
