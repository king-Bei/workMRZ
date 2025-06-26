const API_BASE = '/api';

// 全域 loading/alert 事件
export function showAlert(type, message) {
    window.dispatchEvent(new CustomEvent('app-alert', { detail: { type, message } }));
}
export function setLoading(loading) {
    window.dispatchEvent(new CustomEvent('app-loading', { detail: loading }));
}

function getToken() {
    return localStorage.getItem('token');
}

async function apiFetch(path, options = {}) {
    setLoading(true);
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };
    try {
        const res = await fetch(API_BASE + path, { ...options, headers });
        if (!res.ok) {
            const msg = await res.text();
            showAlert('danger', msg || 'API 錯誤');
            throw new Error(msg);
        }
        const data = await res.json();
        if (options.method && options.method !== 'GET') {
            showAlert('success', '操作成功');
        }
        return data;
    } finally {
        setLoading(false);
    }
}

export default apiFetch;
