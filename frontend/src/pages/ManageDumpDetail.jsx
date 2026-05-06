import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import UploadForm from '../components/Upload/UploadForm';
import { useDumps } from '../hooks/useDumps';
import { usePhotos } from '../hooks/usePhotos';
import { useMyRooms } from '../hooks/useRooms';
import API from '../services/api';

export default function ManageDumpDetail() {
    const { slug } = useParams();

    const { data: dump, isLoading } = useQuery({
        queryKey: ['dump', slug],
        queryFn: () => API.get(`/dumps/${slug}`).then(r => r.data)
    });

    const { updateDump } = useDumps();
    const { deletePhoto } = usePhotos();
    const { rooms = [], homeRoom } = useMyRooms();

    if (isLoading) return <div>Loading dump details...</div>;

    const allRooms = homeRoom ? [homeRoom, ...rooms.filter(r => r.code !== homeRoom.code)] : rooms;

    const handleUpdateMetadata = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        updateDump.mutate({
            id: dump._id,
            updates: {
                title: formData.get('title'),
                isPublished: formData.get('roomCode') ? false : (formData.get('isPublished') === 'on'),
                roomCode: formData.get('roomCode') || '' // Empty string implies remove from all rooms
            }
        });
    };

    const handleDeletePhoto = (photoId) => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            deletePhoto.mutate({ id: photoId, dumpSlug: slug });
        }
    };

    return (
        <div className='manage-detail-page'>
            <header className="detail-header card-style">
                <form onSubmit={handleUpdateMetadata} className='metadata-form'>
                    <div className="form-group">
                        <label>Title</label>
                        <input name="title" defaultValue={dump.title} required/>
                    </div>
                    <div className="form-group">
                        <label>Assign to Room</label>
                        <select name="roomCode" defaultValue={dump.roomCode || ""}>
                            <option value="">-- Public Gallery (No Room) --</option>
                            {allRooms.map((room) => (
                                <option key={room.code} value={room.code}>
                                    {room.name} ({room.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input type="checkbox" name="isPublished" defaultChecked={dump.isPublished} />
                            Published to Public Gallery
                        </label>
                        <small style={{display: 'block', color: 'var(--color-text-muted)', fontSize: '0.8rem'}}>
                            (Check if not assigned to a room, ignored if assigned)
                        </small>
                    </div>
                    <button type="submit" disabled={updateDump.isPending}>
                        {updateDump.isPending ? 'Updating...' : "Save Changes"}
                    </button>
                </form>
            </header>
            <section className="photo-management">
                <h2>Photos</h2>
                {/* Dropzone for new photos */}
                <div className="upload-zone">
                    <UploadForm dumpId={dump._id} dumpSlug={slug} />
                </div>
                {/* Grid of existing photos to delete/reorder */}
                <div className="photo-grid">
                    {dump.photos.map(photo => (
                        <div key={photo._id} className="photo-card">
                            <img src={photo.url} alt="" />
                            <button 
                                className="delete-btn" 
                                onClick={() => handleDeletePhoto(photo._id)}
                                disabled={deletePhoto.isPending && deletePhoto.variables?.id === photo._id}
                            >
                                {deletePhoto.isPending && deletePhoto.variables?.id === photo._id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
