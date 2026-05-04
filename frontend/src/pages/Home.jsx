import { useDumps } from '../hooks/useDumps';
import { GalleryGrid } from '../components/Gallery'

export default function Home() {
    const {dumps , loading , error } = useDumps();

    if(loading) return <div className="loading">Loading dumps...</div>
    if(error) {
        console.error(error.message);
        return <div className="error">Error loading dumps </div>
    }
    return (
        <div className="home">
            <header className="home-hero">
                <h1>Image Dumps</h1>
                <p style={{ color: 'var(--color-text-muted)'}}>Discover and share your favorite image dumps</p>
            </header>
            <GalleryGrid dumps={dumps} />
        </div>
    );
}

