import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import LoginPage from './LoginPage';
import ServiceSelector from './ServiceSelector';
import RichMenuPage from './RichMenuPage';
import UIDManagerPage from './UIDManagerPage';
import Navbar from './Navbar';
import apiFetch from './api';
import { showAlert, setLoading } from './api';

// Spinner 元件
function Spinner() {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
            <div className="spinner-border text-primary" role="status" style={{ width: 48, height: 48 }}>
                <span className="visually-hidden">載入中...</span>
            </div>
        </div>
    );
}

// Alert 元件
function Alert({ type, message, onClose }) {
    if (!message) return null;
    return (
        <div className={`alert alert-${type} alert-dismissible fade show`} role="alert" style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000, minWidth: 240 }}>
            {message}
            <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
    );
}

// Context API for global state
const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

// App.js：主控邏輯，負責登入判斷、JWT 儲存、分頁切換、登出、token 驗證
function App() {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
    const [page, setPage] = useState('richmenu');
    const [currentService, setCurrentService] = useState('');
    const [checking, setChecking] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });
    const [globalLoading, setGlobalLoading] = useState(false);

    // 驗證 JWT 是否有效，若無效則自動登出
    const checkToken = useCallback(async () => {
        if (!localStorage.getItem('token')) {
            setLoggedIn(false);
            setChecking(false);
            return;
        }
        try {
            await apiFetch('/key', { method: 'GET' });
            setLoggedIn(true);
        } catch {
            handleLogout();
        }
        setChecking(false);
    }, []);

    useEffect(() => {
        checkToken();
    }, [checkToken]);

    // 全域 alert/loading 事件監聽
    useEffect(() => {
        const onAlert = e => setAlert(e.detail);
        const onLoading = e => setGlobalLoading(e.detail);
        window.addEventListener('app-alert', onAlert);
        window.addEventListener('app-loading', onLoading);
        return () => {
            window.removeEventListener('app-alert', onAlert);
            window.removeEventListener('app-loading', onLoading);
        };
    }, []);

    // 登出功能
    function handleLogout() {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setCurrentService('');
        setPage('richmenu');
    }

    // 登入成功後
    function handleLogin() {
        setLoggedIn(true);
        setPage('richmenu');
        setChecking(false);
    }

    // 分頁切換
    function handleChangePage(p) {
        setPage(p);
    }

    // 切換服務
    function handleServiceChange(service) {
        setCurrentService(service);
    }

    if (checking || globalLoading) {
        return <Spinner />;
    }

    if (!loggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn, currentService, setCurrentService }}>
            <div className="bg-light min-vh-100">
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
                <Navbar page={page} onChangePage={handleChangePage} onLogout={handleLogout} currentService={currentService} />
                <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div className="py-3">
                        <ServiceSelector currentService={currentService} onChange={handleServiceChange} />
                        <div className="mt-4">
                            {page === 'richmenu' && <RichMenuPage service={currentService} />}
                            {page === 'uid' && <UIDManagerPage service={currentService} />}
                        </div>
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;
