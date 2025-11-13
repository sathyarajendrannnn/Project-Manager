// navConfig.js

import { Building2, Users, Briefcase } from "lucide-react";

export const NAV_ITEMS = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "📊",
  },
  {
    title: "CRM",
    path: "/crm", // Clicking CRM redirects to Companies by default
    icon: <Building2 size={18} />,
    children: [
      {
        title: "Companies",
        path: "/crm/companies",
        icon: <Building2 size={16} />,
      },
      {
        title: "Leads",
        path: "/crm/leads",
        icon: <Users size={16} />,
      },
      {
        title: "Opportunities",
        path: "/crm/opportunities",
        icon: <Briefcase size={16} />,
      },
    ],
  },
  {
    title: "Reports",
    path: "/reports",
    icon: "📑",
  },
];
