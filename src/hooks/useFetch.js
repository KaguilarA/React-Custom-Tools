import { useEffect, useState, useCallback, useRef } from "react";

/**
 * Custom hook to perform CRUD operations with fetch API.
 *
 * @param {string} url - The base URL for API requests.
 * @param {object} [options] - Optional config (headers, autoFetch).
 * @param {object} [options.headers] - Custom headers to be sent with the request.
 * @param {boolean} [options.autoFetch=true] - Whether to auto-execute a GET request on mount.
 * @returns {{
 *   data: any,
 *   isLoading: boolean,
 *   hasError: string | null,
 *   get: () => Promise<void>,
 *   post: (body: any) => Promise<void>,
 *   put: (body: any) => Promise<void>,
 *   patch: (body: any) => Promise<void>,
 *   remove: () => Promise<void>,
 * }}
 */
export const useFetch = (url, options = {}) => {
  // Destructuring options for custom headers and autoFetch flag.
  const { headers = {}, autoFetch = false } = options;

  // State variables for data, error, and loading status.
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ref to store the AbortController instance to cancel requests.
  const controllerRef = useRef(null);

  /**
   * Performs an API request with the specified method and body.
   * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE).
   * @param {any} [body=null] - The request body, if needed (for POST, PUT, PATCH).
   */
  const request = useCallback(
    async (method, body = null) => {
      setIsLoading(true); // Set loading state to true.
      setHasError(null); // Clear any previous errors.
      controllerRef.current = new AbortController(); // Create a new AbortController to manage request cancellation.

      try {
        // Perform the fetch request with appropriate method, headers, and body.
        const resp = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json", // Default content type.
            ...headers, // Include any custom headers passed in options.
          },
          body: body ? JSON.stringify(body) : null, // Only include body if provided.
          signal: controllerRef.current.signal, // Attach the signal for abort functionality.
        });

        // Check if the response is successful (status 200-299).
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }

        // Parse the JSON response data.
        const result = await resp.json();
        setData(result); // Update the data state.
      } catch (err) {
        // Handle errors and ignore abort errors.
        if (err.name !== "AbortError") {
          setHasError(err.message); // Update error state with the error message.
        }
      } finally {
        setIsLoading(false); // Set loading state to false after request completes.
      }
    },
    [url, headers] // Recreate the request function if URL or headers change.
  );

  // Automatically trigger a GET request on mount if autoFetch is true.
  useEffect(() => {
    if (autoFetch) {
      request("GET");
    }

    // Cleanup function to abort the request if the component unmounts.
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [request, autoFetch]); // Dependency array ensures useEffect runs when request or autoFetch changes.

  return {
    data, // The fetched data from the API.
    isLoading, // Indicates if the request is still loading.
    hasError, // Error message if the request fails.
    get: () => request("GET"), // Method to perform a GET request.
    post: (body) => request("POST", body), // Method to perform a POST request with a body.
    put: (body) => request("PUT", body), // Method to perform a PUT request with a body.
    patch: (body) => request("PATCH", body), // Method to perform a PATCH request with a body.
    remove: () => request("DELETE"), // Method to perform a DELETE request.
  };
};
