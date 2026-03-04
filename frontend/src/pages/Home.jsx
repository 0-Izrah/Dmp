import { Link } from 'react-router-dom';
import { useDumps } from '../hooks/useDumps';

export default function Home() {
    const {dumps , loading , error } = useDumps();

    if(loading) return <div className="loading">Loading dumps...</div>
    if(error) return <div className="error">Error loading dumps: {error.message}</div>
    return (
        <div className="home">
            <header className="home-hero">
                <h1>Image Dumps</h1>
                <p>Discover and share your favorite image dumps</p>
            </header>

            {dumps.length === 0 ? (
                <p className="empty">No dumps available.</p>
            ) : (
                <section className="dump-grid">
                    {dumps.map((dump) => (
                        <Link to={`/dump/${dump.slug}`} key={dump._id} className="dump-card">
                            {dump.coverPhoto ? (
                                <img src={dump.coverPhoto} alt={dump.title} loading="lazy" />
                            ) : (
                                <div className="dump-card-placeholder">No Cover Photo</div>
                            )}
                            <div className="dump-card-info">
                                <h3>{dump.title}</h3>
                                <span>{dump.photos?.length || 0} photos</span>
                            </div>
                        </Link>
                    ))}
                </section>
            )}
        </div>
    )
}

