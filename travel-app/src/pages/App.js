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
  const navigate = useNavigate(); 

  const handleSearch = () => {
    setLoading(true);

    setTimeout(() => {
    console.log("Search clicked!");
    console.log("Location:", currentLocation);
    console.log("Activity Type:", activityType);
    console.log("Travel Time:", travelTime);

    setLoading(false);
    navigate('/results', {
      state: {
        location: currentLocation,
        activity: activityType,
        time: travelTime,
      },
    });
  }, 3000);
    // Add logic here to perform the search (e.g., API call or navigation)
  };

  return (
    <div>
      <h1 className="header">Ready to explore? Let's make it happen!</h1>
      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p className="loading-text"> Finding the best spots...</p>
        </div>
      ) : (
        <div className="search-bar">
        {/* Location Input */}
        <div>
          <label htmlFor="location">📍Location:</label>
          <input
            id="location"
            type="text"
            placeholder="Enter your location"
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
            <option value="eating">Eating</option>
            <option value="shopping">Shopping</option>
            <option value="coffee">Coffee</option>
            <option value="nature">Nature</option>
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
