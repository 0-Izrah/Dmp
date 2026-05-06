import { useState } from "react";
import { useMyRooms } from "../hooks/useRooms";
import { useDumps } from "../hooks/useDumps";

export default function MyRooms() {
	const { rooms, homeRoom, loading, createRoom, updateRoom, deleteRoom } = useMyRooms();
	const { dumps } = useDumps();
	const [newName, setNewName] = useState("");
	const [selectedDumps, setSelectedDumps] = useState([]);
	const [copied, setCopied] = useState(null);

	const handleCreate = async () => {
		if (!newName.trim()) return;
		await createRoom(newName, selectedDumps);
		setNewName("");
		setSelectedDumps([]);
	};

	const handleRename = async (code, currentName) => { const updatedName = window.prompt('Enter new room name:', currentName); if(updatedName && updatedName.trim() !== currentName) { await updateRoom(code, { name: updatedName }); } };

        const handleDelete = async (code) => { if(window.confirm('Are you sure you want to delete this room?')) { await deleteRoom(code); } };

        const toggleDump = (id) => {
		setSelectedDumps((prev) =>
			prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
		);
	};

	const copyCode = (code) => {
		navigator.clipboard.writeText(code);
		setCopied(code);
		setTimeout(() => setCopied(null), 2000);
	};

	if (loading) return <div className="loading">Loading your rooms...</div>;

	return (
		<div className="my-rooms">
			<h1>My Rooms</h1>
			<p
				style={{
					color: "var(--color-text-muted)",
					marginBottom: "2rem",
				}}
			>
				Create rooms and share the 5-digit code with friends.
			</p>

			{/* Home room — always shown first */}
			{homeRoom && (
				<div className="home-room">
					<h2>Your Home Room</h2>
					<div className="room-card home-room-card">
						<div className="room-card-code">{homeRoom.code}</div>
						<div className="room-card-info">
							<h3>{homeRoom.name}</h3>
							<span>This is your permanent room code</span>
						</div>
						<div style={{ display: "flex", gap: "0.5rem" }}>
							<button
								className="copy-btn"
								onClick={() => copyCode(homeRoom.code)}
							>
								{copied === homeRoom.code ? "✓ Copied" : "Copy Code"}
							</button>
							<button
								className="copy-btn"
								style={{ background: "var(--color-surface)" }}
								onClick={() => handleRename(homeRoom.code, homeRoom.name)}
							>
								Rename
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Other rooms */}
			{rooms.filter((r) => r.code !== homeRoom?.code).length > 0 && (
				<>
					<h2 style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
						Other Rooms
					</h2>
					<div className="rooms-list">
						{rooms
							.filter((r) => r.code !== homeRoom?.code)
							.map((room) => (
								<div key={room._id} className="room-card">
									<div className="room-card-code">{room.code}</div>
									<div className="room-card-info">
										<h3>{room.name}</h3>
										<span>{room.dumps?.length || 0} dumps</span>
									</div>
									<div style={{ display: "flex", gap: "0.5rem" }}>
										<button
											className="copy-btn"
											onClick={() => copyCode(room.code)}
										>
											{copied === room.code ? "✓ Copied" : "Copy Code"}
										</button>
										<button
											className="copy-btn"
											style={{ background: "var(--color-surface)" }}
											onClick={() => handleRename(room.code, room.name)}
										>
											Rename
										</button>
										<button
											className="copy-btn"
											style={{ background: "#993333", color: "white" }}
											onClick={() => handleDelete(room.code)}
										>
											Delete
										</button>
									</div>
								</div>
							))}
					</div>
				</>
			)}

			{/* Create new room */}
			<div className="create-room" style={{ marginTop: "2rem" }}>
				<h2>Create New Room</h2>
				<input
					type="text"
					placeholder="Room name (e.g., 'MAY')"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
				/>

				{dumps.length > 0 && (
					<div className="dump-picker">
						<p>Select dumps to include:</p>
						{dumps.map((d) => (
							<label key={d._id} className="dump-checkbox">
								<input
									type="checkbox"
									checked={selectedDumps.includes(d._id)}
									onChange={() => toggleDump(d._id)}
								/>
								{d.title}
							</label>
						))}
					</div>
				)}

				<button
					className="create-btn"
					onClick={handleCreate}
					disabled={!newName.trim()}
				>
					Create Room
				</button>
			</div>
		</div>
	);
}
