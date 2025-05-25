import PageMeta from "../../components/common/PageMeta";
import LegendControl from '../../components/Map/LegendControl';
import TotalIspControl from '../../components/Map/TotalIspControl';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

export default function Maps() {
  const [geoData, setGeoData] = useState(null);
  const [totalIsp, setTotalIsp] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/provinsi_dengan_region.geojson').then(res => res.json()),
      fetch(import.meta.env.VITE_ISP_API_URL + '/summary').then(res => res.json())
    ])
      .then(([geojson, ispData]) => {
        // Gabungkan data ISP ke GeoJSON berdasarkan nama provinsi
        geojson.features.forEach(feature => {
          const provName = feature.properties.name;
          const info = ispData[provName];
          feature.properties.total_isp = info ? info.total_isp : 0;
        });
        setGeoData(geojson);

        // Calculate total ISP
        const total = Object.values(ispData).reduce((sum, info) => sum + (info ? info.total_isp : 0), 0);
        setTotalIsp(total);
      });
  }, []);

  const styleByFeature = (feature) => ({
    color: '#333',
    weight: 1,
    fillColor: feature.properties.color || '#ccc',
    fillOpacity: 0.6,
  });

  const onEachFeature = (feature, layer) => {
    const { name, region, total_isp } = feature.properties;
    layer.bindTooltip(
      `<strong>${name}</strong><br/>Region: ${region}<br/>Total ISP: ${total_isp}`,
      { sticky: true }
    );
  };

  return (
    <div className="h-full w-full relative">
      <PageMeta title="Territory Maps Dashboard" />

      {/* Wrap MapContainer in a responsive aspect ratio container */}
      <div className="w-full h-auto aspect-[16/7] rounded-lg border border-gray-300">
        <MapContainer center={[-1.5, 117.5]} zoom={5} className="w-full h-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          // https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
          />
          {geoData && (
            <>
              <GeoJSON data={geoData} style={styleByFeature} onEachFeature={onEachFeature} />
              <LegendControl />
              <TotalIspControl totalIsp={totalIsp} />
            </>
          )}


        </MapContainer>
      </div>
    </div >
  );
}