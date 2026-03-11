import { useParams, Link } from "react-router-dom";
import { useRoom } from "../hooks/useRooms";
import { GalleryGrid } from "../components/Gallery";

export default function Room() {
	const { code } = useParams();
	const { room, loading, error } = useRoom(code);

	if (loading) return <div className="loading">Finding room...</div>;

	if (error || !room) {
		return (
			<div className="room-not-found">
				<h2>Room not found</h2>
				<p>
					The code <strong>{code}</strong> doesn't match any room.
				</p>
				<Link to="/">Go Home</Link>
			</div>
		);
	}

	return (
		<div className="room">
			<header className="room-header">
				<div className="room-code-badge">{room.code}</div>
				<h1>{room.name}</h1>
				<p className="room-meta">
					{room.dumps?.length || 0} dumps · {room.photos?.length || 0}{" "}
					loose photos
				</p>
			</header>

			{room.dumps && room.dumps.length > 0 && (
				<section>
					<h2>Dumps</h2>
					<GalleryGrid dumps={room.dumps} />
				</section>
			)}

			{room.photos && room.photos.length > 0 && (
				<section className="room-photos">
					<h2>Photos</h2>
					<div className="room-photo-grid">
						{room.photos.map((photo) => (
							<img
								key={photo._id}
								src={photo.url}
								alt={photo.caption || ""}
								loading="lazy"
							/>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
