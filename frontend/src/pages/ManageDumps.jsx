import { useState } from 'react';
import { useMyDumps } from '../hooks/useDumps';
import DashboardStats from '../components/Manage/DashboardStats';
import DumpList from '../components/Manage/DumpList';
import DumpForm from '../components/Manage/DumpForm';

export default function ManageDumps (){
    const [page, setPage] = useState(1);
    const limit = 20;
    const { dumps, totalPages, stats, loading, error } = useMyDumps(page, limit);

    if(loading) return <div>loading dashboard...</div>;
    if(error) return <div>Error Loading Data...</div>;

    return (
        <div className="manage-dashboard">
            {stats && <DashboardStats dumps={dumps} stats={stats} />}
            <div className='manage-header'>
                <h2>Your Dumps</h2>
                <DumpForm />{/* A modal or slide-down form to create new dumps */}
            </div>
            <DumpList dumps={dumps} />
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
    )
}