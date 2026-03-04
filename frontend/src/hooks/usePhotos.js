import { useState } from 'react';
import API from '../services/api';

export function usePhotoUpload() {
    const[uploading , setUploading] = useState(false);
    const [error , setError] = useState(null);
    const[progress , setProgress] = useState(0);

    const uploadPhotos = async (formData) => {
        setUploading(true);
        setProgress(0);
        setError(null);

        try{
            const res = await API.post('/photos/upload' , formData , {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setProgress(percent);
                },
            });
            setUploading(false);
            return res.data;
        }catch(err){
            setError(err.response?.data?.error || err.message);
            setUploading(false);
            throw err;
        }
        };

        return { uploadPhotos , uploading , progress, error };
}