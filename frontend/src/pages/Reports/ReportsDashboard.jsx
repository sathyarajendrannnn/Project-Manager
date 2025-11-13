import React, { useState, useMemo } from 'react';

const ReportsDashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: 'last30',
    projectStatus: 'all',
    employeeDepartment: 'all'
  });

  const reportsData = useMemo(() => ({
    salesPipeline: {
      prospecting: 45,
      qualification: 32,
      proposal: 18,
      negotiation: 12,
      closed: 28
    },
    projectStatus: {
      onTrack: 15,
      delayed: 8,
      completed: 12,
      notStarted: 5
    },
    employeeUtilization: [
      { name: 'John Doe', department: 'Development', capacity: 160, logged: 142, utilization: 88.8 },
      { name: 'Jane Smith', department: 'Design', capacity: 160, logged: 128, utilization: 80.0 },
      { name: 'Mike Johnson', department: 'Development', capacity: 160, logged: 152, utilization: 95.0 },
      { name: 'Sarah Wilson', department: 'Marketing', capacity: 160, logged: 112, utilization: 70.0 },
      { name: 'Tom Brown', department: 'Development', capacity: 160, logged: 148, utilization: 92.5 }
    ],
    financialData: [
      { month: 'Jan', revenue: 45000, expenses: 32000 },
      { month: 'Feb', revenue: 52000, expenses: 35000 },
      { month: 'Mar', revenue: 48000, expenses: 38000 },
      { month: 'Apr', revenue: 61000, expenses: 42000 },
      { month: 'May', revenue: 58000, expenses: 39000 },
      { month: 'Jun', revenue: 67000, expenses: 45000 }
    ],
    invoiceAging: {
      current: 24500,
      '1-30': 18700,
      '31-60': 9200,
      '61-90': 4800,
      '90+': 2100
    }
  }), []);

  const metrics = useMemo(() => {
    const totalLeads = Object.values(reportsData.salesPipeline).reduce((a, b) => a + b, 0);
    const totalProjects = Object.values(reportsData.projectStatus).reduce((a, b) => a + b, 0);
    const totalRevenue = reportsData.financialData.reduce((sum, month) => sum + month.revenue, 0);
    const totalExpenses = reportsData.financialData.reduce((sum, month) => sum + month.expenses, 0);
    const totalOutstanding = Object.values(reportsData.invoiceAging).reduce((a, b) => a + b, 0);

    return {
      totalLeads,
      totalProjects,
      totalRevenue,
      totalExpenses,
      totalOutstanding,
      netProfit: totalRevenue - totalExpenses
    };
  }, [reportsData]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Business Intelligence</h1>
              <p className="text-gray-500 text-sm mt-1">Comprehensive performance analytics and insights</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="ytd">Year to Date</option>
              </select>
              <button className="text-sm bg-white border border-gray-300 rounded px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                <span>Export Report</span>
                <i className="fas fa-download text-gray-500"></i>
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">${metrics.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-dollar-sign text-blue-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
                <span className="text-xs text-gray-500 ml-2">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">${metrics.netProfit.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-green-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+8.2%</span>
                <span className="text-xs text-gray-500 ml-2">vs last period</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{metrics.totalProjects}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-tasks text-purple-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">+3</span>
                <span className="text-xs text-gray-500 ml-2">new this month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Outstanding</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">${metrics.totalOutstanding.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-orange-600"></i>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">-5.1%</span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Sales Pipeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Pipeline</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{metrics.totalLeads} leads</span>
            </div>
            <div className="space-y-4">
              {Object.entries(reportsData.salesPipeline).map(([stage, count], index) => {
                const colors = ['bg-blue-500', 'bg-blue-400', 'bg-yellow-500', 'bg-orange-500', 'bg-green-500'];
                const widths = ['w-32', 'w-24', 'w-20', 'w-16', 'w-28'];
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize w-24">{stage}</span>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${colors[index]} ${widths[index]}`}></div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Project Status</h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{metrics.totalProjects} total</span>
            </div>
            <div className="space-y-4">
              {[
                { status: 'On Track', count: reportsData.projectStatus.onTrack, color: 'bg-green-500' },
                { status: 'Delayed', count: reportsData.projectStatus.delayed, color: 'bg-red-500' },
                { status: 'Completed', count: reportsData.projectStatus.completed, color: 'bg-blue-500' },
                { status: 'Not Started', count: reportsData.projectStatus.notStarted, color: 'bg-gray-400' }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900 mr-2">{item.count}</span>
                    <span className="text-xs text-gray-500">projects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Utilization */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Team Utilization</h3>
              <span className="text-sm text-gray-500">This month</span>
            </div>
            <div className="space-y-4">
              {reportsData.employeeUtilization.map((employee) => (
                <div key={employee.name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-xs font-medium">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-xs text-gray-500">{employee.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      employee.utilization >= 90 ? 'text-green-600' : 
                      employee.utilization >= 75 ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {employee.utilization}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {employee.logged}h / {employee.capacity}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue vs Expenses */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
              <span className="text-sm text-gray-500">Last 6 months</span>
            </div>
            <div className="space-y-4">
              {reportsData.financialData.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>${month.revenue.toLocaleString()}</span>
                      <span>${month.expenses.toLocaleString()}</span>
                    </div>
                    <div className="flex h-2 rounded bg-gray-200 overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${(month.revenue / (month.revenue + month.expenses)) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${(month.expenses / (month.revenue + month.expenses)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${month.revenue > month.expenses ? 'text-green-600' : 'text-red-600'} w-20 text-right`}>
                    ${(month.revenue - month.expenses).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Aging */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Invoice Aging</h3>
              <span className="text-sm text-gray-500">Outstanding</span>
            </div>
            <div className="space-y-4">
              {[
                { period: 'Current', amount: reportsData.invoiceAging.current, color: 'bg-green-500' },
                { period: '1-30 Days', amount: reportsData.invoiceAging['1-30'], color: 'bg-blue-500' },
                { period: '31-60 Days', amount: reportsData.invoiceAging['31-60'], color: 'bg-yellow-500' },
                { period: '61-90 Days', amount: reportsData.invoiceAging['61-90'], color: 'bg-orange-500' },
                { period: '90+ Days', amount: reportsData.invoiceAging['90+'], color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.period} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.period}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;