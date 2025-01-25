import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar'; // Import the reusable Navbar
import './App.css';
import About from './About';
import Transportation from './Transportation';

function App() {
  return (
    <Router>
     <div className="App">
      <Navbar />
      <Routes>
        <Route path="/">Home</Route>
        <Route path="/transportation" element={<Transportation />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
