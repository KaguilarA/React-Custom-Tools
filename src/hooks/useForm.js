import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook to manage controlled forms in React.
 *
 * @template T
 * @param {T} initialForm - Object containing the initial form values.
 * @param {(formState: T) => Record<string, string>} [validateFn] - Optional validation function that returns an object with error messages.
 * @returns {{
 *   formState: T,
 *   onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void,
 *   onResetForm: () => void,
 *   errors: Record<string, string>,
 *   isValid: boolean,
 *   setFormState: React.Dispatch<React.SetStateAction<T>>
 * }}
 */
export const useForm = (initialForm = {}, validateFn) => {
  const [formState, setFormState] = useState(initialForm);
  const [errors, setErrors] = useState({});

  // Update form state when initialForm changes externally
  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  /**
   * Handles input changes, including checkboxes, radios, etc.
   */
  const onInputChange = useCallback(({ target }) => {
    const { name, type, value, checked } = target;

    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /**
   * Resets the form to its initial values.
   */
  const onResetForm = useCallback(() => {
    setFormState(initialForm);
    setErrors({});
  }, [initialForm]);

  // Run validation when the form state changes
  useEffect(() => {
    if (validateFn) {
      const validationErrors = validateFn(formState);
      setErrors(validationErrors || {});
    }
  }, [formState, validateFn]);

  const isValid = Object.keys(errors).length === 0;

  return {
    formState,
    errors,
    isValid,
    onInputChange,
    onResetForm,
    setFormState,
  };
};
