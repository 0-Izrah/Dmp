import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
	const [roomCode, setRoomCode] = useState("");
	const navigate = useNavigate();
	const location = useLocation();

	const handleJoinRoom = (e) => {
		e.preventDefault();
		const code = roomCode.trim().toUpperCase();
		if (code.length === 5) {
			navigate(`/room/${code}`);
			setRoomCode("");
		}
	};

	// Check if user is currently viewing a room
	const roomMatch = location.pathname.match(/^\/room\/([A-Z0-9]{5})$/i);
	const currentRoomCode = roomMatch ? roomMatch[1] : null;

	return (
		<nav className="navbar">
			<Link to="/" className="navbar-logo">
                DMP
			</Link>

			{currentRoomCode ? (
				<div className="current-room-badge" style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
					Currently in Room: {currentRoomCode}
				</div>
			) : (
				<form className="room-code-form" onSubmit={handleJoinRoom}>
					<input
						type="text"
						className="room-code-input"
						placeholder=" JOIN ROOM : Enter room code "
						value={roomCode}
						onChange={(e) =>
							setRoomCode(e.target.value.toUpperCase().slice(0, 5))
						}
						maxLength={5}
					/>
					<button
						type="submit"
						className="room-code-btn"
						disabled={roomCode.trim().length !== 5}
					>
						→
					</button>
				</form>
			)}

			<div className="navbar-links">
				<Link to="/">Home</Link>
				<Link to="/my-rooms">Rooms</Link>
				<Link to="/archive">Archive</Link>
				<Link to="/manage">Manage</Link>
				<Link to="/upload">Upload</Link>
			</div>
		</nav>
	);
}
