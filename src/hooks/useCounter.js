import { useState } from "react";

/**
 * Custom hook to manage a simple counter with increment, decrement, and reset functionality.
 *
 * @param {number} initialValue - The initial value of the counter.
 * @returns {{
 *   counter: number, // The current value of the counter.
 *   increment: (value?: number) => void, // Function to increment the counter by a specified value (default is 1).
 *   decrement: (value?: number) => void, // Function to decrement the counter by a specified value (default is 1).
 *   reset: () => void // Function to reset the counter back to its initial value.
 * }}
 */
export const useCounter = (initialValue = 0) => {
  // State variable to hold the current count value.
  const [count, setCount] = useState(initialValue);

  /**
   * Increments the counter by the specified value (default is 1).
   * @param {number} [value=1] - The value to increment the counter by.
   */
  const increment = (value = 1) => setCount(count + value);

  /**
   * Decrements the counter by the specified value (default is 1), but only if 
   * the count is greater than 0.
   * @param {number} [value=1] - The value to decrement the counter by.
   */
  const decrement = (value = 1) => {
    if (count === 0) return; // Prevent decrementing if the count is already 0.
    setCount(count - value);
  };

  /**
   * Resets the counter to its initial value.
   */
  const reset = () => setCount(initialValue);

  // Return the counter value and the functions to modify it.
  return {
    counter: count, // Current counter value.
    decrement, // Function to decrement the counter.
    increment, // Function to increment the counter.
    reset, // Function to reset the counter to the initial value.
  };
};
