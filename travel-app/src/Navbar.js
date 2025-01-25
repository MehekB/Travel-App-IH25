import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src="/ziptrip.png" alt="ZipTrip Logo" className="logo-image" />
        <h1 className="logo">ZipTrip</h1>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/transportation">Transportation</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

/* "/Users/riadhingra/Work/IrvineHacks/Travel-App-IH25/ziptrip.png" */