import { useState, useEffect } from "react";

const useFetchISPData = () => {
  const [ispData, setIspData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchISPData = async () => {
      const primaryUrl = import.meta.env.VITE_ISP_API_URL;
      const fallbackUrl = "http://localhost:3000/api/isp";

      try {
        setLoading(true);
        setError(null);

        let response;

        // Coba server env dulu (jika ada)
        if (primaryUrl) {
          try {
            response = await fetch(primaryUrl);
            if (!response.ok) {
              throw new Error(`Primary server error: ${response.status}`);
            }
          } catch (primaryError) {
            console.log(
              "Primary server failed, trying localhost...",
              primaryError.message
            );
            // Jika server env gagal, coba localhost
            response = await fetch(fallbackUrl);
            if (!response.ok) {
              throw new Error(`Fallback server error: ${response.status}`);
            }
          }
        } else {
          // Jika tidak ada env, langsung ke localhost
          response = await fetch(fallbackUrl);
          if (!response.ok) {
            throw new Error(`Localhost server error: ${response.status}`);
          }
        }

        const data = await response.json();
        setIspData(data);
      } catch (err) {
        console.error("All servers failed:", err);
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
