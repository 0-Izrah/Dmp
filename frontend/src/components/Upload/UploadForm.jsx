import { useState, useCallback } from 'react';
import { useDumps } from '../../hooks/useDumps';
import { usePhotoUpload } from '../../hooks/usePhotos';
import './UploadForm.css';

export default function UploadForm() {
    const { dumps } = useDumps();
    const { uploadPhotos , uploading , progress , error } = usePhotoUpload();

    const [selectedDump , setSelectedDump] = useState('');
    const [files,setFiles] = useState([]);
    const [captions , setCaptions] = useState([]);
    const [dragActive , setDragActive ] = useState(false);
    const [success , setSuccess] = useState(false);

    const addFiles = useCallback((newFiles) => {
        const imageFiles = Array.from(newFiles).filter((f) => f.type.startsWith('image/'));
        setFiles((prev) => [...prev, ...imageFiles]);
        setCaptions((prev) => [...prev, ...imageFiles.map(() => '')]);
        setSuccess(false);
    },[]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };
    const handleDragLeave = () => {
        setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        addFiles(e.dataTransfer.files);
    };
    const handleFileInput = (e) => {
        addFiles(e.target.files);
        e.target.value = '';
    };
    const updateCaption = (index, value) => {
        setCaptions((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };
    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setCaptions((prev) => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async () => {
        if(!selectedDump || files.length === 0) return;
        const formData = new FormData();
        formData.append('dumpId', selectedDump);
        files.forEach((file) => formData.append('photos', file));
        captions.forEach((caption, i) => formData.append(`captions[${i}]`, caption));
        try {
            await uploadPhotos(formData);
            setFiles([]);
            setCaptions([]);
            setSuccess(true);
        }catch{}
    };

    return (
        <div className="upload-form">
            <div className="form-group">
                <label htmlFor="dump-select">Select Dump</label>
                <select
                    id="dump-select"
                    value={selectedDump}
                    onChange={(e) => setSelectedDump(e.target.value)}
                >
                    <option value="">-- Choose a dump --</option>
                    {dumps.map((d) => (
                        <option key={d._id} value={d._id}>
                            {d.title}
                        </option>
                    ))}
                </select>
            </div>
            <div
                className={`dropzone ${dragActive ? 'dropzone-active' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    hidden
                />
                <div className="dropzone-content">
                    <span className="dropzone-icon">📁</span>
                    <p>Drop an image here or click to browse</p>
                    <span className="dropzone-hint">10MB limit each</span>
                </div>
            </div>
            {files.length > 0 && (
                <div className="preview-grid">
                    {files.map((file, i) => (
                        <div key={`${file.name}-${i}`} className="preview-item">
                            <div className="preview-image">
                                <img src={URL.createObjectURL(file)} alt="" />
                                <button className="preview-remove" onClick={() => removeFile(i)}>✕</button>
                            </div>
                            <input type="text" placeholder="Add a caption..." value={captions[i]} onChange={(e) => updateCaption(i, e.target.value)} />
                        </div>
                    ))}
                </div>
            )}
            {uploading && (
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span>{progress}%</span>
                </div>
            )}
            {error && <p className="upload-error">❌ {error}</p>}
            {success && <p className="upload-success">✅ Images uploaded successfully!</p>}
            <button className="upload-btn" onClick={handleSubmit} disabled={uploading || !selectedDump || files.length === 0}>
                {uploading ? `Uploading...${progress}%` : `Upload ${files.length} Photo${files.length !== 1 ? 's' : ''}`}
            </button>
        </div>
    );
}