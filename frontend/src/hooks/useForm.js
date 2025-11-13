import { useState } from 'react';

export const useForm = (initialValues = {}, validateFn) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur
    if (validateFn) {
      const validationErrors = validateFn(values);
      setErrors(validationErrors);
    }
  };

  const setFieldValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const validate = () => {
    if (validateFn) {
      const validationErrors = validateFn(values);
      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    }
    return true;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    validate,
    setValues
  };
};