import React, { useState } from 'react';
import apiFetch from './api';

// UIDManagerPage 元件：支援個別 UID 綁定/解除與批次操作，顯示成功/失敗名單
function UIDManagerPage({ service }) {
    const [uid, setUid] = useState('');
    const [richmenuId, setRichmenuId] = useState('');
    const [singleResult, setSingleResult] = useState('');
    const [csvMode, setCsvMode] = useState('bind'); // 'bind' or 'unbind'
    const [batchSuccess, setBatchSuccess] = useState([]);
    const [batchFail, setBatchFail] = useState([]);
    const [batchLoading, setBatchLoading] = useState(false);

    // 個別綁定
    const handleBind = async () => {
        setSingleResult('');
        if (!uid || !richmenuId) {
            setSingleResult('請輸入 UID 與 RichMenu ID');
            return;
        }
        try {
            await apiFetch('/user/bind', {
                method: 'POST',
                body: JSON.stringify({ uid, richmenuId, service }),
            });
            setSingleResult('綁定成功');
        } catch (e) {
            setSingleResult('綁定失敗: ' + e.message);
        }
    };

    // 個別解除
    const handleUnbind = async () => {
        setSingleResult('');
        if (!uid) {
            setSingleResult('請輸入 UID');
            return;
        }
        try {
            await apiFetch('/user/unbind', {
                method: 'POST',
                body: JSON.stringify({ uid, service }),
            });
            setSingleResult('解除成功');
        } catch (e) {
            setSingleResult('解除失敗: ' + e.message);
        }
    };

    // 批次上傳 CSV
    const handleCSV = async e => {
        setBatchSuccess([]);
        setBatchFail([]);
        setBatchLoading(true);
        const file = e.target.files[0];
        if (!file) {
            setBatchLoading(false);
            return;
        }
        const text = await file.text();
        // CSV 格式: uid,richmenuId (綁定) 或 uid (解除)
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        let success = [];
        let fail = [];
        for (const line of lines) {
            if (csvMode === 'bind') {
                const [uidVal, richmenuIdVal] = line.split(',').map(s => s.trim());
                if (!uidVal || !richmenuIdVal) {
                    fail.push(line);
                    continue;
                }
                try {
                    await apiFetch('/user/bind', {
                        method: 'POST',
                        body: JSON.stringify({ uid: uidVal, richmenuId: richmenuIdVal, service }),
                    });
                    success.push(line);
                } catch {
                    fail.push(line);
                }
            } else {
                const uidVal = line.split(',')[0].trim();
                if (!uidVal) {
                    fail.push(line);
                    continue;
                }
                try {
                    await apiFetch('/user/unbind', {
                        method: 'POST',
                        body: JSON.stringify({ uid: uidVal, service }),
                    });
                    success.push(line);
                } catch {
                    fail.push(line);
                }
            }
        }
        setBatchSuccess(success);
        setBatchFail(fail);
        setBatchLoading(false);
    };

    return (
        <div>
            <h2>UID 綁定/解除</h2>
            <div style={{ marginBottom: 24 }}>
                <input
                    placeholder="輸入 UID"
                    value={uid}
                    onChange={e => setUid(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <input
                    placeholder="RichMenu ID（綁定時必填）"
                    value={richmenuId}
                    onChange={e => setRichmenuId(e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <button onClick={handleBind} style={{ marginRight: 8 }}>個別綁定</button>
                <button onClick={handleUnbind}>個別解除</button>
                <span style={{ marginLeft: 12 }}>{singleResult}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label>
                    <input
                        type="radio"
                        checked={csvMode === 'bind'}
                        onChange={() => setCsvMode('bind')}
                        style={{ marginRight: 4 }}
                    />
                    批次綁定（CSV: uid,richmenuId）
                </label>
                <label style={{ marginLeft: 16 }}>
                    <input
                        type="radio"
                        checked={csvMode === 'unbind'}
                        onChange={() => setCsvMode('unbind')}
                        style={{ marginRight: 4 }}
                    />
                    批次解除（CSV: uid）
                </label>
            </div>
            <div>
                <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCSV}
                    disabled={batchLoading}
                />
                {batchLoading && <span style={{ marginLeft: 8 }}>處理中...</span>}
            </div>
            {(batchSuccess.length > 0 || batchFail.length > 0) && (
                <div style={{ marginTop: 16 }}>
                    <div>
                        <strong style={{ color: 'green' }}>成功 ({batchSuccess.length})：</strong>
                        <pre style={{ background: '#eaffea', padding: 8 }}>{batchSuccess.join('\n')}</pre>
                    </div>
                    <div>
                        <strong style={{ color: 'red' }}>失敗 ({batchFail.length})：</strong>
                        <pre style={{ background: '#ffeaea', padding: 8 }}>{batchFail.join('\n')}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UIDManagerPage;
