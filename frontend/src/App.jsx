import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Dashboard from "./pages/Dashboard/Dashboard";

// CRM
import Companies from "./pages/CRM/Companies";
import Leads from "./pages/CRM/Leads";
import Opportunities from "./pages/CRM/Opportunities";

// Projects
import ProjectList from "./pages/Projects/ProjectList";
import ProjectForm from "./pages/Projects/ProjectForm";
import Tasks from "./pages/Projects/Tasks";
import Milestones from "./pages/Projects/Milestones";

// Employee
import Employee from "./pages/Employee/Employee";
import LeaveRequests from "./pages/Employee/LeaveRequests";
import Attendance from "./pages/Employee/Attendance";

// Timesheet
import TimesheetEntry from "./pages/Timesheet/TimesheetEntry";

// Finance
import Quotations from "./pages/Finance/Quotations";
import Invoices from "./pages/Finance/Invoices";
import Expenses from "./pages/Finance/Expenses";

// Reports
import ReportsDashboard from "./pages/Reports/ReportsDashboard";

// Auth
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

// Components
import Sidebar from "./component/Sidebar";

function App() {
  const location = useLocation();

  // Hide sidebar on login & signup
  const hideSidebar =
    location.pathname === "/" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Sidebar */}
      {!hideSidebar && <Sidebar />}

      {/* Main Content */}
      <div className={`flex-1 ${!hideSidebar ? "ml-64" : ""} overflow-y-auto`}>
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* CRM */}
          <Route path="/crm" element={<Navigate to="/companies" replace />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/opportunities" element={<Opportunities />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/edit/:id" element={<ProjectForm />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/milestones" element={<Milestones />} />

          {/* Employee */}
          <Route path="/employees" element={<Employee />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<LeaveRequests />} />

          {/* Timesheet */}
          <Route path="/timesheet" element={<TimesheetEntry />} />

          {/* Finance */}
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/invoices" element={<Invoices/>} />
          <Route path="/expenses" element={<Expenses/>} />

          {/* Reports */}
          <Route path="/reports" element={<ReportsDashboard />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
