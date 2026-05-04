import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';

export function usePhotoUpload() {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const queryClient = useQueryClient();

    const uploadPhotos = async (formData, dumpSlug) => {
        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const res = await API.post('/photos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    const percent = Math.round((e.loaded * 100) / e.total);
                    setProgress(percent);
                },
            });
            setUploading(false);
            if (dumpSlug) queryClient.invalidateQueries(['dump', dumpSlug]);
            return res.data;
        } catch(err) {
            setError(err.response?.data?.error || err.message);
            setUploading(false);
            throw err;
        }
    };

    return { uploadPhotos, uploading, progress, error };
}

export function usePhotos() {
    const queryClient = useQueryClient();

    const deletePhoto = useMutation({
        mutationFn: async ({ id }) => {
            const res = await API.delete(`/photos/${id}`);
            return res.data;
        },
        onSuccess: (_, variables) => {
            if (variables.dumpSlug) {
                queryClient.invalidateQueries(['dump', variables.dumpSlug]);
            }
        }
    });

    return { deletePhoto };
}
