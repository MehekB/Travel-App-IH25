import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import './Itinerary.css';


const ai_generate = async (activities, startTime) => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const apiKey = process.env.REACT_APP_GOOGLE_GENERATIVE_AI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const locations = activities.map(activity => `${activity.name} at ${activity.address}`).join(", ");
    console.log(locations);
    console.log(startTime);
    const prompt = `Please create a detailed itinerary for the following activities, starting at ${startTime}. List each activity with the time range and activity description, without additional commentary. Prioritize proximity to minimize travel time between activities.

    Format the response like this:

    [${startTime}] - [end time]: Activity Name (Location)
    5:00 PM - 6:00 PM: Activity Name (Location)
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
    console.log("startTime rn: ", location.state?.startTime);

    
    const startTime = location.state?.startTime || "12:00 PM";

    useEffect(() => {
        const generateItinerary = async () => {
          console.log("Start time in Itinerary:", startTime);  // Check this log
          const generatedItinerary = await ai_generate(activities, startTime);
          setItinerary(generatedItinerary);
          console.log(itinerary);
        };
        
        if (activities.length > 0) {
          generateItinerary();
        }
    }, [activities, startTime]);

    // Function to generate PDF
    const handleSaveAsPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text("Your Custom Itinerary", 10, 10);

        // Add itinerary
        doc.setFontSize(12);
        if (itinerary) {
            const lines = itinerary.split('\n').filter(line => line.trim() !== '');
            lines.forEach((line, index) => {
                doc.text(line, 10, 20 + index * 10);
            });
        } else {
            doc.text("Loading your itinerary...", 10, 20);
        }

        // Save PDF
        doc.save("itinerary.pdf");
    };

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
                <center><button onClick={handleSaveAsPDF} className="pdf-button">
                        Save as PDF
                </button></center>
            </div>
        </div>
    );
}

export default Itinerary;