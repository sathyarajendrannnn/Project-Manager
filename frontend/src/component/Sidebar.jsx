// component/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaProjectDiagram,
  FaUserTie,
  FaClock,
  FaMoneyBill,
  FaChartPie,
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaBuilding,
  FaUserPlus,
  FaBriefcase,
  FaTasks,
  FaFlagCheckered,
  FaFileInvoice,
  FaReceipt,
} from "react-icons/fa";

const Sidebar = () => {
  const role = localStorage.getItem("role") || "employee";
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownStates, setDropdownStates] = useState({
    crm: false,
    projects: false,
    employees: false,
    finance: false,
  });

  // Auto-expand dropdown based on current route
  useEffect(() => {
    const path = location.pathname;
    setDropdownStates({
      crm: path.startsWith("/companies") || path.startsWith("/leads") || path.startsWith("/opportunities"),
      projects: path.startsWith("/projects") || path.startsWith("/tasks") || path.startsWith("/milestones"),
      employees: path.startsWith("/employees") || path.startsWith("/attendance") || path.startsWith("/leaves"),
      finance: path.startsWith("/quotations") || path.startsWith("/invoices") || path.startsWith("/expenses"),
    });
  }, [location.pathname]);

  // Role-based access control
  const modulesByRole = {
    admin: ["Dashboard", "CRM", "Projects", "Employees", "Finance", "Timesheet", "Reports"],
    manager: ["Dashboard", "CRM", "Projects", "Employees", "Finance", "Timesheet", "Reports"],
    employee: ["Dashboard", "Projects", "Timesheet"],
    hr: ["Dashboard", "Employees", "Timesheet", "Reports"],
  };

  // Define all modules
  const allModules = {
    Dashboard: { 
      title: "Dashboard", 
      path: "/dashboard", 
      icon: <FaHome className="w-5 h-5" />
    },

    CRM: {
      title: "CRM",
      icon: <FaUsers className="w-5 h-5" />,
      children: [
        { title: "Companies", path: "/companies", icon: <FaBuilding className="w-4 h-4" /> },
        { title: "Leads", path: "/leads", icon: <FaUserPlus className="w-4 h-4" /> },
        { title: "Opportunities", path: "/opportunities", icon: <FaBriefcase className="w-4 h-4" /> },
      ],
    },

    Projects: {
      title: "Projects",
      icon: <FaProjectDiagram className="w-5 h-5" />,
      children: [
        { title: "All Projects", path: "/projects", icon: <FaProjectDiagram className="w-4 h-4" /> },
        { title: "Tasks", path: "/tasks", icon: <FaTasks className="w-4 h-4" /> },
        { title: "Milestones", path: "/milestones", icon: <FaFlagCheckered className="w-4 h-4" /> },
      ],
    },

    Employees: {
      title: "Employees",
      icon: <FaUserTie className="w-5 h-5" />,
      children: [
        { title: "Employee List", path: "/employees", icon: <FaUserTie className="w-4 h-4" /> },
        { title: "Attendance", path: "/attendance", icon: <FaClipboardList className="w-4 h-4" /> },
        { title: "Leave Requests", path: "/leaves", icon: <FaClock className="w-4 h-4" /> },
      ],
    },

    Finance: {
      title: "Finance",
      icon: <FaMoneyBill className="w-5 h-5" />,
      children: [
        { title: "Quotations", path: "/quotations", icon: <FaFileInvoice className="w-4 h-4" /> },
        { title: "Invoices", path: "/invoices", icon: <FaReceipt className="w-4 h-4" /> },
        { title: "Expenses", path: "/expenses", icon: <FaMoneyBill className="w-4 h-4" /> },
      ],
    },

    Timesheet: { 
      title: "Timesheet", 
      path: "/timesheet", 
      icon: <FaClock className="w-5 h-5" />
    },
    
    Reports: { 
      title: "Reports", 
      path: "/reports", 
      icon: <FaChartPie className="w-5 h-5" />
    },
  };

  const allowedModules = modulesByRole[role] || [];

  const toggleDropdown = (dropdown) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  // Check if path is active
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  // Render dropdown menu
  const renderDropdown = (moduleKey, module) => {
    const isOpen = dropdownStates[moduleKey];
    const isActiveParent = module.children.some(child => isActivePath(child.path));

    return (
      <div key={moduleKey} className="mb-2">
        <button
          onClick={() => toggleDropdown(moduleKey)}
          className={`flex w-full items-center justify-between px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
            isActiveParent
              ? "bg-blue-500 text-white shadow-md"
              : "hover:bg-blue-100 hover:text-blue-800 text-gray-700"
          }`}
        >
          <span className="flex items-center gap-3">
            {module.icon}
            <span>{module.title}</span>
          </span>
          {isOpen ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
        </button>

        {isOpen && (
          <div className="ml-4 mt-2 space-y-1 border-l-2 border-blue-200 pl-4">
            {module.children.map((child) => {
              const isActiveChild = isActivePath(child.path);
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActiveChild
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {child.icon}
                  <span>{child.title}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 min-h-screen bg-white text-gray-800 shadow-xl p-6 fixed flex flex-col border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="text-2xl font-bold text-blue-800 mb-8 text-center">
        Luisant<span className="text-blue-600">Manager</span>
      </div>

      {/* Role Display */}
      <div className="mb-6 text-center">
        <span className="text-sm font-semibold px-3 py-1 bg-blue-100 rounded-full text-blue-800">
          {role.toUpperCase()}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {allowedModules.map((moduleName) => {
          const module = allModules[moduleName];
          if (!module) return null;

          // Handle dropdown modules
          if (module.children) {
            switch(moduleName) {
              case "CRM":
                return renderDropdown("crm", module);
              case "Projects":
                return renderDropdown("projects", module);
              case "Employees":
                return renderDropdown("employees", module);
              case "Finance":
                return renderDropdown("finance", module);
              default:
                return null;
            }
          }

          // Handle single link modules
          const isActive = isActivePath(module.path);
          return (
            <Link
              key={module.path}
              to={module.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "hover:bg-blue-100 hover:text-blue-800 text-gray-700"
              }`}
            >
              {module.icon}
              <span>{module.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-200 shadow-md mt-8 w-full"
      >
        <FaSignOutAlt className="text-lg" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;