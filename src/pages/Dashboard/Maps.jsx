import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geoData from "../../../listgeodata.json";
import L from 'leaflet'; // Import Leaflet library

import { convertToGeoJSON, groupColors, ispData, tregGroupMapping } from "../../utils/mapDataUtils";
import { calculateLabelPositions } from "../../utils/mapUtils"; // Keep this import
import { createPolygonStyle, createOnEachFeature } from "../../utils/mapInteractions";


// Center position of Indonesia
const initialPosition = [-1.0489, 118.0149];


export default function Maps() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [groupedFeatures, setGroupedFeatures] = useState({});
  const [labelPositions, setLabelPositions] = useState([]);
  const [hoveredTregGroup, setHoveredTregGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setLoading(true);

      // Convert the data to proper GeoJSON format
      const formattedData = convertToGeoJSON(geoData);

      if (!formattedData.features.length) {
        throw new Error("No valid features found in geo data");
      }

      setGeoJsonData(formattedData);

      // Group features by combined TREG codes
      const grouped = {};
      formattedData.features.forEach(feature => {
        const tregCode = feature.properties.code;
        const group = tregGroupMapping[tregCode] || tregCode;

        if (!grouped[group]) {
          grouped[group] = [];
        }
        grouped[group].push(feature);
      });
      setGroupedFeatures(grouped);

      // Calculate label positions for territories - with error handling
      try {
        const positions = calculateLabelPositions(formattedData);
        // Validate positions before setting
        const validPositions = positions.filter(pos =>
          pos &&
          typeof pos.lat === 'number' &&
          typeof pos.lng === 'number' &&
          !isNaN(pos.lat) &&
          !isNaN(pos.lng)
        );
        setLabelPositions(validPositions);
        console.log("Calculated label positions:", validPositions); // Keep log for debugging if needed
      } catch (labelError) {
        console.warn("Error calculating label positions:", labelError);
        setLabelPositions([]); // Set empty array if label calculation fails
      }

      setLoading(false);
    } catch (err) {
      console.error("Error processing geo data:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Create styled and onEachFeature functions using the factory functions
  const polygonStyle = createPolygonStyle(groupColors, tregGroupMapping, hoveredTregGroup);
  const onEachFeature = createOnEachFeature(L, ispData, tregGroupMapping, setHoveredTregGroup);


  // Loading state
  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error loading map</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <PageMeta title="Territory Maps Dashboard" />

      {/* Wrap MapContainer in a responsive aspect ratio container */}
      <div className="w-full h-auto aspect-[16/7] rounded-lg border border-gray-300">
        <MapContainer
          center={initialPosition}
          zoom={5}
          scrollWheelZoom={true}
          className="w-full h-full" // Make MapContainer fill the parent div
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Render GeoJSON data */}
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={polygonStyle}
              onEachFeature={onEachFeature}
              key="geojson-territories"
            />
          )}

          {/* Render labels if available - with proper validation */}
          {labelPositions && labelPositions.length > 0 && labelPositions.map((pos, index) => {
            // Double check each position before rendering
            if (!pos || typeof pos.lat !== 'number' || typeof pos.lng !== 'number' ||
                isNaN(pos.lat) || isNaN(pos.lng)) {
              return null;
            }

            return (
              <Marker
                key={`label-${index}`}
                position={[pos.lat, pos.lng]}
                icon={L.divIcon({
                  className: 'text-label',
                  html: `<div style="background: rgba(255,255,255,0.8); padding: 2px 6px; border-radius: 3px; font-size: 12px; font-weight: bold; color: #333;">${pos.label || 'Unknown'}</div>`,
                  iconSize: [60, 20],
                  iconAnchor: [30, 10]
                })}
              />
            );
          })}

        </MapContainer>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-white/80 shadow-lg rounded-sm py-1 p-2 min-w-[60px]">
        {/* <h4 className="text-sm font-semibold mb-0.5 text-gray-700">Territories</h4> */}
        {Object.entries(groupColors).map(([group, color]) => {
          if (group === "default") return null;

          const territoryData = ispData[group];

          return (
            <div
              key={group}
              className={`flex items-center mb-0.5 rounded cursor-pointer transition-colors hover:bg-gray-50`}
            >
              <div
                className="w-3 h-3 mr-2 border border-gray-300 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">{group}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

  );
}