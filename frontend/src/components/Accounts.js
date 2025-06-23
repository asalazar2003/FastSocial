import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [platform, setPlatform] = useState('Facebook');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    
    const api = axios.create({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await api.get('http://localhost:5001/api/accounts');
            setAccounts(response.data);
        } catch (err) {
            setError('No se pudieron cargar las cuentas.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('http://localhost:5001/api/accounts/add', { platform, username });
            setUsername('');
            setError('');
            fetchAccounts();
        } catch (err) {
            setError('Error al añadir la cuenta.');
        }
    };

    return (
        <div className="page-container">
            <h1>Gestionar Cuentas</h1>
            <div className="form-card">
                <h3>Añadir Nueva Cuenta</h3>
                <p className="info-text">En una aplicación real, esto te redirigiría a {platform} para autorizar.</p>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                        <option value="Facebook">Facebook</option>
                        <option value="Twitter">Twitter</option>
                    </select>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username de la red social" required />
                    <button type="submit">Añadir Cuenta</button>
                </form>
            </div>
            <div className="list-card">
                <h3>Cuentas Conectadas</h3>
                {accounts.map(acc => (
                    <div key={acc.id} className="account-item">
                        <span className={`platform-icon ${acc.platform.toLowerCase()}`}>{acc.platform.charAt(0)}</span>
                        <span>{acc.username}</span>
                        <span className="platform-name">{acc.platform}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Accounts;