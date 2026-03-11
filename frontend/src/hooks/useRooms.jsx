import { useState, useEffect } from "react";
import API from "../services/api";

function getFingerprint() {
    let fp = localStorage.getItem("dmp-fingerprint");
    if (!fp) {
        fp = crypto.randomUUID();
        localStorage.setItem("dmp-fingerprint", fp);
    }
    return fp;
}

function headers() {
    return { "x-fingerprint": getFingerprint() };
}

export function useRoom(code) {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!code) return;
        setLoading(true);
        API.get(`/rooms/${code}`, { headers: headers() })
            .then((res) => {
                setRoom(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message);
                setLoading(false);
            });
    }, [code]);

    return { room, loading, error };
}

export function useMyRooms() {
    const [rooms, setRooms] = useState([]);
    const [homeRoom, setHomeRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const homeRes = await API.get("/rooms/my", { headers: headers() });
            setHomeRoom(homeRes.data);

            const allRes = await API.get("/rooms/mine", { headers: headers() });
            setRooms(allRes.data);

            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const createRoom = async (name, dumpIds = []) => {
        const res = await API.post(
            "/rooms",
            { name, dumps: dumpIds },
            { headers: headers() },
        );
        setRooms((prev) => [...prev, res.data]);
        return res.data;
    };

    return { rooms, homeRoom, loading, error, createRoom, refresh: fetchRooms };
}

export { getFingerprint };
