import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
	const [roomCode, setRoomCode] = useState("");
	const navigate = useNavigate();

	const handleJoinRoom = (e) => {
		e.preventDefault();
		const code = roomCode.trim().toUpperCase();
		if (code.length === 5) {
			navigate(`/room/${code}`);
			setRoomCode("");
		}
	};

	return (
		<nav className="navbar">
			<Link to="/" className="navbar-logo">
                Image  Dump
			</Link>

			<form className="room-code-form" onSubmit={handleJoinRoom}>
				<input
					type="text"
					className="room-code-input"
					placeholder="Enter room code"
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

			<div className="navbar-links">
				<Link to="/">Home</Link>
				<Link to="/my-rooms">Rooms</Link>
				<Link to="/archive">Archive</Link>
				<Link to="/upload">Upload</Link>
			</div>
		</nav>
	);
}
