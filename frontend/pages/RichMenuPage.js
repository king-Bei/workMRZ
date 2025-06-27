import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RichMenuTable from '../components/RichMenuTable';

export default function RichMenuPage() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [jsonFile, setJsonFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // 載入 RichMenu 清單
    const fetchMenus = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/richmenu');
            setMenus(res.data || []);
        } catch {
            setMenus([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    // 預覽圖片
    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = e => setImagePreview(e.target.result);
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreview(null);
        }
    }, [imageFile]);

    // 查看功能（可自訂）
    const handleView = (menu) => {
        alert(JSON.stringify(menu, null, 2));
    };

    // 設為預設
    const handleSetDefault = async (menu) => {
        setLoadingId(menu.richMenuId);
        try {
            await axios.post(`/api/richmenu/${menu.richMenuId}/default`);
            await fetchMenus();
        } finally {
            setLoadingId(null);
        }
    };

    // 刪除
    const handleDelete = async (menu) => {
        if (!window.confirm('確定要刪除這個 RichMenu？')) return;
        setLoadingId(menu.richMenuId);
        try {
            await axios.delete(`/api/richmenu/${menu.richMenuId}`);
            await fetchMenus();
        } finally {
            setLoadingId(null);
        }
    };

    // 上傳新 RichMenu
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!jsonFile || !imageFile) {
            setUploadStatus('請選擇 JSON 與圖片檔案');
            return;
        }
        setUploading(true);
        setUploadStatus('上傳中...');
        const formData = new FormData();
        formData.append('json', jsonFile);
        formData.append('image', imageFile);
        try {
            await axios.post('/api/richmenu', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUploadStatus('上傳成功');
            setJsonFile(null);
            setImageFile(null);
            setImagePreview(null);
            await fetchMenus();
        } catch {
            setUploadStatus('上傳失敗');
        }
        setUploading(false);
    };

    return (
        <div className="container mt-4">
            <h2>RichMenu 管理</h2>
            <form className="mb-4" onSubmit={handleUpload}>
                <div className="row g-2 align-items-center">
                    <div className="col-auto">
                        <input
                            type="file"
                            accept="application/json"
                            onChange={e => setJsonFile(e.target.files[0] || null)}
                            className="form-control"
                        />
                    </div>
                    <div className="col-auto">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files[0] || null)}
                            className="form-control"
                        />
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-primary" type="submit" disabled={uploading}>
                            {uploading ? '上傳中...' : '上傳 JSON + 圖片建立新 RichMenu'}
                        </button>
                    </div>
                    <div className="col-auto">
                        {uploadStatus && <span>{uploadStatus}</span>}
                    </div>
                    <div className="col-auto">
                        {imagePreview && (
                            <img src={imagePreview} alt="預覽" style={{ width: 80, height: 40, objectFit: 'cover', border: '1px solid #ccc' }} />
                        )}
                    </div>
                </div>
            </form>
            {loading ? (
                <div>載入中...</div>
            ) : (
                <RichMenuTable
                    menus={menus}
                    onView={handleView}
                    onSetDefault={handleSetDefault}
                    onDelete={handleDelete}
                    loadingId={loadingId}
                />
            )}
        </div>
    );
}
