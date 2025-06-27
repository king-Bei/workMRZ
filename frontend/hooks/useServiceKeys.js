import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useServiceKeys() {
    const [services, setServices] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            setLoading(true);
            try {
                const res = await axios.get('/api/keys'); // 假設有這個 API
                setServices(res.data || []);
                setSelected(res.data && res.data.length > 0 ? res.data[0] : null);
            } catch (e) {
                setServices([]);
                setSelected(null);
            }
            setLoading(false);
        }
        fetchServices();
    }, []);

    return {
        services,
        selected,
        setSelected,
        loading,
        reload: async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/keys');
                setServices(res.data || []);
                setSelected(res.data && res.data.length > 0 ? res.data[0] : null);
            } catch {
                setServices([]);
                setSelected(null);
            }
            setLoading(false);
        }
    };
}
