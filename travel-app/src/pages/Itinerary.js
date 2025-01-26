import React from "react";
import './Itinerary.css';


const ai_generate = async () => {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI("AIzaSyBsW0izPoEQ8cHLc0mveXQfCk6gjlf7gtg");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Given the following locations, starting time, and distances from the starting location, make an efficient and fun itinerary for the user: ...";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

function Itinerary () {

    return (
        <div>
            <h1 className='header'><center>Your Custom Itinerary</center></h1>
            <div className="image-container">
                <img src="/notebook.png" alt="notebook background paper" className="notebook-bg" />
                <div className="text-overlay">
                    This is text on top of the image
                    <ol className="itinerary-list">
                        <li>Time - Time: Place 1 </li>
                        <li>Time - Time: Place 2 </li>
                        <li>Time - Time: Place 3 </li>
                        <li>Time - Time: Place 4 </li>
                    </ol>
                </div>
            </div>
        </div>

    );
}

export default Itinerary;