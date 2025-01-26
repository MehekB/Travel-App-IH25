# **ZipTrip**  

### 🌍 **Plan your perfect day, effortlessly!**  
ZipTrip is your personalized itinerary generator. Discover activities near you, organize them into an optimized plan, and make your trips stress-free and exciting.  

---

## **How It Works**  
1. **Enter Your Preferences**: Provide your location and the type of activities you're looking for.  
2. **Explore Results**: Browse nearby suggestions tailored to your input.  
3. **Select Activities**: Pick the ones you like from the results.  
4. **Generate Itinerary**: Let AI create an optimized schedule for your day.  
5. **Save and Share**: Download your itinerary as a PDF for easy reference.  

---

## **Getting Started**  
Follow these steps to set up the project locally:  

### **Prerequisites**  
- Node.js installed (v14 or above).  
- A Mapbox API key and Google Generative AI API key.  

### **Installation and SetUp**  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/ziptrip.git
   cd ziptrip
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following:
    ```env
    REACT_APP_MAPBOX_API_KEY=your_mapbox_api_key
    REACT_APP_GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
    ```

4. Start the development server:
    ```bash
    npm start
    ```