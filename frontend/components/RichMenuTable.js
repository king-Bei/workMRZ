import React from 'react';

export default function RichMenuTable({ menus, onView, onSetDefault, onDelete, loadingId }) {
    return (
        <table className="table table-bordered align-middle">
            <thead>
                <tr>
                    <th>圖片</th>
                    <th>richMenuId</th>
                    <th>名稱</th>
                    <th>尺寸</th>
                    <th>是否預設</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {menus.map(menu => (
                    <tr key={menu.richMenuId}>
                        <td>
                            {menu.imageUrl ? (
                                <img src={menu.imageUrl} alt="preview" style={{ width: 80, height: 40, objectFit: 'cover' }} />
                            ) : '無'}
                        </td>
                        <td>{menu.richMenuId}</td>
                        <td>{menu.name}</td>
                        <td>{menu.size ? `${menu.size.width}x${menu.size.height}` : ''}</td>
                        <td>{menu.default ? <span className="badge bg-success">預設</span> : ''}</td>
                        <td>
                            <button className="btn btn-sm btn-info me-1" onClick={() => onView(menu)}>查看</button>
                            <button
                                className="btn btn-sm btn-warning me-1"
                                disabled={menu.default || loadingId === menu.richMenuId}
                                onClick={() => onSetDefault(menu)}
                            >
                                {loadingId === menu.richMenuId ? '設定中...' : '設為預設'}
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                disabled={loadingId === menu.richMenuId}
                                onClick={() => onDelete(menu)}
                            >
                                {loadingId === menu.richMenuId ? '刪除中...' : '刪除'}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
