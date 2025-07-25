import { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import ReactDOM from 'react-dom/client';
import IspMapDropdown from './ispMapDropdown';

export default function DropdownControl({ providers, selected, setSelected }) {
  const map = useMap();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const divRef = useRef(null);

  // Create Leaflet control once
  useEffect(() => {
    const controlDiv = L.DomUtil.create('div');
    divRef.current = controlDiv;

    L.DomEvent.disableClickPropagation(controlDiv);
    L.DomEvent.disableScrollPropagation(controlDiv);

    const dropdownControl = L.control({ position: 'topleft' });
    dropdownControl.onAdd = () => controlDiv;
    dropdownControl.addTo(map);

    rootRef.current = ReactDOM.createRoot(controlDiv);

    return () => {
      dropdownControl.remove();
      rootRef.current.unmount();
    };
  }, [map]);

  // Re-render the dropdown content when needed
  useEffect(() => {
    if (rootRef.current && divRef.current) {
      rootRef.current.render(
        <IspMapDropdown
          providers={providers}
          selected={selected}
          setSelected={setSelected}
          open={open}
          setOpen={setOpen}
        />
      );
    }
  }, [providers, selected, open, setSelected]);

  return null;
}
