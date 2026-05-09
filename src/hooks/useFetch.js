import { useState, useEffect } from 'react';

/**
 * Custom hook for data fetching with AbortController cleanup.
 * Pass null or empty string to skip fetching.
 * Returns { data, loading, error }
 */
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip fetch if url is null or empty
    if (!url) {
      let cancelled = false
      queueMicrotask(() => {
        if (cancelled) return
        setData(null)
        setLoading(false)
        setError(null)
      })
      return () => {
        cancelled = true
      }
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (err) {
        // Ignore abort errors — they happen on cleanup
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Cancel in-flight request on cleanup or url change
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
