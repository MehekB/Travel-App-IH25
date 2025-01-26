import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // To access passed data
import './Itinerary.css';


const ai_generate = async (activities, startTime) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI("AIzaSyBsW0izPoEQ8cHLc0mveXQfCk6gjlf7gtg");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const locations = activities.map(activity => `${activity.name} at ${activity.address}`).join(", ");
    console.log(locations);
    const prompt = `Please create a detailed itinerary for the following activities, starting at ${startTime}. List each activity with the time range and activity description, without additional commentary. Prioritize proximity to minimize travel time between activities.

    Format the response like this:

    12:00 PM - 1:00 PM: Activity Name (Location)
    1:00 PM - 2:00 PM: Activity Name (Location)
    ...and so on.

    Make sure it starts at the given start time. Do not include any extra explanations or details. Not even notes.

    Activities: ${locations}
    `;

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return result.response.text();
}

function Itinerary () {
    const location = useLocation();
    const [itinerary, setItinerary] = useState(null);
    const activities = location.state?.selectedActivities || [];
    const startTime = location.state?.startTime || "12:00 PM";

    useEffect(() => {
        const generateItinerary = async () => {
        const generatedItinerary = await ai_generate(activities, startTime);
        setItinerary(generatedItinerary);
        console.log(itinerary);
    };
    
    if (activities.length > 0) {
      generateItinerary();
    }
  }, [activities, startTime]);

    const cleanItinerary = itinerary
    ? itinerary.split('\n').filter(line => line.trim() !== '').map((line, index) => <li key={index}>{line}</li>)
    : [];

    return (
        <div>
            <h1 className='header'>
                <center>Your Custom Itinerary</center>
            </h1>
            <div className="image-container">
                <img src="/notebook.png" alt="notebook background paper" className="notebook-bg" />
                <div className="text-overlay">
                    <p>This is your itinerary:</p>
                    <ol className="itinerary-list">
                        {itinerary ? (
                            itinerary.split('\n').filter(line => line.trim() !== '').map((line, index) => <li key={index}>{line}</li>)
                        ) : (
                            <li>Loading your itinerary...</li>
                        )}
                    </ol>
                </div>
            </div>
        </div>
    );
}

export default Itinerary;