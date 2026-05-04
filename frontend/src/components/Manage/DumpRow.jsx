import { useNavigate } from 'react-router-dom'

export default function DumpRow({ dump }){
    const navigate = useNavigate();

    return (
        <tr className="dump-row">
            <td>{dump.title}</td>
            <td>{dump.isPublished ? 'Live' : 'Draft'}</td>
            <td className="actions">
                {/* Instead of inline editing, we navigate to the detail page! */}
                <button onClick={() => navigate(`/manage/dumps/${dump.slug}`)}>
                    Manage / Edit
                </button>
            </td>
        </tr>
    );
}