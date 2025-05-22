import { useState, useEffect } from "react";

const useFetchISPData = () => {
  const [ispData, setIspData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchISPData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(import.meta.env.VITE_ISP_API_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data = await response.json();
        setIspData(data);
      } catch (err) {
        console.error("Error fetching ISP data:", err);
        setError("Failed to load ISP data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchISPData();
  }, []);

  return { ispData, loading, error };
};

export default useFetchISPData;