import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet"; // Import useMap
import "leaflet/dist/leaflet.css";
import geoData from "../../../listgeodata.json"; // Assuming this path is correct
import L from 'leaflet'; // Import Leaflet library
import { calculateLabelPositions } from "../../utils/mapUtils"; // Import the new function

// Center position of Indonesia
const initialPosition = [-1.0489, 118.0149];

// Convert our data to proper GeoJSON format
const convertToGeoJSON = (data) => {
  if (!data || !data.d || !data.d.data) {
    console.error("Invalid geoData structure:", data);
    return { type: "FeatureCollection", features: [] };
  }
  return {
    type: "FeatureCollection",
    features: data.d.data.map(item => ({
      type: "Feature",
      id: item.alias,
      properties: {
        alias: item.alias,
        code: item.code
      },
      geometry: {
        ...item.geom,
        // Make sure we have a proper type
        type: item.geom ? (item.geom.type || "MultiPolygon") : "MultiPolygon" // Handle potential missing geom
      }
    }))
  };
};

// Define the color mapping for specific aliases
const aliasColors = {
  "TR1": "blue",
  "TR2": "purple",
  "TR3": "green",
  "TR4": "gray",
  // Add a default color for aliases not in the map
  "default": "#ffffff" // A default white color
};
// Placeholder ISP data (replace with actual data fetching logic)
const placeholderIspData = {
  "TR1": { territory:"TR1", total: 250, licensed: 200 },
  "TR2": { territory:"TR2", total: 180, licensed: 150 },
  "TR3": { territory:"TR3", total: 300, licensed: 280 },
  "TR4": { territory:"TR4", total: 120, licensed: 100 },
};


export default function Maps() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [labelPositions, setLabelPositions] = useState([]);
  const [hoveredAlias, setHoveredAlias] = useState(null); // State to track hovered alias


  useEffect(() => {
    // Convert the data to proper GeoJSON format when component mounts
    const formattedData = convertToGeoJSON(geoData);
    setGeoJsonData(formattedData);

    // Calculate label positions using the new function
    const positions = calculateLabelPositions(formattedData);
    setLabelPositions(positions);

  }, []); // Empty dependency array, runs only once on mount


  // Style function for the GeoJSON polygons
  const polygonStyle = (feature) => {
    const alias = feature.properties.alias;
    // Get the color from the aliasColors map, defaulting to the "default" color
    const fillColor = aliasColors[alias] || aliasColors.default;

    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  // Function to handle mouseover event on GeoJSON features
  const handleFeatureMouseOver = (event) => {
    const layer = event.target;
    const alias = layer.feature.properties.alias;
    setHoveredAlias(alias); // Set hovered alias

    // Highlight the feature (optional, but good for user feedback)
    layer.setStyle({
      weight: 2,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.9
    });
  };

  // Function to handle mouseout event on GeoJSON features
  const handleFeatureMouseOut = (event) => {
    setHoveredAlias(null); // Clear hovered alias
    // Reset the style to the default
    event.target.setStyle(polygonStyle(event.target.feature));
  };

  // Function to handle click event on GeoJSON features (optional)
  const handleFeatureClick = (event) => {
    const alias = event.target.feature.properties.alias;
    const ispData = placeholderIspData[alias];
    if (ispData) {
      console.log(`Clicked on ${alias}: Total ${ispData.total}, Licensed ${ispData.licensed}`);
      // You could potentially open a modal or navigate to a detail page here
    }
  };


  // Function to add event listeners to each feature
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: handleFeatureMouseOver,
      mouseout: handleFeatureMouseOut,
      click: handleFeatureClick, // Optional click handler
    });
  };


  return (
    <div className="h-full w-full">
      <PageMeta title="Ecommerce Dashboard" />
      <MapContainer
        center={initialPosition}
        zoom={5}
        scrollWheelZoom={true}
        className="h-[470px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />


        {/* Render GeoJSON data if it's available */}
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={polygonStyle}
            onEachFeature={onEachFeature} // Add event listeners
            key={`geojson-${Date.now()}`} // Ensure re-render if data changes
          />
        )}

        {/* Render ISP data labels on hover */}
        {labelPositions.map(({ alias, position }) => {
          // Only render marker if the alias matches the hovered alias
          if (alias === hoveredAlias) {
            const ispData = placeholderIspData[alias];
            if (!ispData) return null; // Don't render if no data for alias

            const customIcon = L.divIcon({
              className: 'isp-label-icon', // Custom class for styling
              html: `<div class="bg-white/70 p-1 shadow text-xs">
                       ${ispData.territory}<br>Total ISP: ${ispData.total}<br>Licensed: ${ispData.licensed}
                     </div>`,
              iconSize: [100, 30], // Adjust size as needed
              iconAnchor: [50, 15], // Anchor the icon in the center
            });

            return (
              <Marker key={alias} position={position} icon={customIcon}>
                {/* Optional: Add a popup with more details */}
                {/* <Popup>
                  <div>
                    <h4>${alias}</h4>
                    <p>Total ISPs: ${ispData.total}</p>
                    <p>Licensed ISPs: ${ispData.licensed}</p>
                  </div>
                </Popup> */}
              </Marker>
            );
          }
          return null; // Don't render marker if not hovered
        })}


        {/* Legend */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/70 pt-1 pb-0.5 px-2 shadow-md">
          {/* <h4 className="text-lg font-semibold mb-2">Legend</h4> */}
          {Object.entries(aliasColors).map(([alias, color]) => {
            // Don't include the default color in the legend
            if (alias === "default") return null;
            return (
              <div key={alias} className="flex items-center mb-0.5">
                <div
                  className="w-2 h-2 mr-1 "
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-xs">{alias}</span>
              </div>
            );
          })}
        </div>

      </MapContainer>

      {/* Your other components */}
    </div>
  );
}
