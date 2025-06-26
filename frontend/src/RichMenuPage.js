import React, { useState, useEffect } from 'react';
import apiFetch from './api';

// RichMenuTable 元件：顯示 RichMenu 清單
function RichMenuTable({ richMenus, onSetDefault, onDelete, onView }) {
    return (
        <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
                <tr>
                    <th>圖片</th>
                    <th>richmenuId</th>
                    <th>名稱</th>
                    <th>尺寸</th>
                    <th>是否預設</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {richMenus.map(menu => (
                    <tr key={menu.richmenuId}>
                        <td>
                            {menu.imageUrl ? (
                                <img src={menu.imageUrl} alt="preview" style={{ width: 80, height: 40, objectFit: 'cover' }} />
                            ) : (
                                <span className="text-muted">無</span>
                            )}
                        </td>
                        <td>{menu.richmenuId}</td>
                        <td>{menu.name}</td>
                        <td>{menu.size ? `${menu.size.width}x${menu.size.height}` : ''}</td>
                        <td>{menu.default ? <span className="badge bg-success">預設</span> : ''}</td>
                        <td>
                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => onView(menu)}>查看</button>
                            <button className="btn btn-sm btn-outline-success me-1" onClick={() => onSetDefault(menu)} disabled={menu.default}>設為預設</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(menu)}>刪除</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// RichMenuPage 主元件
function RichMenuPage({ service }) {
    const [richMenus, setRichMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [jsonText, setJsonText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [viewMenu, setViewMenu] = useState(null);

    // 取得 RichMenu 清單
    const fetchMenus = async () => {
        if (!service) return;
        setLoading(true);
        setError('');
        try {
            const data = await apiFetch(`/richmenu/list?service=${encodeURIComponent(service)}`);
            setRichMenus(data);
        } catch (e) {
            setError('取得 RichMenu 清單失敗: ' + e.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMenus();
        // eslint-disable-next-line
    }, [service]);

    // 預覽圖片
    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = e => setImagePreview(e.target.result);
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreview('');
        }
    }, [imageFile]);

    // 設為預設
    const handleSetDefault = async (menu) => {
        setInfo('');
        setError('');
        try {
            await apiFetch(`/richmenu/default?service=${encodeURIComponent(service)}`, {
                method: 'POST',
                body: JSON.stringify({ richmenuId: menu.richmenuId }),
            });
            setInfo('已設為預設');
            fetchMenus();
        } catch (e) {
            setError('設為預設失敗: ' + e.message);
        }
    };

    // 刪除
    const handleDelete = async (menu) => {
        if (!window.confirm('確定要刪除這個 RichMenu？')) return;
        setInfo('');
        setError('');
        try {
            await apiFetch(`/richmenu/delete?service=${encodeURIComponent(service)}`, {
                method: 'POST',
                body: JSON.stringify({ richmenuId: menu.richmenuId }),
            });
            setInfo('已刪除');
            fetchMenus();
        } catch (e) {
            setError('刪除失敗: ' + e.message);
        }
    };

    // 查看
    const handleView = (menu) => {
        setViewMenu(menu);
    };

    // 上傳新 RichMenu
    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError('');
        setInfo('');
        try {
            const json = JSON.parse(jsonText);
            const formData = new FormData();
            formData.append('service', service);
            formData.append('json', JSON.stringify(json));
            if (imageFile) formData.append('image', imageFile);

            // 注意：apiFetch 不支援 FormData，需自行 fetch
            const token = localStorage.getItem('token');
            const res = await fetch('/api/richmenu/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (!res.ok) throw new Error(await res.text());
            setInfo('建立成功');
            setJsonText('');
            setImageFile(null);
            fetchMenus();
        } catch (e) {
            setError('建立失敗: ' + e.message);
        }
        setUploading(false);
    };

    return (
        <div>
            <h2>RichMenu 管理</h2>
            {!service && <div className="alert alert-warning">請先選擇服務</div>}
            {service && (
                <>
                    <form className="mb-4" onSubmit={handleUpload} encType="multipart/form-data">
                        <div className="row g-2 align-items-end">
                            <div className="col-md-5">
                                <label className="form-label">RichMenu JSON</label>
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    value={jsonText}
                                    onChange={e => setJsonText(e.target.value)}
                                    placeholder='{"size":...}'
                                    disabled={uploading}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">圖片（選填）</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={e => setImageFile(e.target.files[0])}
                                    disabled={uploading}
                                />
                                {imagePreview && (
                                    <img src={imagePreview} alt="預覽" style={{ width: 120, marginTop: 8, border: '1px solid #ccc' }} />
                                )}
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-primary w-100" disabled={uploading || !jsonText}>
                                    {uploading ? '上傳中...' : '建立新 RichMenu'}
                                </button>
                            </div>
                        </div>
                    </form>
                    {error && <div className="alert alert-danger py-1">{error}</div>}
                    {info && <div className="alert alert-success py-1">{info}</div>}
                    {loading ? (
                        <div>載入中...</div>
                    ) : (
                        <RichMenuTable
                            richMenus={richMenus}
                            onSetDefault={handleSetDefault}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    )}
                    {/* 查看 RichMenu 詳細資訊 */}
                    {viewMenu && (
                        <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }}>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">RichMenu 詳細資訊</h5>
                                        <button type="button" className="btn-close" onClick={() => setViewMenu(null)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(viewMenu, null, 2)}</pre>
                                        {viewMenu.imageUrl && (
                                            <img src={viewMenu.imageUrl} alt="預覽" style={{ width: '100%', border: '1px solid #ccc' }} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default RichMenuPage;
