import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Trash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Attendance = () => {
  const location = useLocation();
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({ name: "", date: "", status: "Present" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("attendance")) || [];
    setAttendance(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  const addRecord = () => {
    if (!form.name || !form.date) return alert("Fill all fields");
    setAttendance([...attendance, { ...form, id: Date.now() }]);
    setForm({ name: "", date: "", status: "Present" });
  };

  const deleteRecord = (id) => {
    setAttendance(attendance.filter((a) => a.id !== id));
  };

  const filtered = attendance.filter((a) =>
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    "On Leave": "bg-yellow-100 text-yellow-700",
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
        <h1 className="text-3xl font-bold text-blue-800">Attendance Management</h1>
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

      {/* Add Attendance */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle size={20} /> Add Attendance
        </h2>
        <div className="grid grid-cols-4 gap-3">
          <input
            placeholder="Employee Name"
            className="p-2 border rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="date"
            className="p-2 border rounded-lg"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            className="p-2 border rounded-lg"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Present</option>
            <option>Absent</option>
            <option>On Leave</option>
          </select>
          <button
            onClick={addRecord}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} /> Add Record
          </button>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Attendance List</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2">Name</th>
              <th className="p-2">Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b hover:bg-blue-50">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.date}</td>
                <td className="p-2">
                  <span className={`px-3 py-1 text-sm rounded-full ${statusColors[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => deleteRecord(a.id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;