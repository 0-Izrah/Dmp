import { useQuery , useMutation , useQueryClient } from '@tanstack/react-query';
import API from '../services/api';

export function useDumps(page = 1, limit = 20) {
    const queryClient = useQueryClient();

    const { data = { dumps: [], totalPages: 1 }, isLoading, isError, error } = useQuery({
        queryKey: ['dumps', page, limit],
        queryFn: async () => {
            const res = await API.get(`/dumps?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true
    });

    const createDump = useMutation({
        mutationFn: async(newDump) =>{
            const res = await API.post('/dumps', newDump);
            return res.data;
        },
        onSuccess : () => {
            queryClient.invalidateQueries(['dumps']);
            queryClient.invalidateQueries(['myDumps']);
        }
    });
    const updateDump = useMutation({
        mutationFn: async ({ id , updates }) => {
            const res = await API.put(`/dumps/${id}`, updates);
            return res.data;
        },
        onSuccess : (updatedDump) => {
            queryClient.invalidateQueries(['dumps']);
            queryClient.invalidateQueries(['myDumps']);
            queryClient.invalidateQueries(['dump' , updatedDump.slug])
        }

    })
    return {
        dumps: data.dumps,
        totalPages: data.totalPages,
        loading: isLoading,
        error,
        createDump,
        updateDump,
    };
}

export function useDump(slug) {
    const { data: dump, isLoading, error } = useQuery({
        queryKey: ['dump', slug],
        queryFn: async () => {
            const res = await API.get(`/dumps/${slug}`);
            return res.data;
        },
        enabled: !!slug
    });

    return { dump, loading: isLoading, error };
}

export function useMyDumps(page = 1, limit = 20) {
    const queryClient = useQueryClient();

    const { data = { dumps: [], totalPages: 1, stats: {} }, isLoading, error } = useQuery({
        queryKey: ['myDumps', page, limit],
        queryFn: async () => {
            const res = await API.get(`/dumps/mine?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true
    });

    return { 
        dumps: data.dumps, 
        totalPages: data.totalPages, 
        stats: data.stats,
        loading: isLoading, 
        error 
    };
}
