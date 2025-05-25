import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function TotalIspControl({ totalIsp }) {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend bg-white/70 p-1.5 rounded-md m-2.5');
      div.innerHTML = `<h4>Total ISP Indonesia: ${totalIsp}</h4>`;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, totalIsp]);

  return null;
}