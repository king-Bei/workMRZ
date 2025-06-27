import React, { useState } from 'react';
import useServiceKeys from '../hooks/useServiceKeys';
import axios from 'axios';

export default function ServiceSelector({ onChange }) {
    const { services, selected, setSelected, loading, reload } = useServiceKeys();
    const [showAdd, setShowAdd] = useState(false);
    const [newService, setNewService] = useState('');
    const [newToken, setNewToken] = useState('');
    const [testStatus, setTestStatus] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleSelect = (service) => {
        setSelected(service);
        if (onChange) onChange(service);
    };

    const handleTest = async () => {
        setTestStatus('testing');
        // 這裡假設有一個 /api/keys/test API 可驗證 accessToken
        try {
            await axios.post('/api/keys/test', {
                service: newService,
                accessToken: newToken
            });
            setTestStatus('success');
        } catch {
            setTestStatus('fail');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/api/keys', {
                service: newService,
                accessToken: newToken
            });
            setShowAdd(false);
            setNewService('');
            setNewToken('');
            setTestStatus(null);
            await reload();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h3>服務帳號選擇</h3>
            {loading ? <div>載入中...</div> : (
                <ul>
                    {services.map(s => (
                        <li key={s.service}>
                            <button
                                style={{ fontWeight: selected && selected.service === s.service ? 'bold' : 'normal' }}
                                onClick={() => handleSelect(s)}
                            >
                                {s.service}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => setShowAdd(v => !v)}>
                {showAdd ? '取消' : '新增服務帳號'}
            </button>
            {showAdd && (
                <div style={{ marginTop: 10 }}>
                    <input
                        placeholder="服務名稱"
                        value={newService}
                        onChange={e => setNewService(e.target.value)}
                    />
                    <input
                        placeholder="accessToken"
                        value={newToken}
                        onChange={e => setNewToken(e.target.value)}
                        type="password"
                    />
                    <button onClick={handleTest} disabled={!newService || !newToken || testStatus === 'testing'}>
                        測試
                    </button>
                    {testStatus === 'success' && <span style={{ color: 'green' }}>測試成功</span>}
                    {testStatus === 'fail' && <span style={{ color: 'red' }}>測試失敗</span>}
                    <button
                        onClick={handleSave}
                        disabled={testStatus !== 'success' || saving}
                        style={{ marginLeft: 8 }}
                    >
                        儲存
                    </button>
                </div>
            )}
        </div>
    );
}
