import { useState } from "react";
import { Button } from '@mantine/core';
import { IconSelector } from '@tabler/icons-react';
import internetServiceProviders from '../../pages/isp.json';

export default function IspMapDropdown({ providers, selected, setSelected, open, setOpen }) {

  const toggleIsp = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((n) => n !== name));
    } 
    else {
      setSelected([...selected, name]);
    }

};

  const selectAll = () => setSelected(providers.map((p) => p.name));
  const deselectAll = () => setSelected([]);

  return (
    <div className="absolute p-1 bg-white border-2 border-gray-300 rounded-md z-[8000] w-[150px]">
    
      {/* Title */}
      <div className="text-xs font-semibold text-gray-700 ml-1">
        ISP (Area Expansion)
      </div>
      <button
        className="w-full pt-1 text-left cursor-pointer hover:bg-gray-100 flex justify-start items-center"
        onClick={() => setOpen(!open)}
      >
        <span className="text-xs px-1 text-gray-700">{open ? "Tutup" : "Pilih ISP"}</span>
        <IconSelector />
      </button>

      {open && (
        <div className="">
          <div className="border-y-2 border-gray-300 p-1 flex flex-row gap-2">
            <button
              className="flex-1 bg-blue-500 text-white rounded text-xs py-1 hover:bg-blue-600 transition-colors"
              onClick={selectAll}
            >
              All
            </button>
            <button
              className="flex-1 bg-gray-400 text-white rounded text-xs py-1 hover:bg-gray-500 transition-colors"
              onClick={deselectAll}
            >
              None
            </button>
          </div>

          {providers.map((p) => (
            <label
              key={p.name}
              className="flex justify-between items-cener text-sm hover:bg-gray-100 cursor-pointer py-1 text-xs"
            >
              {/* Left side: checkbox + name */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(p.name)}
                  onChange={() => toggleIsp(p.name)}
                />
                <span>{p.name}</span>
              </div>

              {/* Right side: color circle */}
              <div className={`w-4 h-4 rounded-full bg-${p.color}`} />
              </label>
            ))}
        </div>
      )}
    </div>
  );
}
