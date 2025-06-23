import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Analytics() {
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState('');
    const { postId } = useParams();

    const api = axios.create({
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get(`http://localhost:5001/api/posts/${postId}/metrics`);
                setMetrics(response.data);
            } catch (err) {
                setError('No se pudieron cargar las métricas.');
            }
        };
        fetchMetrics();
    }, [postId]);

    if (error) return <p className="error-msg">{error}</p>;
    if (!metrics) return <p>Cargando métricas...</p>;

    return (
        <div className="page-container">
            <h1>Métricas de la Publicación</h1>
            <div className="list-card">
                <p className="post-content-preview">"{metrics.content}"</p>
                <div className="metrics-grid">
                    <div className="metric-box">
                        <span className="metric-value">{metrics.likes}</span>
                        <span className="metric-label">Likes</span>
                    </div>
                    <div className="metric-box">
                        <span className="metric-value">{metrics.comments}</span>
                        <span className="metric-label">Comentarios</span>
                    </div>
                    <div className="metric-box">
                        <span className="metric-value">{metrics.shares}</span>
                        <span className="metric-label">Compartidos</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;