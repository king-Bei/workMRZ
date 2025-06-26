import React, { useState } from 'react';
import apiFetch from './api';

// LoginPage 元件：帳號密碼登入頁
function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
            localStorage.setItem('token', res.token);
            if (onLogin) onLogin();
        } catch (e) {
            setError('登入失敗，請檢查帳號密碼');
        }
        setLoading(false);
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <form
                className="p-4 bg-white rounded shadow"
                style={{ minWidth: 300, maxWidth: 350, width: '100%' }}
                onSubmit={handleSubmit}
            >
                <h3 className="mb-3 text-center">管理員登入</h3>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="帳號"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="密碼"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger py-1">{error}</div>}
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? '登入中...' : '登入'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
