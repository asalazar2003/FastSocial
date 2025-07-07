import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin ? 'http://localhost:5001/api/login' : 'http://localhost:5001/api/register';
        const payload = isLogin ? { username, password } : { username, email, password };
        try {
            const response = await axios.post(url, payload);
            if (isLogin) {
                localStorage.setItem('token', response.data.access_token);
                navigate('/dashboard');
            } else {
                setIsLogin(true);
                setError('Registro exitoso! Por favor, inicia sesión.');
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Ocurrió un error.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    {!isLogin && <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />}
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
            </div>
        </div>
    );
}

export default Login;