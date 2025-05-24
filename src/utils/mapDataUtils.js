// Convert our data to proper GeoJSON format
export const convertToGeoJSON = (data) => {
  if (!data || !data.d || !data.d.data) {
    console.error("Invalid geoData structure:", data);
    return { type: "FeatureCollection", features: [] };
  }

  return {
    type: "FeatureCollection",
    features: data.d.data.map(item => {
      // Validate geometry exists
      if (!item.geom) {
        console.warn(`Missing geometry for item with alias: ${item.alias}`);
        return null;
      }

      return {
        type: "Feature",
        id: item.alias,
        properties: {
          alias: item.alias,
          code: item.code
        },
        geometry: {
          ...item.geom,
          type: item.geom.type || "MultiPolygon"
        }
      };
    }).filter(Boolean) // Remove null entries
  };
};

// Define the color mapping for TREG groups
export const groupColors = {
  "TR1": "#3B82F6", // Blue
  "TR2": "#8B5CF6", // Purple
  "TR3": "#10B981", // Green
  "TR4": "#6B7280", // Gray
  "default": "#E5E7EB" // Light gray for unmapped regions
};

// Updated ISP data with more detailed information
export const ispData = {
  "TR1": {
    territory: "TR1",
    name: "Territory 1",
    total: 250,
    licensed: 200,
    regions: ["TREG1"]
  },
  "TR2": {
    territory: "TR2",
    name: "Territory 2",
    total: 180,
    licensed: 150,
    regions: ["TREG2", "TREG3"]
  },
  "TR3": {
    territory: "TR3",
    name: "Territory 3",
    total: 300,
    licensed: 280,
    regions: ["TREG4", "TREG5"]
  },
  "TR4": {
    territory: "TR4",
    name: "Territory 4",
    total: 120,
    licensed: 100,
    regions: ["TREG6", "TREG7"]
  }
};

// Mapping of TREG codes to combined groups
export const tregGroupMapping = {
  "TREG1": "TR1",
  "TREG2": "TR2",
  "TREG3": "TR2",
  "TREG4": "TR3",
  "TREG5": "TR3",
  "TREG6": "TR4",
  "TREG7": "TR4"
};