import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';

export function useRoom(code) {
    const { data: room, isLoading, error } = useQuery({
        queryKey: ['room', code],
        queryFn: async () => {
            if (!code) return null;
            const res = await API.get(`/rooms/${code}`);
            return res.data;
        },
        enabled: !!code
    });
    return { room, loading: isLoading, error };
}

export function useMyRooms() {
    const queryClient = useQueryClient();

    const { data: homeRoom, isLoading: loadingHome, error: errorHome } = useQuery({
        queryKey: ['homeRoom'],
        queryFn: async () => {
            try {
                const res = await API.get('/rooms/my');
                return res.data;
            } catch (err) {
                if (err.response?.status === 404) return null;
                throw err;
            }
        }
    });

    const { data: rooms = [], isLoading: loadingRooms, error: errorRooms } = useQuery({
        queryKey: ['myRooms'],
        queryFn: async () => {
            const res = await API.get('/rooms/mine');
            return res.data;
        }
    });

    const createRoom = async (name, dumps = []) => {
        const res = await API.post('/rooms', {
            name,
            dumps,
        });

        queryClient.invalidateQueries(['myRooms']);
        return res.data;
    };

    const updateRoom = async (code, updates) => {
        const res = await API.put(`/rooms/${code}`, updates);
        queryClient.invalidateQueries(['myRooms']);
        queryClient.invalidateQueries(['homeRoom']);
        return res.data;
    };

    const deleteRoom = async (code) => {
        const res = await API.delete(`/rooms/${code}`);
        queryClient.invalidateQueries(['myRooms']);
        return res.data;
    };

    return {
        rooms,
        homeRoom,
        loading: loadingHome || loadingRooms,
        error: errorHome || errorRooms,
        createRoom,
        updateRoom,
        deleteRoom,
    };
}
