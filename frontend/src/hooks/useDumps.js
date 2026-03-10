import {useState , useEffect } from 'react';
import API from '../services/api';

export function useDumps() {
    const [dumps ,setDumps] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState(null);

    useEffect(() => {
        API.get('/dumps')
            .then((res) =>{
                setDumps(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setLoading(false);
            });
    },[]);
    return { dumps , loading , error };
}

export function useDump(slug){
    const [dump , setDump] = useState(null);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState(null);

    useEffect(() => {
        if(!slug) return;

        setLoading(true);
        API.get(`/dumps/${slug}`)
            .then((res) => {
                setDump(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    },[slug]);
    return { dump , loading , error };
}
