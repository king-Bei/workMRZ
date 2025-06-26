import React, { useState, useEffect } from 'react';
import apiFetch from './api';

// hook：載入所有服務，預設選第一個
export function useServices() {
    const [services, setServices] = useState([]);
    const [current, setCurrent] = useState('');

    useEffect(() => {
        // TODO: 改為從後端取得服務列表
        const list = JSON.parse(localStorage.getItem('services') || '[]');
        setServices(list);
        setCurrent(list[0] || '');
    }, []);

    return { services, current, setCurrent, setServices };
}

// ServiceSelector 元件：可列出所有服務、切換、並新增帳號（需測試成功才能儲存）
function ServiceSelector({ currentService, onChange }) {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState('');
    const [newToken, setNewToken] = useState('');
    const [testStatus, setTestStatus] = useState('');
    const [tested, setTested] = useState(false);
    const [loading, setLoading] = useState(false);

    // 初始化服務列表
    useEffect(() => {
        // TODO: 改為從後端取得服務列表
        const list = JSON.parse(localStorage.getItem('services') || '[]');
        setServices(list);
    }, []);

    // 切換服務
    const handleSelect = (e) => {
        onChange(e.target.value);
    };

    // 測試 accessToken
    const handleTest = async () => {
        setTestStatus('');
        setTested(false);
        setLoading(true);
        try {
            // 可改為呼叫後端驗證 accessToken 的 API
            await apiFetch('/key', {
                method: 'POST',
                body: JSON.stringify({ service: newService, accessToken: newToken }),
            });
            setTestStatus('測試成功，可儲存');
            setTested(true);
        } catch (e) {
            setTestStatus('測試失敗: ' + e.message);
            setTested(false);
        }
        setLoading(false);
    };

    // 新增服務（需先測試成功）
    const handleAdd = () => {
        if (!newService || !newToken || !tested) return;
        const updated = [...services, newService];
        setServices(updated);
        localStorage.setItem('services', JSON.stringify(updated));
        setNewService('');
        setNewToken('');
        setTestStatus('');
        setTested(false);
    };

    return (
        <div>
            <h3>服務選擇</h3>
            <select value={currentService || ''} onChange={handleSelect}>
                <option value="">請選擇服務</option>
                {services.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
            <div style={{ marginTop: 10 }}>
                <input
                    placeholder="新服務名稱"
                    value={newService}
                    onChange={e => setNewService(e.target.value)}
                    disabled={loading}
                />
                <input
                    placeholder="AccessToken"
                    value={newToken}
                    onChange={e => setNewToken(e.target.value)}
                    disabled={loading}
                />
                <button onClick={handleTest} disabled={loading || !newService || !newToken}>測試</button>
                <button onClick={handleAdd} disabled={!tested || loading}>儲存</button>
                <span style={{ marginLeft: 8, color: tested ? 'green' : 'red' }}>{testStatus}</span>
            </div>
        </div>
    );
}

export default ServiceSelector;
