// pages/Finance/Invoices.jsx
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Invoices = () => {
  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = localStorage.getItem('invoices');
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });

  const [newInvoice, setNewInvoice] = useState({
    invoiceId: `INV-${String(Date.now()).slice(-4)}`,
    customer: '',
    project: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ service: '', quantity: 1, rate: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    terms: '',
    status: 'draft'
  });

  const [showForm, setShowForm] = useState(false);

  const customers = ['ABC Company', 'XYZ Corp', 'Global Tech', 'StartUp Inc', 'Tech Solutions', 'Digital Agency'];
  const projects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Other'];
  const services = ['Web Development', 'Mobile App Development', 'UI/UX Design', 'Consulting', 'Maintenance', 'Training'];

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const calculateItemAmount = (quantity, rate) => {
    return parseFloat(quantity || 0) * parseFloat(rate || 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
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
    const taxAmount = (subtotal * (parseFloat(newInvoice.tax) || 0)) / 100;
    const discountAmount = (subtotal * (parseFloat(newInvoice.discount) || 0)) / 100;
    const total = subtotal + taxAmount - discountAmount;

    setNewInvoice(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      total
    }));
  };

  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { service: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (newInvoice.items.length > 1) {
      const updatedItems = newInvoice.items.filter((_, i) => i !== index);
      setNewInvoice(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const handleAddInvoice = () => {
    if (newInvoice.customer && newInvoice.items.some(item => item.service && item.amount > 0)) {
      const invoice = {
        id: Date.now(),
        ...newInvoice,
        items: newInvoice.items.map(item => ({
          ...item,
          amount: parseFloat(item.amount) || 0
        })),
        subtotal: parseFloat(newInvoice.subtotal) || 0,
        tax: parseFloat(newInvoice.tax) || 0,
        discount: parseFloat(newInvoice.discount) || 0,
        total: parseFloat(newInvoice.total) || 0
      };

      setInvoices([...invoices, invoice]);
      setNewInvoice({
        invoiceId: `INV-${String(Date.now()).slice(-4)}`,
        customer: '',
        project: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        items: [{ service: '', quantity: 1, rate: 0, amount: 0 }],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        terms: '',
        status: 'draft'
      });
      setShowForm(false);
    } else {
      alert('Please fill in customer and at least one service with amount');
    }
  };

  const handleDeleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleStatusChange = (id, status) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status } : inv
    ));
  };

  // Download as PDF
  const handleDownloadPDF = (invoice) => {
    const doc = new jsPDF();
    
    // Add company header
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('LUISANT MANAGER', 105, 15, { align: 'center' });
    
    // Invoice title and details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('INVOICE', 105, 45, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${invoice.invoiceId}`, 20, 60);
    doc.text(`Date: ${invoice.invoiceDate}`, 20, 67);
    doc.text(`Due Date: ${invoice.dueDate}`, 20, 74);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 81);
    
    // Client details
    doc.text(`Bill To: ${invoice.customer}`, 120, 60);
    if (invoice.project) {
      doc.text(`Project: ${invoice.project}`, 120, 67);
    }
    
    // Table
    const tableHeaders = [['Service/Product', 'Qty', 'Rate', 'Amount']];
    const tableData = invoice.items.map(item => [
      item.service,
      item.quantity.toString(),
      `$${parseFloat(item.rate).toFixed(2)}`,
      `$${parseFloat(item.amount).toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 90,
      head: tableHeaders,
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });
    
    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 150, finalY);
    if (invoice.tax > 0) {
      doc.text(`Tax (${invoice.tax}%): $${(invoice.subtotal * invoice.tax / 100).toFixed(2)}`, 150, finalY + 8);
    }
    if (invoice.discount > 0) {
      doc.text(`Discount (${invoice.discount}%): -$${(invoice.subtotal * invoice.discount / 100).toFixed(2)}`, 150, finalY + 16);
    }
    doc.setFontSize(12);
    doc.text(`Total: $${invoice.total.toFixed(2)}`, 150, finalY + 24);
    
    // Terms
    if (invoice.terms) {
      doc.setFontSize(8);
      doc.text('Terms & Conditions:', 20, finalY + 40);
      const splitTerms = doc.splitTextToSize(invoice.terms, 170);
      doc.text(splitTerms, 20, finalY + 46);
    }
    
    doc.save(`invoice-${invoice.invoiceId}.pdf`);
  };

  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border border-green-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border border-gray-200';
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
                <h1 className="text-2xl font-bold text-white">Invoices</h1>
                <p className="text-blue-100 mt-1">Manage and track your invoices</p>
              </div>
              <div className="text-right">
                <p className="text-blue-200">Outstanding Balance</p>
                <p className="text-3xl font-bold text-white">${totalOutstanding.toFixed(2)}</p>
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
                {showForm ? 'Cancel' : 'Create Invoice'}
              </button>
              <div className="text-gray-700">
                {invoices.length} invoices • ${totalOutstanding.toFixed(2)} outstanding
              </div>
            </div>
          </div>

          {/* Add Invoice Form */}
          {showForm && (
            <div className="p-6 border-b border-blue-100 bg-blue-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Invoice</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Invoice ID</label>
                  <input 
                    type="text"
                    name="invoiceId"
                    value={newInvoice.invoiceId}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Customer *</label>
                  <select 
                    name="customer"
                    value={newInvoice.customer}
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
                    value={newInvoice.project}
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
                  <label className="mb-2 font-medium text-gray-700">Invoice Date *</label>
                  <input 
                    type="date" 
                    name="invoiceDate"
                    value={newInvoice.invoiceDate}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Due Date *</label>
                  <input 
                    type="date" 
                    name="dueDate"
                    value={newInvoice.dueDate}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-medium text-gray-700">Tax %</label>
                  <input 
                    type="number" 
                    name="tax"
                    value={newInvoice.tax}
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
                    value={newInvoice.discount}
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
                    value={newInvoice.status}
                    onChange={handleInputChange}
                    className="border border-blue-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="mb-2 font-medium text-gray-700">Terms & Conditions</label>
                  <textarea 
                    name="terms"
                    value={newInvoice.terms}
                    onChange={handleInputChange}
                    placeholder="Payment terms and conditions..."
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

                {newInvoice.items.map((item, index) => (
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
                      {newInvoice.items.length > 1 && (
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
                    <div className="text-lg font-semibold">${newInvoice.subtotal.toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Tax:</label>
                    <div className="text-lg font-semibold">${((newInvoice.subtotal * newInvoice.tax) / 100).toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Discount:</label>
                    <div className="text-lg font-semibold text-red-600">-${((newInvoice.subtotal * newInvoice.discount) / 100).toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Total:</label>
                    <div className="text-xl font-bold text-green-600">${newInvoice.total.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={handleAddInvoice}
                >
                  <span>💾</span> Create Invoice
                </button>
              </div>
            </div>
          )}

          {/* Invoices List */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Invoice List</h3>
              <div className="text-gray-700">
                {invoices.filter(inv => inv.status !== 'paid').length} unpaid invoices
              </div>
            </div>

            <div className="space-y-4">
              {invoices.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">🧾</div>
                  <p className="text-lg">No invoices found</p>
                  <p>Create your first invoice using the form above</p>
                </div>
              ) : (
                invoices.map(invoice => (
                  <div key={invoice.id} className="flex justify-between items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-white">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="min-w-[120px]">
                        <div className="font-semibold text-gray-800">{invoice.invoiceId}</div>
                        <div className="text-gray-600 text-sm">{invoice.invoiceDate}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{invoice.customer}</div>
                        <div className="text-gray-600 text-sm">
                          Due: {invoice.dueDate}
                          {invoice.project && ` • ${invoice.project}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-gray-800 text-lg">${invoice.total?.toFixed(2)}</div>
                        <div className={`text-xs px-3 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                          className="text-xs border border-blue-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        <button 
                          className="text-green-500 hover:text-green-700 transition-colors p-2 rounded-lg hover:bg-green-100"
                          onClick={() => handleDownloadPDF(invoice)}
                          title="Download PDF"
                        >
                          📄
                        </button>
                        <button 
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-100"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          title="Delete Invoice"
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

export default Invoices;