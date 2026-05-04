import { useQuery , useMutation , useQueryClient } from '@tanstack/react-query';
import API from '../services/api';

const fetchDumps = async () => {
    const res = await API.get('/dumps');
    return res.data;
};

export function useDumps() {
    const queryClient = useQueryClient();

    const { data : dumps = [] , isLoading , isError , error } = useQuery({
        queryKey : ['dumps'],
        queryFn : fetchDumps
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
        dumps ,
        loading : isLoading,
        error ,
        createDump ,
        updateDump ,
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

export function useMyDumps() {
    const queryClient = useQueryClient();

    const { data: dumps = [], isLoading, error } = useQuery({
        queryKey: ['myDumps'],
        queryFn: async () => {
            const res = await API.get('/dumps/mine');
            return res.data.dumps;
        }
    });

    return { dumps, loading: isLoading, error };
}
