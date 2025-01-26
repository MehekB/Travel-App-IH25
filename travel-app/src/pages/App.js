import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar'; // Import the reusable Navbar
import { useNavigate } from 'react-router-dom';
import './App.css';
import About from './About';
import Results from './Results';
import Transportation from './Transportation';

function Home() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [activityType, setActivityType] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 
  const [selectedActivities, setSelectedActivities] = useState([]);

  const handleCheckboxChange = (activityID) => {
    setSelectedActivities((prevSelected) =>
      prevSelected.includes(activityID)
      ? prevSelected.filter((id) => id !== activityID)
      : [...prevSelected, activityID]
    );
  };


  // Results Logic
  const fetchResults = async (location, activity) => {
    const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibWVoZWtiIiwiYSI6ImNtNmJ4MnNldjBjdDcycW9uaHprYzVwZTgifQ.R85l-MzGDtVM4N-Srd01Ig";

    const fetchCoordinates = async (location) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
    
      try {
        const response = await fetch(url);
        const data = await response.json();
    
        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          console.log("Longitude: ", longitude, "Latitude: ", latitude);
          return { longitude, latitude };
        } else {
          throw new Error("Address not found");
        }
      } catch (error) {
        console.error("Geocoding Error:", error);
        return null;
      }
    };

    // Fetch POIs from Mapbox based on the activity and proximity to the user location
    const fetchPOIs = async () => {
      const baseUrl = `https://api.mapbox.com/search/searchbox/v1/category`;

      // Encode the activity (e.g., "coffee")
      const encodedActivity = encodeURIComponent(activity);

      // Get coordinates (longitude, latitude) for the user address
      const { longitude, latitude } = await fetchCoordinates(location);
      if (!longitude || !latitude) return []; // If coordinates are not found, exit

      // Construct the URL for POI search with proximity
      const url = `${baseUrl}/${encodedActivity}?access_token=pk.eyJ1IjoibWVoZWtiIiwiYSI6ImNtNmJ4MnNldjBjdDcycW9uaHprYzVwZTgifQ.R85l-MzGDtVM4N-Srd01Ig&language=en&limit=5&proximity=${longitude},${latitude}`;

      console.log("Fetching URL:", url);

      try {
        // Fetch POIs from Mapbox
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          console.log("Nearby POIs:", data);
          if (data.features && data.features.length > 0) {
            return data.features.map((feature) => {
              const poi = {
                name: feature.properties.name,
                address: feature.properties.full_address,
                category: feature.properties.poi_category?.join(", ") || "N/A",
                distance: calculateDistance(longitude, latitude, feature.geometry.coordinates[0], feature.geometry.coordinates[1]),
                id: feature.properties.id, // Unique id for each place
              };
              return poi;
            });
          } else {
            console.warn("No features found in the response.");
            return [];
          }
        } else {
          console.error("API Error:", data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
      return [];
    };

    // Haversine formula to calculate the distance between two points (in meters)
    const calculateDistance = (lon1, lat1, lon2, lat2) => {
      const R = 6371e3; // Earth radius in meters
      const φ1 = lat1 * (Math.PI / 180); // Convert lat1 to radians
      const φ2 = lat2 * (Math.PI / 180); // Convert lat2 to radians
      const Δφ = (lat2 - lat1) * (Math.PI / 180); // Difference in latitudes
      const Δλ = (lon2 - lon1) * (Math.PI / 180); // Difference in longitudes

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c; // Distance in meters
    };

    try {
      // Fetch POIs directly using the user-provided location and activity
      const places = await fetchPOIs();
      console.log(places);

      if (places.length > 0) {
        setResults(places); // Update results
      } else {
        setError("No results found for the specified query.");
      }
    } catch (err) {
      setError(err.message);
    }

  }



  const handleSearch = () => {
    setLoading(true);

    setTimeout(() => {
    console.log("Search clicked!");
    console.log("Location:", currentLocation);
    console.log("Activity Type:", activityType);
    console.log("Travel Time:", travelTime);

    setLoading(false);
    setResults(fetchResults(currentLocation, activityType));
  }, 3000);
    // Add logic here to perform the search (e.g., API call or navigation)
  };

  return (
    <div>
      <h1 className="header">Ready to explore? Let's make it happen!</h1>
      {loading ? (
        <div className="loading-container">
          <p className="loading-text"> Finding the best spots...</p>
          <div className="loading-spinner"></div> 
        </div>
      ) : (
        <div className="search-bar">
        {/* Location Input */}
        <div>
          <label htmlFor="location">📍Location:</label>
          <input
            id="location"
            type="text"
            placeholder="Enter current address"
            value={currentLocation}
            onChange={(e) => setCurrentLocation(e.target.value)}
          />
        </div>

        {/* Activity Type Dropdown */}
        <div>
          <label htmlFor="activityType">🎯 Type of Activity:</label>
          <select
            id="activityType"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option value="" disabled>
              Select an activity
            </option>
            <option value="food">Food</option>
            <option value="shopping">Shopping</option>
            <option value="coffee">Coffee</option>
            <option value="park">Parks</option>
            <option value="nightlife">Nightlife</option>
          </select>
        </div>

        {/* Travel Time Input */}
        <div>
          <label htmlFor="travelTime">⏰ Time of Travel:</label>
          <input
            id="travelTime"
            type="time"
            value={travelTime}
            onChange={(e) => setTravelTime(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div>
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      )}

      {/* Render Results Component with Data */}
      {results.length > 0 && !loading && (
        <div className="results">
          <h2>Results:</h2>
          <ul>
            {results.map((result) => (
              <li key={results.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(results.id)}
                    onChange= {() => handleCheckboxChange(results.id)}
                  />
                  <span>
                    <strong>{result.name}</strong> - {result.address} (
                      {result.distance} meters away)
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <p>
            You Selected: {selectedActivities.length}{' '}
            {selectedActivities.length === 1 ? 'activity' : 'activities'}
          </p>
          </div>
      )}

      {/* Display Error Message */}
      {error && <p>{error}</p>}
    </div>
  );
}

function App() {
  return (
      <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/transportation" element={<Transportation />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
