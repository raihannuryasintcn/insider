import L from 'leaflet';

// Function to calculate label positions
export const calculateLabelPositions = (formattedData) => {
  const positions = [];
  if (formattedData && formattedData.features) {
    const featuresByAlias = new Map();
    formattedData.features.forEach(feature => {
      const alias = feature.properties.alias;
      if (!featuresByAlias.has(alias)) {
        featuresByAlias.set(alias, []);
      }
      featuresByAlias.get(alias).push(feature);
    });

    featuresByAlias.forEach((features, alias) => {
      if (features.length > 0) {
        try {
          // Calculate the combined bounds for all features of this alias
          const combinedBounds = L.geoJSON(features[0].geometry).getBounds();
          for (let i = 1; i < features.length; i++) {
            combinedBounds.extend(L.geoJSON(features[i].geometry).getBounds());
          }

          if (combinedBounds.isValid()) {
            const center = combinedBounds.getCenter();
            positions.push({
              alias: alias,
              position: [center.lat, center.lng],
            });
          } else {
            console.warn(`Could not calculate valid bounds for alias: ${alias}`);
          }
        } catch (error) {
          console.error(`Error processing features for alias ${alias}:`, error);
        }
      }
    });
  }
  return positions;
};