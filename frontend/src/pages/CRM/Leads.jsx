import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Edit3, Save, Trash } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Leads() {
  const location = useLocation();

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem("contacts");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Ravi Kumar", email: "ravi@tcs.com", phone: "9876543210", company: "TCS", status: "Active" },
          { id: 2, name: "Ananya Sharma", email: "ananya@infosys.com", phone: "9876543222", company: "Infosys", status: "Inactive" },
        ];
  });

  const [notes, setNotes] = useState(() => localStorage.getItem("contactsNotes") || "Follow up with Ravi tomorrow.");
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
  });

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("contactsNotes", notes);
  }, [notes]);

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;
    setContacts([...contacts, { id: Date.now(), ...newContact }]);
    setNewContact({ name: "", email: "", phone: "", company: "", status: "Active" });
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const statusColors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
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
        <h1 className="text-3xl font-bold text-blue-800">Contacts</h1>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none text-sm w-48"
          />
        </div>
      </div>

      {/* Add Contact */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 flex items-center gap-2">
          <PlusCircle /> Add New Contact
        </h2>
        <div className="grid grid-cols-5 gap-3">
          <input type="text" placeholder="Name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} className="p-2 border rounded-lg" />
          <input type="email" placeholder="Email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} className="p-2 border rounded-lg" />
          <input type="text" placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className="p-2 border rounded-lg" />
          <input type="text" placeholder="Company" value={newContact.company} onChange={(e) => setNewContact({ ...newContact, company: e.target.value })} className="p-2 border rounded-lg" />
          <select value={newContact.status} onChange={(e) => setNewContact({ ...newContact, status: e.target.value })} className="p-2 border rounded-lg">
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button onClick={handleAddContact} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Contact</button>
      </div>

      {/* Contacts Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Contacts List</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-800">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Company</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts
              .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
              .map((c) => (
                <tr key={c.id} className="border-b hover:bg-blue-50">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.phone}</td>
                  <td className="p-2">{c.company}</td>
                  <td className="p-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${statusColors[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleDeleteContact(c.id)} className="text-red-500 hover:text-red-700"><Trash size={18} /></button>
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

export default Leads;