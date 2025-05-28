import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export default function TotalIspControl({ totalIsp, totalJartup, totalJartaplok }) {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend bg-white/70 p-1 rounded-sm shadow-lg'); // Added shadow for better appearance
      div.innerHTML = `
        <div class="flex justify-around text-center">

          <div class="flex flex-col items-center justify-center p-0.5">
            <span class="text-xs px-1">ISP Nasional</span>
            <span class="text-lg md:text-xl font-semibold">${totalIsp}</span> <!-- Added text-blue-700 for highlighting -->
          </div>

          <div class="flex flex-col items-center justify-center p-0.5 border-l-2">
            <span class="text-xs px-1">JARTUP</span>
            <span class="text-lg md:text-xl font-semibold">${totalJartup}</span>
          </div>

          <div class="flex flex-col items-center justify-center p-0.5 border-l-2">
            <span class="text-xs px-1">JARTAPLOK</span>
            <span class="text-lg md:text-xl font-semibold">${totalJartaplok}</span>
          </div>

        </div>
      `;
      return div;
    };




    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map, totalIsp, totalJartup, totalJartaplok]); // Added totalJartup and totalJartaplok to dependencies

  return null;
}