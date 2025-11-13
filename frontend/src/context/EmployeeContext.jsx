import React, { createContext, useState, useContext } from 'react';
import { userData } from '../services/data';

const EmployeeContext = createContext();

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const users = await userData.getUsers();
      setEmployees(users);
    } catch (error) {
      console.error('Error fetching employees from database:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (employeeData) => {
    try {
      // Note: This would typically be a separate API endpoint for creating employees
      // For now, we'll use the auth register endpoint
      const newEmployee = await userData.createUser(employeeData);
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (error) {
      console.error('Error adding employee to database:', error);
      throw error;
    }
  };

  const updateEmployee = async (id, employeeData) => {
    try {
      const updatedEmployee = await userData.updateUser(id, employeeData);
      setEmployees(prev => 
        prev.map(emp => emp._id === id ? updatedEmployee : emp)
      );
      return updatedEmployee;
    } catch (error) {
      console.error('Error updating employee in database:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await userData.deleteUser(id);
      setEmployees(prev => prev.filter(emp => emp._id !== id));
    } catch (error) {
      console.error('Error deleting employee from database:', error);
      throw error;
    }
  };

  const value = {
    employees,
    loading,
    selectedEmployee,
    setSelectedEmployee,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};