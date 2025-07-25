import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom/client';
import MarketShareChart from './MarketShareChart';

export default function MarketShareControl() {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create('div');
    const chartControl = L.control({ position: 'bottomleft' });

    chartControl.onAdd = function () {
      return controlDiv;
    };

    chartControl.addTo(map);

    const root = ReactDOM.createRoot(controlDiv);
    root.render(<MarketShareChart />);

    return () => {
      chartControl.remove();
      root.unmount();
    };
  }, [map]);

  return null;
}
