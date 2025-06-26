import React from 'react';

// Navbar 元件：分頁切換、顯示當前服務帳號、登出
function Navbar({ page, onChangePage, onLogout, currentService }) {
    return (
        <nav className="navbar navbar-expand bg-light border-bottom mb-3 shadow-sm">
            <div className="container-fluid">
                <div className="navbar-nav flex-row gap-2">
                    <button
                        className={`btn nav-link px-4 py-2 mx-1 rounded-3 ${page === 'richmenu' ? 'btn-gradient-active' : 'btn-gradient'}`}
                        style={{ fontWeight: page === 'richmenu' ? 700 : 400, border: 'none', transition: '0.2s' }}
                        onClick={() => onChangePage('richmenu')}
                    >
                        <i className="bi bi-grid-3x3-gap-fill me-2"></i>
                        RichMenu 管理
                    </button>
                    <button
                        className={`btn nav-link px-4 py-2 mx-1 rounded-3 ${page === 'uid' ? 'btn-gradient-active' : 'btn-gradient'}`}
                        style={{ fontWeight: page === 'uid' ? 700 : 400, border: 'none', transition: '0.2s' }}
                        onClick={() => onChangePage('uid')}
                    >
                        <i className="bi bi-person-badge-fill me-2"></i>
                        UID 綁定
                    </button>
                </div>
                <div className="d-flex align-items-center ms-auto gap-3">
                    <span className="text-secondary small">
                        當前服務：{currentService ? <b>{currentService}</b> : <span className="text-muted">未選擇</span>}
                    </span>
                    <button
                        className="btn btn-gradient-logout px-3 py-2 rounded-3"
                        style={{ fontWeight: 600, border: 'none', transition: '0.2s' }}
                        onClick={onLogout}
                    >
                        <i className="bi bi-box-arrow-right me-1"></i>
                        登出
                    </button>
                </div>
            </div>
            {/* 科技感按鈕樣式 */}
            <style>{`
                .btn-gradient {
                    background: linear-gradient(90deg, #232526 0%, #414345 100%);
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(50, 150, 255, 0.08);
                }
                .btn-gradient:hover, .btn-gradient:focus {
                    background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(50, 150, 255, 0.18);
                }
                .btn-gradient-active {
                    background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(0, 198, 255, 0.25);
                }
                .btn-gradient-logout {
                    background: linear-gradient(90deg, #ff512f 0%, #dd2476 100%);
                    color: #fff;
                    box-shadow: 0 2px 8px rgba(255, 81, 47, 0.10);
                }
                .btn-gradient-logout:hover, .btn-gradient-logout:focus {
                    background: linear-gradient(90deg, #ff512f 0%, #f09819 100%);
                    color: #fff;
                    box-shadow: 0 4px 16px rgba(255, 81, 47, 0.18);
                }
            `}</style>
            {/* Bootstrap Icons CDN（如未全域引入） */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
        </nav>
    );
}

export default Navbar;
