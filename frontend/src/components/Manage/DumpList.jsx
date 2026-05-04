import DumpRow from './DumpRow';

export default function DumpList({ dumps = [] }) {
    if (dumps.length === 0) {
        return <div className="empty-state">No dumps found. Click create to make one!</div>;
    }

    return (
        <div className="dump-list-container">
            <table className="dump-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dumps.map(dump => (
                        <DumpRow key={dump._id || dump.id} dump={dump} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
