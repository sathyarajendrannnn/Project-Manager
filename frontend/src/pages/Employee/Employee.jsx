import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Trash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Employee = () => {
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = () => {
    if (!form.name || !form.email) return alert("Please fill all fields");
    setEmployees([...employees, { ...form, id: Date.now() }]);
    setForm({ name: "", email: "", role: "", department: "", status: "Active" });
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const filtered = employees.filter((e) =>
    e.name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">

      {/* Navigation Bar */}
      <div className="flex gap-3 border-b border-gray-200 pb-3 mb-6">
        {[
          { path: "/employees", label: "Employees" },
          { path: "/attendance", label: "Attendance" },
          { path: "/leaves", label: "Leave Requests" },
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

      {/* Header with Search */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">Employee Management</h1>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
          <Search className="text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm w-48"
          />
        </div>
      </div>

      {/* Add Employee */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle size={20} /> Add New Employee
        </h2>
        <div className="grid grid-cols-5 gap-3">
          <input
            placeholder="Name"
            className="p-2 border rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="p-2 border rounded-lg"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Role"
            className="p-2 border rounded-lg"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            placeholder="Department"
            className="p-2 border rounded-lg"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <select
            className="p-2 border rounded-lg"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button
          onClick={addEmployee}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 w-fit"
        >
          <PlusCircle size={16} /> Add Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Employee List</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Department</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b hover:bg-blue-50">
                <td className="p-2">{e.name}</td>
                <td className="p-2">{e.email}</td>
                <td className="p-2">{e.role}</td>
                <td className="p-2">{e.department}</td>
                <td className="p-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${statusColors[e.status]}`}>
                    {e.status}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteEmployee(e.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;