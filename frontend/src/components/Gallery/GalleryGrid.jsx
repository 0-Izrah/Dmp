import { Link } from 'react-router-dom';
import './GalleryGrid.css';

export default function GalleryGrid({ dumps }){
    if (!dumps || dumps.length === 0) {
        return <p className="empty-message">No dumps available</p>;
    }

    return (
        <div className="gallery-grid">
            {dumps.map((dump) => (
                <Link to ={`/dump/${dump.slug}`} key = {dump._id} className="gallery-card">
                    <div className="gallery-card-image">
                        {dump.coverPhoto ? (
                            <img src={dump.coverPhoto.replace('/upload/', '/upload/c_fill,w_600,h_600/')} loading="lazy" />
                        ) : (
                            <div className="gallery-card-placeholder">📷</div>
                        )}
                        <span className="photo-count">{dump.photos?.length || 0} photos </span>
                    </div>
                    <div className="gallery-card-info">
                        <h3>{ dump.title }</h3>
                        {dump.description && <p>{dump.description}</p>}
                    </div>
                </Link>
            ))}
        </div>
    );
}