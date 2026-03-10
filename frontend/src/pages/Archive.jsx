import { useDumps } from '../hooks/useDumps';
import {GalleryGrid} from '../components/Gallery';

export default function Archive() {
    const {dumps , loading , error } = useDumps();
    if (loading) return <div className="loading">Loading archive...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="archive">
            <h1>Archive</h1>
            <p style={{ color: 'var(--color-text-muted)' , marginBottom: '2rem' }}> Browse all image dumps.</p>
            <GalleryGrid dumps={dumps} />
        </div>
    );
}