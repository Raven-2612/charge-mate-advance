import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sample charging stations data across India
const allChargingStations = [
  {
    id: 1,
    name: 'EV Charging Hub - MG Road',
    position: [12.9716, 77.5946], // Bangalore
    address: 'MG Road, Bangalore',
    chargerTypes: ['Level 2', 'DC Fast'],
    available: true,
    city: 'Bangalore'
  },
  {
    id: 2,
    name: 'Delhi EV Station',
    position: [28.6139, 77.2090], // Delhi
    address: 'Connaught Place, New Delhi',
    chargerTypes: ['DC Fast'],
    available: true,
    city: 'Delhi'
  },
  {
    id: 3,
    name: 'Mumbai Central Charging',
    position: [19.0760, 72.8777], // Mumbai
    address: 'Mumbai Central, Mumbai',
    chargerTypes: ['Level 2', 'DC Fast'],
    available: true,
    city: 'Mumbai'
  },
  {
    id: 4,
    name: 'Chennai EV Point',
    position: [13.0827, 80.2707], // Chennai
    address: 'Marina Beach Road, Chennai',
    chargerTypes: ['Level 2'],
    available: true,
    city: 'Chennai'
  },
  {
    id: 5,
    name: 'Kolkata Charging Hub',
    position: [22.5726, 88.3639], // Kolkata
    address: 'Park Street, Kolkata',
    chargerTypes: ['DC Fast'],
    available: true,
    city: 'Kolkata'
  },
  {
    id: 6,
    name: 'Hyderabad Tech Park',
    position: [17.3850, 78.4867], // Hyderabad
    address: 'HITEC City, Hyderabad',
    chargerTypes: ['Level 2', 'DC Fast'],
    available: true,
    city: 'Hyderabad'
  },
  {
    id: 7,
    name: 'Pune EV Station',
    position: [18.5204, 73.8567], // Pune
    address: 'Koregaon Park, Pune',
    chargerTypes: ['Level 2'],
    available: true,
    city: 'Pune'
  },
  {
    id: 8,
    name: 'Ahmedabad Green Charge',
    position: [23.0225, 72.5714], // Ahmedabad
    address: 'SG Highway, Ahmedabad',
    chargerTypes: ['DC Fast'],
    available: true,
    city: 'Ahmedabad'
  },
  {
    id: 9,
    name: 'Jaipur EV Hub',
    position: [26.9124, 75.7873], // Jaipur
    address: 'MI Road, Jaipur',
    chargerTypes: ['Level 2', 'DC Fast'],
    available: true,
    city: 'Jaipur'
  },
  {
    id: 10,
    name: 'Lucknow Central',
    position: [26.8467, 80.9462], // Lucknow
    address: 'Hazratganj, Lucknow',
    chargerTypes: ['Level 2'],
    available: true,
    city: 'Lucknow'
  }
];

// Component to update map center when search changes
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

function FindStation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    distance: '5',
    chargerType: 'all',
  });
  const [center, setCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center
  const [filteredStations, setFilteredStations] = useState(allChargingStations);
  const searchTimeoutRef = useRef<number>();

  const handleStationSelect = (station: typeof allChargingStations[0]) => {
    navigate('/book-slot', { 
      state: { 
        selectedStation: station,
        nearbyStations: allChargingStations.filter(s => 
          s.id !== station.id && 
          s.city === station.city
        )
      } 
    });
  };

  // Function to simulate geocoding (in real app, use a geocoding service)
  const simulateGeocode = (query: string) => {
    // Simple simulation - just find a station that matches the query
    const matchingStation = allChargingStations.find(station => 
      station.name.toLowerCase().includes(query.toLowerCase()) ||
      station.address.toLowerCase().includes(query.toLowerCase()) ||
      station.city.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingStation) {
      return matchingStation.position;
    }
    return center;
  };

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      if (searchQuery) {
        const newCenter = simulateGeocode(searchQuery);
        setCenter(newCenter);

        const filtered = allChargingStations.filter(station => {
          const matchesSearch = 
            station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            station.city.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesType = 
            filters.chargerType === 'all' ||
            station.chargerTypes.some(type => 
              type.toLowerCase().includes(filters.chargerType.toLowerCase())
            );

          return matchesSearch && matchesType;
        });

        setFilteredStations(filtered);
      } else {
        setFilteredStations(allChargingStations);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by city or station..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Charger Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                  value={filters.chargerType}
                  onChange={(e) => setFilters({ ...filters, chargerType: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="level2">Level 2</option>
                  <option value="dc-fast">DC Fast Charger</option>
                </select>
              </div>
            </div>
          </div>

          {/* Station List */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Available Stations ({filteredStations.length})
            </h3>
            <div className="space-y-4">
              {filteredStations.map((station) => (
                <div 
                  key={station.id} 
                  className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleStationSelect(station)}
                >
                  <h4 className="font-medium text-gray-900">{station.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{station.address}</p>
                  <p className="text-sm text-gray-600">{station.city}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {station.chargerTypes.map((type) => (
                      <span key={type} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-green-600">
                      ● Available for booking
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
            <MapContainer
              center={center}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={center} />
              {filteredStations.map((station) => (
                <Marker 
                  key={station.id} 
                  position={station.position as [number, number]}
                  eventHandlers={{
                    click: () => handleStationSelect(station)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-medium text-gray-900">{station.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{station.address}</p>
                      <p className="text-sm text-gray-600">{station.city}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {station.chargerTypes.map((type) => (
                          <span key={type} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleStationSelect(station)}
                        className="mt-2 w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Book Slot
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindStation;