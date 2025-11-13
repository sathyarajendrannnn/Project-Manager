// pages/Finance/Quotations.jsx
import React, { useState, useEffect } from 'react';

const Quotations = () => {
  const [quotations, setQuotations] = useState(() => {
    const savedQuotations = localStorage.getItem('quotations');
    return savedQuotations ? JSON.parse(savedQuotations) : [];
  });

  const [newQuotation, setNewQuotation] = useState({
    quotationId: `QUO-${String(Date.now()).slice(-4)}`,
    customer: '',
    project: '',
    quotationDate: new Date().toISOString().split('T')[0],
    validTill: '',
    items: [{ service: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: '',
    status: 'draft'
  });

  const [showForm, setShowForm] = useState(false);

  const customers = ['ABC Company', 'XYZ Corp', 'Global Tech', 'StartUp Inc', 'Tech Solutions', 'Digital Agency'];
  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Other'];
  const services = ['Web Development', 'Mobile App Development', 'UI/UX Design', 'Consulting', 'Maintenance', 'Training'];

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('quotations', JSON.stringify(quotations));
  }, [quotations]);

  const calculateItemAmount = (quantity, rate) => {
    return parseFloat(quantity || 0) * parseFloat(rate || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuotation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newQuotation.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Recalculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = calculateItemAmount(
        field === 'quantity' ? value : updatedItems[index].quantity,
        field === 'rate' ? value : updatedItems[index].rate
      );
    }

    const subtotal = updatedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const taxAmount = (subtotal * (parseFloat(newQuotation.tax) || 0)) / 100;
    const discountAmount = (subtotal * (parseFloat(newQuotation.discount) || 0)) / 100;
    const total = subtotal + taxAmount - discountAmount;

    setNewQuotation(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total
    }));
  };

  const addItem = () => {
    setNewQuotation(prev => ({
      ...prev,
      items: [...prev.items, { service: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (newQuotation.items.length > 1) {
      const updatedItems = newQuotation.items.filter((_, i) => i !== index);
      setNewQuotation(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const handleAddQuotation = () => {
    if (newQuotation.customer && newQuotation.items.some(item => item.service && item.amount > 0)) {
      const quotation = {
        id: Date.now(),
        ...newQuotation,
        items: newQuotation.items.map(item => ({
          ...item,
          amount: parseFloat(item.amount) || 0
        })),
        subtotal: parseFloat(newQuotation.subtotal) || 0,
        tax: parseFloat(newQuotation.tax) || 0,
        discount: parseFloat(newQuotation.discount) || 0,
        total: parseFloat(newQuotation.total) || 0
      };

      setQuotations([...quotations, quotation]);
      setNewQuotation({
        quotationId: `QUO-${String(Date.now()).slice(-4)}`,
        customer: '',
        project: '',
        quotationDate: new Date().toISOString().split('T')[0],
        validTill: '',
        items: [{ service: '', quantity: 1, rate: 0, amount: 0 }],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        notes: '',
        status: 'draft'
      });
      setShowForm(false);
    } else {
      alert('Please fill in customer and at least one service with amount');
    }
  };

  const handleDeleteQuotation = (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      setQuotations(quotations.filter(quotation => quotation.id !== id));
    }
  };

  const handleStatusChange = (id, status) => {
    setQuotations(quotations.map(quote => 
      quote.id === id ? { ...quote, status } : quote
    ));
  };

  const totalPending = quotations
    .filter(quote => quote.status === 'sent' || quote.status === 'accepted')
    .reduce((sum, quote) => sum + (quote.total || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800 border border-green-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'rejected': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-400 to-blue-300 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Quotations</h1>
                <p className="text-blue-100 mt-1">Create and manage your quotations</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200">Pending Value</p>
                <p className="text-3xl font-bold text-white">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-6 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <button 
                className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors flex items-center gap-2"
                onClick={() => setShowForm(!showForm)}
              >
                <span>+</span>
                {showForm ? 'Cancel' : 'Create Quotation'}
              </button>
              <div className="text-gray-700">
                {quotations.length} quotations • ${totalPending.toFixed(2)} pending
              </div>
            </div>
          </div>

          {/* Add Quotation Form */}
          {showForm && (
            <div className="p-6 border-b border-blue-100 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Quotation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Quotation ID</label>
                  <input 
                    type="text"
                    name="quotationId"
                    value={newQuotation.quotationId}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Customer *</label>
                  <select 
                    name="customer"
                    value={newQuotation.customer}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer} value={customer}>{customer}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Project</label>
                  <select 
                    name="project"
                    value={newQuotation.project}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project} value={project}>{project}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Quotation Date *</label>
                  <input 
                    type="date" 
                    name="quotationDate"
                    value={newQuotation.quotationDate}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Valid Till *</label>
                  <input 
                    type="date" 
                    name="validTill"
                    value={newQuotation.validTill}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Tax %</label>
                  <input 
                    type="number" 
                    name="tax"
                    value={newQuotation.tax}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Discount %</label>
                  <input 
                    type="number" 
                    name="discount"
                    value={newQuotation.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="mb-2 font-medium text-gray-700">Status</label>
                  <select 
                    name="status"
                    value={newQuotation.status}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="mb-2 font-medium text-gray-700">Notes</label>
                  <textarea 
                    name="notes"
                    value={newQuotation.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about this quotation..."
                    rows="3"
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-800">Services / Products</h4>
                  <button 
                    type="button"
                    onClick={addItem}
                    className="bg-green-500 text-white rounded-lg px-3 py-1 hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    <span>+</span> Add Service
                  </button>
                </div>

                {newQuotation.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
                    <div className="col-span-5">
                      <label className="mb-1 text-sm font-medium text-gray-700">Service/Product</label>
                      <select
                        value={item.service}
                        onChange={(e) => handleItemChange(index, 'service', e.target.value)}
                        className="border border-blue-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Service</option>
                        {services.map(service => (
                          <option key={service} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 text-sm font-medium text-gray-700">Qty</label>
                      <input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        className="border border-blue-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 text-sm font-medium text-gray-700">Rate ($)</label>
                      <input 
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        step="0.01"
                        min="0"
                        className="border border-blue-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 text-sm font-medium text-gray-700">Amount ($)</label>
                      <input 
                        type="number"
                        value={item.amount}
                        readOnly
                        className="border border-blue-300 rounded-lg p-2 w-full bg-gray-100"
                      />
                    </div>
                    <div className="col-span-1">
                      {newQuotation.items.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white p-4 rounded-lg border border-blue-200 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-700">Subtotal:</label>
                    <div className="text-lg font-semibold">${newQuotation.subtotal.toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Tax:</label>
                    <div className="text-lg font-semibold">${((newQuotation.subtotal * newQuotation.tax) / 100).toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Discount:</label>
                    <div className="text-lg font-semibold text-red-600">-${((newQuotation.subtotal * newQuotation.discount) / 100).toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Total:</label>
                    <div className="text-xl font-bold text-green-600">${newQuotation.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={handleAddQuotation}
                >
                  <span>💾</span> Create Quotation
                </button>
              </div>
            </div>
          )}

          {/* Quotations List */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Quotation List</h3>
              <div className="text-gray-700">
                {quotations.filter(q => q.status === 'sent').length} sent quotations
              </div>
            </div>

            <div className="space-y-4">
              {quotations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-lg">No quotations created</p>
                  <p>Create your first quotation using the form above</p>
                </div>
              ) : (
                quotations.map(quotation => (
                  <div key={quotation.id} className="flex justify-between items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-white">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="min-w-[120px]">
                        <div className="font-semibold text-gray-800">{quotation.quotationId}</div>
                        <div className="text-gray-600 text-sm">{quotation.quotationDate}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{quotation.customer}</div>
                        <div className="text-gray-600 text-sm">
                          Valid till: {quotation.validTill}
                          {quotation.project && ` • ${quotation.project}`}
                        </div>
                        {quotation.notes && (
                          <div className="text-gray-500 text-sm mt-1">{quotation.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-800 text-lg">${quotation.total?.toFixed(2)}</div>
                        <div className={`text-xs px-3 py-1 rounded-full ${getStatusColor(quotation.status)}`}>
                          {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={quotation.status}
                          onChange={(e) => handleStatusChange(quotation.id, e.target.value)}
                          className="text-xs border border-blue-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-100"
                          onClick={() => handleDeleteQuotation(quotation.id)}
                        >
                          🗑️
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

export default Quotations;