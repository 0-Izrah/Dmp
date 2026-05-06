import { useState } from 'react';
import { useDumps } from '../../hooks/useDumps';
import { useMyRooms } from '../../hooks/useRooms';

export default function DumpForm() {
    const [isOpen , setIsOpen ] = useState(false);
    const { createDump } = useDumps();
    const { rooms = [], homeRoom } = useMyRooms();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title');
        const roomCode = formData.get('roomCode');
        
        const newDump = {
            title : title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), // Generate from title
            month : Number(formData.get('month')),
            year : Number(formData.get('year')),
            roomCode: roomCode || null,
            isPublished: !roomCode // if no room selected, maybe it goes to public gallery
        };

        createDump.mutate(newDump , {
            onSuccess : () => {
                setIsOpen(false);
                e.target.reset();
            }
        });
    };

    if(!isOpen) {
        return <button className="btn-primary" onClick={() => setIsOpen(true)}>+ Create New Dump</button>;

    }

    const allRooms = homeRoom ? [homeRoom, ...rooms.filter(r => r.code !== homeRoom.code)] : rooms;

    return (
        <div className="dump-form-container">
            <form onSubmit={handleSubmit} className="dump-form-card-style">
                <h3>Create a New Dump</h3>

                <div className="form-group">
                    <label>Title</label>
                    <input name="title" placeholder="e.g., august" required/>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label >Month</label>
                        <input name="month" type="number" placeholder="1-12" min="1" max="12" required />
                    </div>
                    <div className="form-group">
                        <label>Year</label>
                        <input name="year" type="number" placeholder="e.g., 2026" required />
                    </div>
                </div>

                <div className="form-group">
                    <label>Assign to Room (Optional)</label>
                    <select name="roomCode" defaultValue="">
                        <option value="">-- Public Gallery (No Room) --</option>
                        {allRooms.map((room) => (
                            <option key={room.code} value={room.code}>
                                {room.name} ({room.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={createDump.isPending} className="btn-succes">
                        {createDump.isPending ? 'Creating....' : 'Create'}
                    </button>
                    <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )

}