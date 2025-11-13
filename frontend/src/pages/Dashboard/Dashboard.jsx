import React from "react";

const Dashboard = () => {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-10">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-6 mb-10">
        <h1 className="text-4xl font-bold text-blue-700">Welcome to Dashboard</h1>
        <p className="text-gray-600 mt-2">
          You are now logged in. Explore your CRM, Projects, Employees, Timesheets, and Finance modules from here.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CRM */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">CRM</h2>
          <p className="text-gray-600 mb-4">Manage Companies, Contacts, Leads, and Opportunities.</p>
          <a
            href="/companies"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Go to CRM →
          </a>
        </div>

        {/* Projects */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Projects</h2>
          <p className="text-gray-600 mb-4">Track Projects, Tasks, and Milestones efficiently.</p>
          <a
            href="/projects"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Go to Projects →
          </a>
        </div>

        {/* Employees */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Employees</h2>
          <p className="text-gray-600 mb-4">View Employees, Manage Attendance, and Leave Requests.</p>
          <a
            href="/employees"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Go to Employees →
          </a>
        </div>

        {/* Timesheet */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Timesheet</h2>
          <p className="text-gray-600 mb-4">Fill and track timesheet entries easily.</p>
          <a
            href="/timesheet"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Go to Timesheet →
          </a>
        </div>

        {/* Finance */}
        <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Finance</h2>
          <p className="text-gray-600 mb-4">Handle Quotations, Invoices, and Expenses in one place.</p>
          <a
            href="/invoices"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Go to Finance →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;