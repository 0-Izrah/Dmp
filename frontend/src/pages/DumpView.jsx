import { useParams , useNavigate } from 'react-router-dom';
import { useDump } from '../hooks/useDumps';
import { PhotoSwiper } from '../components/Swiper';

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
            <PhotoSwiper photos={dump.photos} />
        </div>

    );
}