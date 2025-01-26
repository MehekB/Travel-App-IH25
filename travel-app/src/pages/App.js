import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar'; // Import the reusable Navbar
import { useNavigate } from 'react-router-dom';
import './App.css';
import About from './About';
import Results from './Results';
import Transportation from './Transportation';
import Itinerary from './Itinerary';

function Home() {
  const [currentLocation, setCurrentLocation] = useState('');
  const [activityType, setActivityType] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [visibleResultsCount, setVisibleResultsCount] = useState(5); // Number of results to display
  const navigate = useNavigate();

  const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_KEY;


  const handleCheckboxChange = (activity) => {
    setSelectedActivities((prevSelected) => {
      // Check if the activity with the same id already exists
      const isActivitySelected = prevSelected.some(
        (selectedActivity) => selectedActivity.id === activity.id
      );
  
      // If it doesn't exist, add it; otherwise, remove it
      if (isActivitySelected) {
        return prevSelected.filter(
          (selectedActivity) => selectedActivity.id !== activity.id
        );
      } else {
        return [...prevSelected, activity]; // Add the new activity to the list
      }
    });
  };


  // Results Logic
  const fetchResults = async (location, activity) => {

    console.log(MAPBOX_ACCESS_TOKEN);

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
      const url = `${baseUrl}/${encodedActivity}?access_token=${MAPBOX_ACCESS_TOKEN}&language=en&limit=25&proximity=${longitude},${latitude}`;

      console.log("Fetching URL:", url);

      try {
        // Fetch POIs from Mapbox
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.features) {
          console.log("Nearby POIs:", data);
          if (data.features && data.features.length > 0) {
            return data.features.map((feature) => {
              const poi = {
                name: feature.properties.name,
                address: feature.properties.full_address,
                category: feature.properties.poi_category?.join(", ") || "N/A",
                distance: calculateDistance(longitude, latitude, feature.geometry.coordinates[0], feature.geometry.coordinates[1]),
                id: feature.properties.id || feature.geometry.coordinates,
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

      const distanceInMeters = R * c;
      const distanceInMiles = distanceInMeters / 1609.344;
      return distanceInMiles.toFixed(2); // Distance in meters
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
    setVisibleResultsCount(5);
    setResults(fetchResults(currentLocation, activityType));
  }, 3000);
  };

  const handleGenerateMoreIdeas = () => {
    setVisibleResultsCount((prevCount) => prevCount + 5);
  };

  const formatTo12HourTime = (time) => {
    const [hour, minute] = time.split(':');
    const formattedHour = (hour % 12) || 12; // Adjust hour to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${formattedHour}:${minute} ${period}`;
  };
  
  const handleGenerateItinerary = () => {
    const formattedStartTime = formatTo12HourTime(travelTime);
    navigate("/itinerary", {
      state: { selectedActivities, startTime: formattedStartTime }
    });
  };

  return (
    <div>
      <h1 className="header">What's on your bucket list for the day?</h1>
      {loading ? (
        <div className="loading-container">
          <p className="loading-text"> Finding you the best spots...</p>
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
          {results.slice(0, visibleResultsCount).map((result, index) => (
              <li key={`${result.id}-${index}`} className="result-item">
                  <input
                    type="checkbox"
                    checked={selectedActivities.some(activity => activity.id === result.id)}
                    onChange= {() => {
                      console.log("Selected activity ID:", result.id);  // Log result.id here
                      handleCheckboxChange(result);
                    }}
                  />
                   <label>
                    <span className="place-name">{result.name}</span>
                    <span className="place-address">
                      <span role="img" aria-label="location pin">📍</span> {result.address}
                    </span>
                    <span className="place-distance">
                      <span role="img" aria-label="distance">🚘</span> {result.distance} miles
                    </span> 
                </label>
              </li>
            ))}
          </ul>
          {visibleResultsCount < results.length && (
            <button className="generate-more-button" onClick={handleGenerateMoreIdeas}>
              Generate More Ideas
            </button>
          )}
          <p>
            You Selected -- {selectedActivities.length}{' '}
            {selectedActivities.length === 1 ? 'activity' : 'activities'}
            : {selectedActivities.map((activity) => activity.name).join(', ')}
          </p>
          <button className="generate-itinerary-button" onClick={handleGenerateItinerary}>Generate Itinerary</button>
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
          <Route path="/itinerary" element={<Itinerary />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
