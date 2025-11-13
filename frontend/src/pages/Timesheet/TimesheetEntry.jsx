import React, { useState, useEffect } from 'react';

const TimesheetEntry = () => {
  const [activeTab, setActiveTab] = useState('week');
  const [entries, setEntries] = useState(() => {
    const savedEntries = localStorage.getItem('timesheetEntries');
    return savedEntries ? JSON.parse(savedEntries) : [
      { id: 1, date: '2023-10-23', project: 'Website Redesign', task: 'Frontend Development', hours: 7.5, status: 'submitted' },
      { id: 2, date: '2023-10-24', project: 'Website Redesign', task: 'API Integration', hours: 6, status: 'submitted' },
      { id: 3, date: '2023-10-25', project: 'Mobile App', task: 'UI Design', hours: 8, status: 'draft' },
      { id: 4, date: '2023-10-26', project: 'Mobile App', task: 'Testing', hours: 4.5, status: 'draft' },
    ];
  });

  const [newEntry, setNewEntry] = useState({
    date: '',
    project: '',
    task: '',
    hours: ''
  });

  const projects = ['Website Redesign', 'Mobile App', 'Internal Tools', 'Client Support'];
  const tasks = ['Frontend Development', 'Backend Development', 'UI Design', 'Testing', 'API Integration', 'Documentation'];

  // Save to Local Storage whenever entries update
  useEffect(() => {
    localStorage.setItem('timesheetEntries', JSON.stringify(entries));
  }, [entries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: value
    });
  };

  const handleAddEntry = () => {
    if (newEntry.date && newEntry.project && newEntry.task && newEntry.hours) {
      const entry = {
        id: Date.now(),
        date: newEntry.date,
        project: newEntry.project,
        task: newEntry.task,
        hours: parseFloat(newEntry.hours),
        status: 'draft'
      };

      setEntries([...entries, entry]);
      setNewEntry({
        date: '',
        project: '',
        task: '',
        hours: ''
      });
    }
  };

  const handleDeleteEntry = (id) => {
    const updated = entries.filter(entry => entry.id !== id);
    setEntries(updated);
  };

  const handleSubmitAll = () => {
    const updatedEntries = entries.map(entry => ({
      ...entry,
      status: 'submitted'
    }));
    setEntries(updatedEntries);
  };

  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden m-5">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Timesheet</h1>
          <p className="text-gray-500 mt-1">Track and submit your work hours</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <i className="fas fa-chevron-left text-gray-600"></i>
          </button>
          <span className="font-semibold text-gray-800">Oct 23 - Oct 29, 2023</span>
          <button className="bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <i className="fas fa-chevron-right text-gray-600"></i>
          </button>
          <button 
            className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
            onClick={handleSubmitAll}
          >
            Submit All
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-blue-50 border-b border-blue-200">
        <div 
          className={`px-6 py-4 cursor-pointer font-medium border-b-2 transition-colors ${
            activeTab === 'week' 
              ? 'text-blue-600 border-blue-500' 
              : 'text-gray-500 border-transparent'
          }`}
          onClick={() => setActiveTab('week')}
        >
          Week View
        </div>
        <div 
          className={`px-6 py-4 cursor-pointer font-medium border-b-2 transition-colors ${
            activeTab === 'day' 
              ? 'text-blue-600 border-blue-500' 
              : 'text-gray-500 border-transparent'
          }`}
          onClick={() => setActiveTab('day')}
        >
          Day View
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Add Entry Form */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Entry</h3>
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="mb-2 font-medium text-gray-700">Date</label>
              <input 
                type="date" 
                name="date"
                value={newEntry.date}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="mb-2 font-medium text-gray-700">Project</label>
              <select 
                name="project"
                value={newEntry.project}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="mb-2 font-medium text-gray-700">Task</label>
              <select 
                name="task"
                value={newEntry.task}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Task</option>
                {tasks.map(task => (
                  <option key={task} value={task}>{task}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col flex-1 min-w-[150px]">
              <label className="mb-2 font-medium text-gray-700">Hours</label>
              <input 
                type="number" 
                name="hours"
                step="0.5"
                min="0.5"
                max="12"
                value={newEntry.hours}
                onChange={handleInputChange}
                placeholder="0.0"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              className="bg-green-500 text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-green-600 transition-colors h-10"
              onClick={handleAddEntry}
            >
              <i className="fas fa-plus"></i> Add
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Time Entries</h3>
            <div className="text-gray-700">
              Total: <span className="font-semibold">{totalHours.toFixed(1)} hours</span>
            </div>
          </div>

          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <i className="far fa-clock text-4xl mb-3"></i>
                <p className="text-lg">No time entries yet</p>
                <p>Add your first entry using the form above</p>
              </div>
            ) : (
              entries.map(entry => (
                <div 
                  key={entry.id} 
                  className="flex justify-between items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-gray-600 font-medium min-w-[120px]">{entry.date}</div>
                    <div>
                      <div className="font-semibold text-gray-800">{entry.project}</div>
                      <div className="text-gray-600 text-sm">{entry.task}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">{entry.hours}h</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        entry.status === 'submitted' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {entry.status === 'submitted' ? 'Submitted' : 'Draft'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetEntry;