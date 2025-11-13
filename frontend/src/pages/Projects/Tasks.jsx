import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Trash,
  Calendar,
  Flag,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Tasks = () => {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    project: "",
    assignee: "",
    dueDate: "",
    priority: "Medium",
    status: "Todo",
    description: "",
  });
  const [search, setSearch] = useState("");
  const [filterProject, setFilterProject] = useState("All");
  const [editingTask, setEditingTask] = useState(null);

  // ✅ Load tasks from localStorage (safe)
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const defaultTasks = [
        {
          id: 1,
          title: "Design Homepage Layout",
          project: "Website Redesign",
          assignee: "John Doe",
          dueDate: "2024-02-15",
          priority: "High",
          status: "In Progress",
          description: "Create wireframes and design mockups for homepage",
        },
        {
          id: 2,
          title: "Develop API Endpoints",
          project: "Mobile App Development",
          assignee: "Jane Smith",
          dueDate: "2024-03-01",
          priority: "Medium",
          status: "Todo",
          description: "Build REST API endpoints for user authentication",
        },
      ];
      setTasks(defaultTasks);
      localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    }
  }, []);

  // ✅ Update localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // ✅ Safely add a new task without overwriting existing ones
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    // Merge with existing localStorage tasks
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskToAdd = { ...newTask, id: Date.now() };
    const updatedTasks = [...existingTasks, taskToAdd];

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    setNewTask({
      title: "",
      project: "",
      assignee: "",
      dueDate: "",
      priority: "Medium",
      status: "Todo",
      description: "",
    });
  };

  // ✅ Delete a specific task safely
  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      const updated = tasks.filter((t) => t.id !== id);
      setTasks(updated);
      localStorage.setItem("tasks", JSON.stringify(updated));
    }
  };

  // ✅ Edit & Update logic
  const handleEditTask = (task) => {
    setEditingTask({ ...task });
  };

  const handleUpdateTask = () => {
    if (!editingTask.title.trim()) return;
    const updated = tasks.map((t) =>
      t.id === editingTask.id ? editingTask : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setEditingTask(null);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const statusColors = {
    Todo: "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const projects = [...new Set(tasks.map((task) => task.project))];
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase());
    const matchesProject =
      filterProject === "All" || task.project === filterProject;
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
        <h1 className="text-3xl font-bold text-blue-800">Task Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
            <Search className="text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
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

      {/* Add Task */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle size={20} /> Add New Task
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Project"
            value={newTask.project}
            onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Assignee"
            value={newTask.assignee}
            onChange={(e) =>
              setNewTask({ ...newTask, assignee: e.target.value })
            }
            className="p-2 border rounded-lg"
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="p-2 border rounded-lg"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={newTask.status}
            onChange={(e) =>
              setNewTask({ ...newTask, status: e.target.value })
            }
            className="p-2 border rounded-lg"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="p-2 border rounded-lg col-span-2"
          />
        </div>
        <button
          onClick={handleAddTask}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">Tasks List</h2>
          <span className="text-sm text-gray-600">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2">Title</th>
              <th className="p-2">Project</th>
              <th className="p-2">Assignee</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b hover:bg-blue-50">
                {editingTask?.id === task.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editingTask.project}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            project: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={editingTask.assignee}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            assignee: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="date"
                        value={editingTask.dueDate}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            dueDate: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={editingTask.priority}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            priority: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        value={editingTask.status}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            status: e.target.value,
                          })
                        }
                        className="w-full p-1 border rounded"
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateTask}
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
                    <td className="p-2 font-medium">{task.title}</td>
                    <td className="p-2">{task.project}</td>
                    <td className="p-2">{task.assignee}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {task.dueDate}
                      </div>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}
                      >
                        <Flag size={12} className="inline mr-1" />
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
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

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No tasks found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
