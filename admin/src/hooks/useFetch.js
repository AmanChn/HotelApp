// src/hooks/useFetch.js
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reFetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(url, {
        withCredentials: true,
        headers: { "Cache-Control": "no-cache" }, // Prevent caching
      });
      const responseData = Array.isArray(res.data) ? res.data : [];
      setData(responseData);
      setError(null);
      console.log("Fetch success:", url, responseData);
    } catch (err) {
      console.error("Fetch error:", url, err.response?.data || err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    reFetch();
  }, [reFetch]);

  return { data, loading, error, reFetch };
};

export default useFetch;