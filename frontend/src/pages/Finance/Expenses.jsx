// pages/Finance/Expenses.jsx
import React, { useState, useEffect } from 'react';

const Expenses = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    paidBy: 'Company',
    project: '',
    notes: '',
    receipt: null
  });

  const [showForm, setShowForm] = useState(false);

  const categories = ['Travel', 'Software', 'Salary', 'Office Supplies', 'Equipment', 'Utilities', 'Marketing', 'Misc'];
  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Internal', 'Other'];

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'receipt') {
      setNewExpense({
        ...newExpense,
        receipt: files[0]
      });
    } else {
      setNewExpense({
        ...newExpense,
        [name]: value
      });
    }
  };

  const handleAddExpense = () => {
    if (newExpense.date && newExpense.category && newExpense.amount) {
      const expense = {
        id: Date.now(),
        date: newExpense.date,
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
        project: newExpense.project,
        notes: newExpense.notes,
        receipt: newExpense.receipt ? newExpense.receipt.name : null,
        status: 'pending'
      };

      setExpenses([...expenses, expense]);
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        category: '',
        amount: '',
        paidBy: 'Company',
        project: '',
        notes: '',
        receipt: null
      });
      setShowForm(false);
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, status } : expense
    ));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Travel': 'bg-blue-100 text-blue-800',
      'Software': 'bg-purple-100 text-purple-800',
      'Salary': 'bg-green-100 text-green-800',
      'Office Supplies': 'bg-orange-100 text-orange-800',
      'Equipment': 'bg-indigo-100 text-indigo-800',
      'Utilities': 'bg-teal-100 text-teal-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Misc': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-blue-300 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Expenses</h1>
                <p className="text-blue-100 mt-1">Track and manage your business expenses</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200">Total Expenses</p>
                <p className="text-3xl font-bold text-white">${totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-6 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button 
                  className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={() => setShowForm(!showForm)}
                >
                  <i className="fas fa-plus"></i>
                  {showForm ? 'Cancel' : 'Add Expense'}
                </button>
              </div>
              <div className="text-gray-700">
                {expenses.length} expenses • ${totalExpenses.toFixed(2)} total
              </div>
            </div>
          </div>

          {/* Add Expense Form */}
          {showForm && (
            <div className="p-6 border-b border-blue-100 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-plus-circle text-blue-500"></i>
                Add New Expense
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Date *</label>
                  <input 
                    type="date" 
                    name="date"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Category *</label>
                  <select 
                    name="category"
                    value={newExpense.category}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Amount *</label>
                  <input 
                    type="number" 
                    name="amount"
                    step="0.01"
                    min="0"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Paid By</label>
                  <select 
                    name="paidBy"
                    value={newExpense.paidBy}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Company">Company</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Project</label>
                  <select 
                    name="project"
                    value={newExpense.project}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Receipt</label>
                  <input 
                    type="file" 
                    name="receipt"
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="flex flex-col md:col-span-2 lg:col-span-3">
                  <label className="mb-2 font-medium text-gray-700">Notes</label>
                  <textarea 
                    name="notes"
                    value={newExpense.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about this expense..."
                    rows="3"
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={handleAddExpense}
                >
                  <i className="fas fa-save"></i> Save Expense
                </button>
              </div>
            </div>
          )}

          {/* Expenses List */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Expense Records</h3>
              <div className="text-gray-700">
                {expenses.filter(e => e.status === 'pending').length} pending approval
              </div>
            </div>

            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <i className="fas fa-receipt text-4xl mb-3"></i>
                  <p className="text-lg">No expenses recorded</p>
                  <p>Add your first expense using the form above</p>
                </div>
              ) : (
                expenses.map(expense => (
                  <div key={expense.id} className="flex justify-between items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-white">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-center min-w-[80px]">
                        <div className="text-gray-600 font-medium text-sm">{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                        <div className="text-gray-400 text-xs">{new Date(expense.date).getFullYear()}</div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(expense.category)}`}>
                            {expense.category}
                          </span>
                          {expense.project && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              {expense.project}
                            </span>
                          )}
                          {expense.paidBy && (
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              Paid by: {expense.paidBy}
                            </span>
                          )}
                        </div>
                        {expense.notes && (
                          <div className="text-gray-600 text-sm truncate">{expense.notes}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-800 text-lg">${expense.amount.toFixed(2)}</div>
                        <div className={`text-xs px-3 py-1 rounded-full ${getStatusColor(expense.status)}`}>
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {expense.receipt && (
                          <button className="text-green-500 hover:text-green-700 transition-colors p-2 rounded-lg hover:bg-green-100" title="View Receipt">
                            <i className="fas fa-receipt"></i>
                          </button>
                        )}
                        <select
                          value={expense.status}
                          onChange={(e) => handleStatusChange(expense.id, e.target.value)}
                          className="text-xs border border-blue-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-100"
                          onClick={() => handleDeleteExpense(expense.id)}
                          title="Delete Expense"
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
    </div>
  );
};

export default Expenses;