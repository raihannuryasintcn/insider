import LegendControl from '../components/Map/LegendControl';
import TotalIspControl from '../components/Map/TotalIspControl';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export default function Maps() {
  const [geoData, setGeoData] = useState(null);
  const [totalIsp, setTotalIsp] = useState(0);
  const [totalJartup, setTotalJartup] = useState(0);
  const [totalJartaplok, setTotalJartaplok] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const primaryUrl = import.meta.env.VITE_ISP_API_URL;
      const fallbackUrl = "http://localhost:3000/api/isp";

      try {
        // Fetch geodata (selalu dari local)
        const geodataPromise = fetch('/geodata.geojson').then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch geodata: ${res.status}`);
          }
          return res.json();
        });

        // Fetch ISP summary dengan fallback mechanism
        let ispDataPromise;

        if (primaryUrl) {
          ispDataPromise = fetch(primaryUrl + '/summary')
            .then(res => {
              if (!res.ok) {
                throw new Error(`Primary server error: ${res.status}`);
              }
              return res.json();
            })
            .catch(async (primaryError) => {
              console.log("Primary server failed, trying localhost...", primaryError.message);
              // Fallback ke localhost
              const fallbackRes = await fetch(fallbackUrl + '/summary');
              if (!fallbackRes.ok) {
                throw new Error(`Fallback server error: ${fallbackRes.status}`);
              }
              return fallbackRes.json();
            });
        } else {
          ispDataPromise = fetch(fallbackUrl + '/summary').then(res => {
            if (!res.ok) {
              throw new Error(`Localhost server error: ${res.status}`);
            }
            return res.json();
          });
        }

        // Execute both promises
        const [geojson, ispData] = await Promise.all([geodataPromise, ispDataPromise]);

        // Gabungkan data ISP ke GeoJSON berdasarkan nama provinsi
        geojson.features.forEach(feature => {
          const provName = feature.properties.name;
          const info = ispData[provName];
          feature.properties.total_isp = info ? info.total_isp : 0;
          feature.properties.total_jartup = info ? info.total_jartup : 0;
          feature.properties.total_jartaplok = info ? info.total_jartaplok : 0;
        });
        setGeoData(geojson);

        // Calculate total ISP, JARTUP, and JARTAPLOK
        const ispSummaryValues = Object.values(ispData);
        const total = ispSummaryValues.reduce((sum, info) => sum + (info ? info.total_isp : 0), 0);
        const jartupTotal = ispSummaryValues.reduce((sum, info) => sum + (info ? info.total_jartup : 0), 0);
        const jartaplokTotal = ispSummaryValues.reduce((sum, info) => sum + (info ? info.total_jartaplok : 0), 0);

        setTotalIsp(total);
        setTotalJartup(jartupTotal);
        setTotalJartaplok(jartaplokTotal);

      } catch (err) {
        console.error("Error fetching data:", err);
        // Optional: set error state atau default values
        // setError("Failed to load map data");
      }
    };

    fetchData();
  }, []);

  const styleByFeature = (feature) => ({
    color: '#333',
    weight: 1,
    fillColor: feature.properties.color || '#ccc',
    fillOpacity: 0.6,
  });

  const onEachFeature = (feature, layer) => {
    const { name, region, total_isp, total_jartup, total_jartaplok } = feature.properties;
    layer.bindTooltip(
      `<strong>${name}</strong><br/>Territory: ${region}<br/>ISP: ${total_isp}<br/>JARTUP: ${total_jartup}<br/>JARTAPLOK: ${total_jartaplok}`,
      { sticky: true }
    );
  };

  const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div>

      <div className="flex flex-row items center justify-between mb-4">
        <span className="text-2xl font-bold text-gray-800">Peta Nasional ISP</span>
        <p className="text-sm text-gray-500 ml-2 justify-center my-auto font-semibold">Nasional - Last Updated W4 Mei 25</p>
      </div>
      {/* Wrap MapContainer in a responsive aspect ratio container */}
      <div className="w-full h-[calc(100%-7%)]">
        <MapContainer center={[-1.5, 117.5]} zoomControl={false} zoom={5} className="w-full h-full rounded-lg">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url={tileUrl}
          />
          {geoData && (
            <>
              <GeoJSON data={geoData} style={styleByFeature} onEachFeature={onEachFeature} />
              <LegendControl />
              <TotalIspControl totalIsp={totalIsp} totalJartup={totalJartup} totalJartaplok={totalJartaplok} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}