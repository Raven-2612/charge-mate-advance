import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface Station {
  id: number;
  name: string;
  position: [number, number];
  address: string;
  chargerTypes: string[];
  available: boolean;
  city: string;
}

interface LocationState {
  selectedStation: Station;
  nearbyStations: Station[];
}

function BookSlot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedStation, nearbyStations } = location.state as LocationState || {
    selectedStation: null,
    nearbyStations: []
  };

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showNearbyStations, setShowNearbyStations] = useState(false);

  // If no station is selected, redirect to find-station
  if (!selectedStation) {
    navigate('/find-station');
    return null;
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time for your booking.');
      return;
    }

    // Simulate booking success
    alert('Booking confirmed! Your slot has been reserved.');
    navigate('/');
  };

  const handleStationChange = (station: Station) => {
    navigate('/book-slot', { 
      state: { 
        selectedStation: station,
        nearbyStations: nearbyStations.filter(s => s.id !== station.id)
      },
      replace: true
    });
    setShowNearbyStations(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to="/find-station"
          className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Station Finder
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Book a Charging Slot</h1>

        {/* Station Details */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Selected Station</h2>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{selectedStation.name}</span>
                </div>
                <p className="text-gray-600 ml-7">{selectedStation.address}</p>
                <p className="text-gray-600 ml-7">{selectedStation.city}</p>
                <div className="flex items-center text-gray-600 ml-7">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Operating Hours: 9:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNearbyStations(!showNearbyStations)}
                className="px-4 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                Change Station
              </button>
              {showNearbyStations && nearbyStations.length > 0 && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-2">
                    <h3 className="px-4 py-2 text-sm font-medium text-gray-700">
                      Nearby Stations in {selectedStation.city}
                    </h3>
                    {nearbyStations.map((station) => (
                      <button
                        key={station.id}
                        onClick={() => handleStationChange(station)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="font-medium">{station.name}</div>
                        <div className="text-gray-500 text-xs">{station.address}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`p-2 text-sm rounded-md border ${
                    selectedTime === time
                      ? 'bg-green-600 text-white border-transparent'
                      : 'border-gray-300 text-gray-700 hover:border-green-500'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Selected Station</span>
              <span className="font-medium">{selectedStation.name}</span>
            </div>
            {selectedDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex justify-between">
                <span className="text-gray-600">Time Slot</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Charging Rate</span>
              <span className="font-medium">₹0/kWh (Educational Purpose)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Booking Fee</span>
              <span className="font-medium">₹0 (Educational Purpose)</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Total Amount</span>
                <span className="font-medium text-gray-900">₹0 (Educational Purpose)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Book Now Button */}
        <div className="mt-8">
          <button
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
          >
            Confirm Booking
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">
            Note: This is an educational project. No actual payment will be processed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookSlot;