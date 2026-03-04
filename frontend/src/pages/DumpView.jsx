import { useParams} from 'react-router-dom';

export default function DumpView() {
    const { slug } = useParams();
    return (
        <div className="dump-view">
            <h1>Dump : {slug}</h1>
            <p>swiper</p>
        </div>
    );
}
