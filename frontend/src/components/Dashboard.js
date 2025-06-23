import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [content, setContent] = useState('');
    const [accountId, setAccountId] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [error, setError] = useState('');

    const api = axios.create({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        fetchPosts();
        fetchAccounts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await api.get('http://localhost:5001/api/posts');
            setPosts(response.data);
        } catch (err) {
            setError('No se pudieron cargar las publicaciones.');
        }
    };

    const fetchAccounts = async () => {
        try {
            const response = await api.get('http://localhost:5001/api/accounts');
            setAccounts(response.data);
            if (response.data.length > 0) {
                setAccountId(response.data[0].id);
            }
        } catch (err) {
            setError('No se pudieron cargar las cuentas.');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content || !accountId || !scheduledAt) {
            setError('Todos los campos son requeridos.');
            return;
        }
        try {
            await api.post('http://localhost:5001/api/posts', {
                content,
                account_id: accountId,
                scheduled_at: scheduledAt
            });
            setContent('');
            setScheduledAt('');
            setError('');
            fetchPosts();
        } catch (err) {
            setError('Error al programar la publicación.');
        }
    };

    return (
        <div className="page-container">
            <h1>Dashboard</h1>
            <div className="form-card">
                <h3>Programar Nueva Publicación</h3>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="¿Qué estás pensando?"></textarea>
                    <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.username} ({acc.platform})</option>)}
                    </select>
                    <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
                    <button type="submit">Programar</button>
                </form>
            </div>
            <div className="list-card">
                <h3>Publicaciones Programadas</h3>
                {posts.map(post => (
                    <div key={post.id} className="post-item">
                        <p><strong>{post.account_username}</strong> ({post.account_platform})</p>
                        <p>{post.content}</p>
                        <small>Programado para: {new Date(post.scheduled_at).toLocaleString()}</small>
                        <span className={`status-badge status-${post.status}`}>{post.status}</span>
                         <Link to={`/analytics/${post.id}`} className="metrics-link">Ver Métricas</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;