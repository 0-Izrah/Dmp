import { useState } from 'react';
import { useDumps } from '../hooks/useDumps';
import { GalleryGrid } from '../components/Gallery';

export default function Archive() {
    const [page, setPage] = useState(1);
    const limit = 20;
    const { dumps, totalPages, loading, error } = useDumps(page, limit);
    if (loading) return <div className="loading">Loading archive...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="archive">
            <h1>Archive</h1>
            <p style={{ color: 'var(--color-text-muted)' , marginBottom: '2rem' }}> Browse all image dumps.</p>
            <GalleryGrid dumps={dumps} />
            {totalPages > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1}
                        style={{ padding: '0.5rem 1rem', borderRadius: '4px' }}
                    >
                        Previous
                    </button>
                    <span style={{ padding: '0.5rem', color: 'var(--color-text-muted)' }}>Page {page} of {totalPages}</span>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                        disabled={page === totalPages}
                        style={{ padding: '0.5rem 1rem', borderRadius: '4px' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}