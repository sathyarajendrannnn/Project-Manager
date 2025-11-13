import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Edit3, Save, Trash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Companies() {
  const location = useLocation();

  // Load saved companies from localStorage
  const [companies, setCompanies] = useState(() => {
    const saved = localStorage.getItem("companies");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "OpenAI Pvt Ltd",
            industry: "AI/ML",
            location: "San Francisco",
            employees: 250,
            status: "Confirmed",
          },
          {
            id: 2,
            name: "TCS Limited",
            industry: "IT Services",
            location: "Mumbai",
            employees: 5000,
            status: "Pending",
          },
          {
            id: 3,
            name: "Infosys",
            industry: "Consulting",
            location: "Bangalore",
            employees: 12000,
            status: "In Progress",
          },
        ];
  });

  // Notes state
  const [notes, setNotes] = useState(
    () => localStorage.getItem("notes") || "Meeting scheduled with TCS HR on Monday."
  );
  const [isEditing, setIsEditing] = useState(false);

  // New company form state
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    location: "",
    employees: "",
    status: "Pending",
  });

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState(companies);

  // Save companies in localStorage
  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
    setFilteredCompanies(companies);
  }, [companies]);

  // Save notes in localStorage
  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  // Add new company
  const handleAddCompany = () => {
    if (!newCompany.name.trim()) return;
    setCompanies([
      ...companies,
      { id: Date.now(), ...newCompany, employees: Number(newCompany.employees) || 0 },
    ]);
    setNewCompany({ name: "", industry: "", location: "", employees: "", status: "Pending" });
  };

  // Delete company
  const handleDeleteCompany = (id) => {
    setCompanies(companies.filter((c) => c.id !== id));
  };

  // Search
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredCompanies(
        companies.filter(
          (c) =>
            c.name.toLowerCase().includes(term) ||
            c.industry.toLowerCase().includes(term) ||
            c.location.toLowerCase().includes(term) ||
            c.status.toLowerCase().includes(term)
        )
      );
    }
  };

  // Status badge style
  const statusColors = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
  };

  return (
    <div className="p-6 space-y-8">
      {/* Navigation Bar */}
      <div className="flex gap-3 border-b border-gray-200 pb-3 mb-6">
        {[
          { path: "/companies", label: "Companies" },
          { path: "/leads", label: "Lead's Contacts" },
          { path: "/opportunities", label: "Opportunities" },
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
        <h1 className="text-3xl font-bold text-blue-800">Company Management</h1>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="outline-none text-sm w-48"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-1"
          >
            <Search size={16} /> Search
          </button>
        </div>
      </div>

      {/* Add Company Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle /> Add New Company
        </h2>
        <div className="grid grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Company Name"
            value={newCompany.name}
            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Industry"
            value={newCompany.industry}
            onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Location"
            value={newCompany.location}
            onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Employees"
            value={newCompany.employees}
            onChange={(e) => setNewCompany({ ...newCompany, employees: e.target.value })}
            className="p-2 border rounded-lg"
          />
          <select
            value={newCompany.status}
            onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value })}
            className="p-2 border rounded-lg"
          >
            <option>Pending</option>
            <option>Confirmed</option>
            <option>In Progress</option>
          </select>
        </div>
        <button
          onClick={handleAddCompany}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add Company
        </button>
      </div>

      {/* Companies Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Companies List</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2">Name</th>
              <th className="p-2">Industry</th>
              <th className="p-2">Location</th>
              <th className="p-2">Employees</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((c) => (
              <tr key={c.id} className="border-b hover:bg-blue-50">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.industry}</td>
                <td className="p-2">{c.location}</td>
                <td className="p-2">{c.employees}</td>
                <td className="p-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${statusColors[c.status]}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDeleteCompany(c.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Notes Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Notes</h2>
        {isEditing ? (
          <div>
            <textarea
              className="w-full border rounded-lg p-3 h-28"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              onClick={() => setIsEditing(false)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Save size={18} /> Save
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit3 size={18} /> Edit Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Companies;