import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function LegendControl() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'topright' });

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'info legend bg-white/70 py-1 px-2 rounded-sm shadow-sm z-50');
      div.innerHTML = `
        <div class="flex items-center text-cs mb-0.5"><span class="inline-block w-2.5 h-2.5 bg-[#002fff] mr-1"></span>TR1</div>
        <div class="flex items-center text-cs mb-0.5"><span class="inline-block w-2.5 h-2.5 bg-[#9d00ff] mr-1"></span>TR2</div>
        <div class="flex items-center text-cs mb-0.5"><span class="inline-block w-2.5 h-2.5 bg-[#00d90b] mr-1"></span>TR3</div>
        <div class="flex items-center text-cs"><span class="inline-block w-2.5 h-2.5 bg-[#a9a9a9] mr-1"></span>TR4</div>
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null; // This component doesn't render anything itself
}