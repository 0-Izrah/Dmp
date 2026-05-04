import { useQuery , useMutation , useQueryClient } from '@tanstack/react-query';

const fetchDumps = async () => {
    const res = await fetch('/api/dumps');
    if(!res.ok) throw new Error ('Failed to fetch dumps');
    return res.json();
};

export function useDumps() {
    const queryClient = useQueryClient();

    const { data : dumps = [] , isLoading , isError , error } = useQuery({
        queryKey : ['dumps'],
        queryFn : fetchDumps
    });

    const createDump = useMutation({
        mutationFn: async(newDump) =>{
            const res = await fetch('/api/dumps' , {
                method : 'POST' , 
                headers : { 'Content-Type' : 'application/json' },
                body : JSON.stringify(newDump)
            });
            return res.json();
        },
        onSuccess : () => {
            queryClient.invalidateQueries(['dumps']);
        }
    });
    const updateDump = useMutation({
        mutationFn: async ({ id , updates }) => {
            const res = await fetch(`/api/dumps/${id}` ,{
                method : 'PUT' , 
                headers : { 'Content-Type': 'application/json' },
                body : JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('Failed to update');
            return res.json();
        },
        onSuccess : (updatedDump) => {
            queryClient.invalidateQueries(['dumps']);
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
            const res = await fetch(`/api/dumps/${slug}`);
            if (!res.ok) throw new Error('Failed to fetch dump');
            return res.json();
        },
        enabled: !!slug
    });

    return { dump, loading: isLoading, error };
}
