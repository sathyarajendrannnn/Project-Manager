import React from 'react';

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  actions = [],
  className = ''
}) => {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 border-t border-gray-200 bg-gray-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)} 
                  className="px-6 py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={onRowClick ? 'hover:bg-gray-50 cursor-pointer transition-colors' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={`text-sm font-medium transition-colors ${
                              action.variant === 'danger' 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-blue-600 hover:text-blue-900'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Example usage:
/*
<Table
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'status', 
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    }
  ]}
  data={users}
  actions={[
    { label: 'Edit', onClick: (user) => handleEdit(user) },
    { label: 'Delete', variant: 'danger', onClick: (user) => handleDelete(user) }
  ]}
  onRowClick={(user) => handleView(user)}
/>
*/

export default Table;