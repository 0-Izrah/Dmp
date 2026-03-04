import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar">
        <Link to="/" className="navbar-logo">
            📸 Image Dump
        </Link>
        <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/archive">Archive</Link>
            <Link to="/upload">Upload</Link>
        </div>
        </nav>
    );
}