import './Results.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const { location: userLocation, activity, time } = location.state || {};
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const MAPBOX_ACCESS_TOKEN = "placeholder";
  
  // Function to get coordinates for the entered location
  const fetchCoordinates = async (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].center; // [longitude, latitude]
    }
    throw new Error('Location not found');
  };

  // Function to fetch nearby places using Mapbox Search Box API
  const fetchPlaces = async (longitude, latitude, query) => {
    const url = `https://api.mapbox.com/search/searchbox/v1/search?access_token=${MAPBOX_ACCESS_TOKEN}&proximity=${longitude},${latitude}&query=${query}&limit=5`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results) {
      return data.results;
    }
    throw new Error('No results found');
  };

  // Fetch results on component load
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Step 1: Get coordinates for the entered location
        const [longitude, latitude] = await fetchCoordinates(userLocation);

        // Step 2: Use the coordinates to fetch nearby places
        const places = await fetchPlaces(longitude, latitude, activity);

        // Step 3: Update state with the results
        setResults(places);
      } catch (err) {
        setError(err.message);
      }
    };

    if (userLocation && activity) {
      fetchResults();
    }
  }, [userLocation, activity]);

  return (
    <div>
        <div className="data">
            <h1>Search Results</h1>
            <p><strong>Location:</strong> {userLocation}</p>
            <p><strong>Activity:</strong> {activity}</p>
            <p><strong>Time:</strong> {time}</p>
        </div>
        
      
      {/* You can replace this placeholder with actual search results or API data */}
      <div className="results">
      <h1>Search Results</h1>
      {error && <p className="error">{error}</p>}
      {results.length > 0 ? (
        <ul>
          {results.map((place, index) => (
            <li key={index}>
              <h3>{place.name}</h3>
              <p>{place.address}</p>
              <p>Distance: {place.distance} meters</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading results...</p>
      )}
    </div>
    </div>
  );
}

export default Results;