import { useParams , useNavigate } from 'react-router-dom';
import { useDump } from '../hooks/useDumps';

export default function DumpView() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { dump , loading , error } = useDump(slug);

    if(loading) { return <div className="dump-view"><p>Loading dump...</p></div> }
    if (error || !dump) {
        return (
            <div className="dump-view">
                <p>Dump not found.</p>
                <button onClick={() => navigate('/')}> Go Home </button>
            </div>
        );
    }

    return (
        <div className="dump-view">
            <button className="back-btn" onClick={() => navigate(-1)}>X</button>
            <h1>{dump.title}</h1>
            <p>{dump.photos?.length || 0} photos</p>
            <div style = {{ display: 'flex', flexWrap: 'wrap' , gap: '8px' , padding:'1rem' }}>
                {dump.photos?.map((photo) => (
                    <img key={photo._id} src={photo.url} alt={photo.caption} style={{ width: '200px', height: '200px' , objectFit: 'cover' }}/>
                ))}
            </div>
        </div>

    );
}