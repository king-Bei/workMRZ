import React, { useState } from 'react';
import axios from 'axios';

export default function UIDManagerPage() {
    const [uid, setUid] = useState('');
    const [richMenuId, setRichMenuId] = useState('');
    const [singleResult, setSingleResult] = useState(null);

    const [csvFile, setCsvFile] = useState(null);
    const [batchResult, setBatchResult] = useState(null);
    const [uploading, setUploading] = useState(false);

    // 單筆綁定
    const handleBind = async () => {
        setSingleResult(null);
        try {
            await axios.post('/api/uid/bind', { uid, richMenuId });
            setSingleResult({ success: [uid], fail: [] });
        } catch (e) {
            setSingleResult({ success: [], fail: [uid] });
        }
    };

    // 單筆解除
    const handleUnbind = async () => {
        setSingleResult(null);
        try {
            await axios.post('/api/uid/unbind', { uid });
            setSingleResult({ success: [uid], fail: [] });
        } catch (e) {
            setSingleResult({ success: [], fail: [uid] });
        }
    };

    // 批次上傳
    const handleBatchUpload = async (e) => {
        e.preventDefault();
        if (!csvFile) return;
        setUploading(true);
        setBatchResult(null);
        const formData = new FormData();
        formData.append('file', csvFile);
        try {
            const res = await axios.post('/api/uid/batch', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setBatchResult(res.data);
        } catch (e) {
            setBatchResult({ success: [], fail: ['檔案處理失敗'] });
        }
        setUploading(false);
    };

    return (
        <div className="container mt-4">
            <h2>UID 綁定/解除</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-2 align-items-center">
                        <div className="col-auto">
                            <input
                                className="form-control"
                                placeholder="UID"
                                value={uid}
                                onChange={e => setUid(e.target.value)}
                            />
                        </div>
                        <div className="col-auto">
                            <input
                                className="form-control"
                                placeholder="RichMenu ID"
                                value={richMenuId}
                                onChange={e => setRichMenuId(e.target.value)}
                            />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-success" onClick={handleBind} disabled={!uid || !richMenuId}>
                                綁定
                            </button>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-danger" onClick={handleUnbind} disabled={!uid}>
                                解除
                            </button>
                        </div>
                    </div>
                    {singleResult && (
                        <div className="mt-3">
                            <div>
                                <strong>成功：</strong>
                                {singleResult.success.length > 0 ? singleResult.success.join(', ') : '無'}
                            </div>
                            <div>
                                <strong>失敗：</strong>
                                {singleResult.fail.length > 0 ? singleResult.fail.join(', ') : '無'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleBatchUpload}>
                        <div className="row g-2 align-items-center">
                            <div className="col-auto">
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="form-control"
                                    onChange={e => setCsvFile(e.target.files[0] || null)}
                                />
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-primary" type="submit" disabled={uploading}>
                                    {uploading ? '上傳中...' : '批次上傳 CSV'}
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="form-text mt-2">
                        CSV 格式：<br />
                        綁定：每行 <code>uid,richMenuId</code><br />
                        解除：每行 <code>uid</code>
                    </div>
                    {batchResult && (
                        <div className="mt-3">
                            <div>
                                <strong>成功：</strong>
                                {batchResult.success && batchResult.success.length > 0
                                    ? batchResult.success.join(', ')
                                    : '無'}
                            </div>
                            <div>
                                <strong>失敗：</strong>
                                {batchResult.fail && batchResult.fail.length > 0
                                    ? batchResult.fail.join(', ')
                                    : '無'}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
