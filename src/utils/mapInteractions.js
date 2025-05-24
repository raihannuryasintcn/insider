// Style function for the GeoJSON polygons
export const createPolygonStyle = (groupColors, tregGroupMapping, hoveredTregGroup) => (feature) => {
  const tregCode = feature.properties.code;
  const group = tregGroupMapping[tregCode] || tregCode;

  // Get the color from the groupColors map
  const fillColor = groupColors[group] || groupColors.default;

  // Highlight hovered group
  const isHovered = group === hoveredTregGroup;

  return {
    fillColor: fillColor,
    weight: isHovered ? 3 : 1, // Thicker border on hover
    opacity: 1,
    color: isHovered ? '#1F2937' : '#FFFFFF', // Darker border on hover
    dashArray: undefined,
    fillOpacity: isHovered ? 0.9 : 0.6
  };
};

// Function to create onEachFeature handler
export const createOnEachFeature = (L, ispData, tregGroupMapping, setHoveredTregGroup) => (feature, layer) => {
  const tregCode = feature.properties.code;
  const group = tregGroupMapping[tregCode] || tregCode;
  const territoryData = ispData[group];

  if (territoryData) {
    // Bind tooltip to the layer
    layer.bindTooltip(
      `<div style="font-family: Arial, sans-serif; font-size: 12px;">
        <strong style="font-size: 14px;">${territoryData.name}</strong><br/>
        <div style="margin-top: 4px;">
          <div>Territory: <strong>${group}</strong></div>
          <div>Total ISPs: <strong>${territoryData.total}</strong></div>
          <div>Licensed: <strong style="color: #10B981;">${territoryData.licensed}</strong></div>
          <div>Coverage: <strong>${Math.round((territoryData.licensed / territoryData.total) * 100)}%</strong></div>
        </div>
      </div>`,
      {
        permanent: false, // Tooltip hides on mouseout
        direction: 'auto', // Tooltip position relative to the feature
        sticky: true // Tooltip follows the mouse
      }
    );
  }

  // Function to handle mouseover event on GeoJSON features
  const handleFeatureMouseOver = () => {
    setHoveredTregGroup(group); // Set hoveredTregGroup for styling
  };

  // Function to handle mouseout event on GeoJSON features
  const handleFeatureMouseOut = () => {
    setHoveredTregGroup(null); // Clear hoveredTregGroup for styling
  };

  // Fixed click handler - now uses the correct group mapping
  const handleFeatureClick = () => {
    if (territoryData) {
      console.log(`Clicked on ${group}:`, territoryData);
      // You can add other click actions here if needed
    } else {
      console.warn(`No data found for group: ${group}`);
    }
  };


  layer.on({
    mouseover: handleFeatureMouseOver,
    mouseout: handleFeatureMouseOut,
    click: handleFeatureClick
  });
};