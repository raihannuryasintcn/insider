import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LegendControl from '../components/Map/LegendControl';
import TotalIspControl from '../components/map/HoverControl';
import DropdownControl from '../components/map/DropdownControl';
import MarketShareControl from '../components/map/MarketShareChartControl';
import Loading from '../components/custom/Loading'; // Asumsi ada komponen loading
import { Card, CardContent } from '../components/ui/card'; // Asumsi ada komponen Card dari shadcn/ui
import { useEffect, useState } from 'react';
import internetServiceProviders from './isp.json';
import { Marker, Tooltip } from 'react-leaflet';
import { divIcon } from "leaflet";

// URL untuk TileLayer peta
const MAP_TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

const createCustomIcon = (color) => {
    return divIcon({
        html: `<div class="w-[30px] h-[30px] rounded-full border border-gray-800 bg-${color}"></div>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    })
}

const offsetPosition = (lat, lng, index, total) => {
  const radius = 0.03; // atur di sini (misal 0.01 = 1000 meter)
  const angle = (index / total) * 2 * Math.PI; // distribusi melingkar
  const offsetLat = lat + radius * Math.sin(angle);
  const offsetLng = lng + radius * Math.cos(angle);
  return [offsetLat, offsetLng];
};

const useMapData = () => {
  const [geoData, setGeoData] = useState(null);
  const [totalIsp, setTotalIsp] = useState(0);
  const [totalJartup, setTotalJartup] = useState(0);
  const [totalJartaplok, setTotalJartaplok] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const primaryApiUrl = import.meta.env.VITE_ISP_API_URL;
    const fallbackApiUrl = "http://localhost:3000/api/isp";
    const geoJsonPath = '/geodata.geojson'; // Path relatif ke public folder

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch geodata (selalu dari local)
        const geodataPromise = fetch(geoJsonPath).then(res => {
          if (!res.ok) {
            throw new Error(`Gagal mengambil geodata: ${res.status}`);
          }
          return res.json();
        });

        // Fetch ISP summary dengan mekanisme fallback
        let ispDataPromise;
        if (primaryApiUrl) {
          ispDataPromise = fetch(`${primaryApiUrl}/summary`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`Server utama gagal: ${res.status}`);
              }
              return res.json();
            })
            .catch(async (primaryError) => {
              console.warn("Server utama gagal, mencoba localhost...", primaryError.message);
              // Fallback ke localhost
              const fallbackRes = await fetch(`${fallbackApiUrl}/summary`);
              if (!fallbackRes.ok) {
                throw new Error(`Server fallback gagal: ${fallbackRes.status}`);
              }
              return fallbackRes.json();
            });
        } else {
          ispDataPromise = fetch(`${fallbackApiUrl}/summary`).then(res => {
            if (!res.ok) {
              throw new Error(`Server localhost gagal: ${res.status}`);
            }
            return res.json();
          });
        }

        // Eksekusi kedua promise secara paralel
        const [geojsonResult, ispDataResult] = await Promise.all([geodataPromise, ispDataPromise]);

        // Gabungkan data ISP ke GeoJSON berdasarkan nama provinsi
        geojsonResult.features.forEach(feature => {
          const provinceName = feature.properties.name;
          const info = ispDataResult[provinceName];
          feature.properties.total_isp = info ? info.total_isp : 0;
          feature.properties.total_jartup = info ? info.total_jartup : 0;
          feature.properties.total_jartaplok = info ? info.total_jartaplok : 0;
        });
        setGeoData(geojsonResult);

        // Hitung total ISP, JARTUP, dan JARTAPLOK
        const ispSummaryValues = Object.values(ispDataResult);
        const calculatedTotalIsp = ispSummaryValues.reduce((sum, info) => sum + (info ? info.total_isp : 0), 0);
        const calculatedTotalJartup = ispSummaryValues.reduce((sum, info) => sum + (info ? info.total_jartup : 0), 0);
        const calculatedTotalJartaplok = ispSummaryValues.reduce((sum, info) => sum + (info ? info.total_jartaplok : 0), 0);

        setTotalIsp(calculatedTotalIsp);
        setTotalJartup(calculatedTotalJartup);
        setTotalJartaplok(calculatedTotalJartaplok);

      } catch (err) {
        console.error("Error fetching map data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  return { geoData, totalIsp, totalJartup, totalJartaplok, isLoading, error };
};



export default function HomePage() {
  const { geoData, totalIsp, totalJartup, totalJartaplok, isLoading, error } = useMapData();
  const [selectedProvider, setSelectedProvider] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);



  const styleByFeature = (feature) => ({
    color: '#333',
    weight: 1,
    fillColor: feature.properties.color || '#ccc', // Menggunakan warna dari properti atau default
    fillOpacity: 0.6,
  });

  /**
   * Fungsi yang dijalankan untuk setiap fitur GeoJSON, menambahkan tooltip.
   * @param {object} feature - Objek fitur GeoJSON.
   * @param {object} layer - Objek layer Leaflet yang terkait dengan fitur.
   */
  
  const onEachFeature = (feature, layer) => {
    const { name, region, total_isp, total_jartup, total_jartaplok } = feature.properties;
    layer.bindTooltip(
      `<strong>${name}</strong><br/>Wilayah: ${region}<br/>Total ISP: ${total_isp}<br/>JARTUP: ${total_jartup}<br/>JARTAPLOK: ${total_jartaplok}`,
      { sticky: true }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
        <p className="ml-2 text-gray-600">Memuat data peta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="p-6 bg-red-100 border-red-400 text-red-700">
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h2>
            <p>Gagal memuat data peta: {error.message}</p>
            <p className="text-sm mt-2">Mohon coba lagi nanti atau hubungi administrator.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='w-full h-[calc(100vh-90px)]'>
      <div className="flex flex-row items-center justify-between mb-4">
        <span className="text-2xl font-bold text-gray-800">Peta Nasional ISP</span>
        <p className="text-sm text-gray-500 ml-2 justify-center my-auto font-semibold">Nasional - Last Updated W4 Mei 25</p>
      </div>
      {/* Wrap MapContainer in a responsive aspect ratio container */}
      <div className="w-full h-[calc(100%-7%)] relative">
        <MapContainer center={[-2.0, 115.0]} zoomControl={false} zoom={5} className="w-full h-full rounded-lg">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url={MAP_TILE_URL}
          />
          {internetServiceProviders
                    .filter(p => selectedProvider.includes(p.name))
                    .flatMap((p) =>
                        p.locations.map((location, locationIndex) => (
                            <Marker
                                key={`${p.name}-${locationIndex}`}
                                position={offsetPosition(location.lat, location.lng, locationIndex, p.locations.length)}
                                icon={createCustomIcon(p.color)}
                            >
                                <Tooltip direction="bottom" offset={[0, 10]} opacity={1} permanent={false}> {/*permanent={false} to show tooltip on hover*/}
                                    <div className="flex flex-col items-center">
                                        <div className="font-semibold text-sm mb-0.5 text-gray-800">
                                            {p.name}

                                        </div>
                                        <div className="text-xs text-gray-700">
                                            {location.city}
                                        </div>
                                    </div>
                                </Tooltip>
                            </Marker>
                        ))
                    )}
                {/* </MarkerClusterGroup> */}
          {geoData && (
            <>
              <GeoJSON data={geoData} style={styleByFeature} onEachFeature={onEachFeature} />
              <LegendControl />
              <TotalIspControl totalIsp={totalIsp} totalJartup={totalJartup} totalJartaplok={totalJartaplok} />
              <DropdownControl providers={internetServiceProviders} selected={selectedProvider} setSelected={setSelectedProvider} />
              <MarketShareControl />
            </>
          )}
        </MapContainer>            
      </div>
    </div>
  );
}