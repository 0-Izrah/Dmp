import { UploadForm } from '../components/Upload';

export default function Upload(){
    return (
        <div className="upload">
            <h1>Upload Images</h1>
            <p style={{ color: 'var(--color-text-muted)' , marginBottom: '2rem' }}>
                Select a Dump and add your photos.
            </p>
            <UploadForm/>
        </div>
    );
}