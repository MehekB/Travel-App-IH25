import './Results.css';
import React from 'react';

function Results({ location, activity, time, results }) {
  return (
    <div>
      <div className="data">
        <h1>Search Results</h1>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Activity:</strong> {activity}</p>
        <p><strong>Time:</strong> {time}</p>
      </div>

      <div className="results">
        <h2>Results:</h2>
        {results.length > 0 ? (
          <ul>
            {results.map((place) => (
              <li key={place.id}>
                <h3>{place.name}</h3>
                <p>{place.address}</p>
                <p>Category: {place.category}</p>
                <p>Distance: {place.distance.toFixed(2)} meters</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default Results;