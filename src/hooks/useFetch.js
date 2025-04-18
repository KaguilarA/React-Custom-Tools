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
export const useApi = (url, options = {}) => {
  const { headers = {}, autoFetch = false } = options;

  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef(null);

  const request = useCallback(
    async (method, body = null) => {
      setIsLoading(true);
      setHasError(null);
      controllerRef.current = new AbortController();

      try {
        const resp = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : null,
          signal: controllerRef.current.signal,
        });

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }

        const result = await resp.json();
        setData(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setHasError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [url, headers]
  );

  useEffect(() => {
    if (autoFetch) {
      request("GET");
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [request, autoFetch]);

  return {
    data,
    isLoading,
    hasError,
    get: () => request("GET"),
    post: (body) => request("POST", body),
    put: (body) => request("PUT", body),
    patch: (body) => request("PATCH", body),
    remove: () => request("DELETE"),
  };
};
