export default function DashboardStats({ dumps }){
    const total = dumps.length;
    const published = dumps.filter(d => d.isPublished).length;
    const drafts = total - published;

    return (
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Total Dumps</h3>
                <p>{total}</p>
            </div>
            <div className="stat-card">
                <h3>Published</h3>
                <p>{published}</p>
            </div>
            <div className="stat-card">
                <h3>Drafts</h3>
                <p>{drafts}</p>
            </div>
        </div>
    );
}
