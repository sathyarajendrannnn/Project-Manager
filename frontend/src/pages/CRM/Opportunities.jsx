import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Edit3, Save, Trash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Opportunities() {
  const location = useLocation();

  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem("opportunities");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, title: "AI Chatbot Development", company: "OpenAI", value: 50000, stage: "Negotiation" },
          { id: 2, title: "ERP System Upgrade", company: "TCS", value: 75000, stage: "Closed Won" },
        ];
  });

  const [notes, setNotes] = useState(() => localStorage.getItem("opportunitiesNotes") || "Discuss pricing with OpenAI team.");
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    company: "",
    value: "",
    stage: "Negotiation",
  });

  useEffect(() => {
    localStorage.setItem("opportunities", JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem("opportunitiesNotes", notes);
  }, [notes]);

  const handleAddOpportunity = () => {
    if (!newOpportunity.title.trim()) return;
    setOpportunities([
      ...opportunities,
      { id: Date.now(), ...newOpportunity, value: Number(newOpportunity.value) || 0 },
    ]);
    setNewOpportunity({ title: "", company: "", value: "", stage: "Negotiation" });
  };

  const handleDeleteOpportunity = (id) => {
    setOpportunities(opportunities.filter((o) => o.id !== id));
  };

  const stageColors = {
    Negotiation: "bg-yellow-100 text-yellow-700",
    "Closed Won": "bg-green-100 text-green-700",
    "Closed Lost": "bg-red-100 text-red-700",
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
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-800">Opportunities</h1>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm w-48"
          />
        </div>
      </div>

      {/* Add Opportunity */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle /> Add New Opportunity
        </h2>
        <div className="grid grid-cols-4 gap-3">
          <input type="text" placeholder="Title" value={newOpportunity.title} onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })} className="p-2 border rounded-lg" />
          <input type="text" placeholder="Company" value={newOpportunity.company} onChange={(e) => setNewOpportunity({ ...newOpportunity, company: e.target.value })} className="p-2 border rounded-lg" />
          <input type="number" placeholder="Value ($)" value={newOpportunity.value} onChange={(e) => setNewOpportunity({ ...newOpportunity, value: e.target.value })} className="p-2 border rounded-lg" />
          <select value={newOpportunity.stage} onChange={(e) => setNewOpportunity({ ...newOpportunity, stage: e.target.value })} className="p-2 border rounded-lg">
            <option>Negotiation</option>
            <option>Closed Won</option>
            <option>Closed Lost</option>
          </select>
        </div>
        <button onClick={handleAddOpportunity} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Opportunity</button>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Opportunities List</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2">Title</th>
              <th className="p-2">Company</th>
              <th className="p-2">Value ($)</th>
              <th className="p-2">Stage</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities
              .filter((o) => o.title.toLowerCase().includes(search.toLowerCase()))
              .map((o) => (
                <tr key={o.id} className="border-b hover:bg-blue-50">
                  <td className="p-2">{o.title}</td>
                  <td className="p-2">{o.company}</td>
                  <td className="p-2">${o.value}</td>
                  <td className="p-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${stageColors[o.stage]}`}>{o.stage}</span>
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleDeleteOpportunity(o.id)} className="text-red-500 hover:text-red-700"><Trash size={18} /></button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Notes</h2>
        {isEditing ? (
          <div>
            <textarea className="w-full border rounded-lg p-3 h-28" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button onClick={() => setIsEditing(false)} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
              <Save size={18} /> Save
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
            <button onClick={() => setIsEditing(true)} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Edit3 size={18} /> Edit Notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Opportunities;