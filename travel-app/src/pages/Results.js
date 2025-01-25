import './Results.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const { location: userLocation, activity, time } = location.state || {};
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  
  const fetchCoordinates = async () => {
    const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibWVoZWtiIiwiYSI6ImNtNmJ4MnNldjBjdDcycW9uaHprYzVwZTgifQ.R85l-MzGDtVM4N-Srd01Ig";
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(userLocation)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;
  
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

  const testCall = async () => {
    const baseUrl = `https://api.mapbox.com/search/searchbox/v1/category`;
  
    // Encode the activity (e.g., "coffee")
    const encodedActivity = encodeURIComponent(activity);
  
    // Get coordinates (longitude, latitude) for the user address
    const { longitude, latitude } = await fetchCoordinates(userLocation);
    if (!longitude || !latitude) return; // If coordinates are not found, exit
  
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
            return data.features.map((feature) => ({
              name: feature.properties.name,
              address: feature.properties.full_address,
              category: feature.properties.poi_category?.join(", ") || "N/A",
              distance: feature.properties.coordinates?.distance || "N/A",
            }));
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
  };

  // Fetch results on component load
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch POIs directly using the user-provided location and activity
        const places = await testCall();
        console.log(places);
        
        if (places.length > 0) {
          setResults(places); // Update results
        } else {
          setError("No results found for the specified query.");
        }
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