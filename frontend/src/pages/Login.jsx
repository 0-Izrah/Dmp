import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/manage');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="login-page" style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'var(--color-surface)', borderRadius: '8px' }}>
            <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h1>
            {error && <div className="error" style={{ minHeight: 'auto', marginBottom: '1rem', color: '#f44' }}>{error}</div>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                        style={{ padding: '0.5rem' }}
                    />
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" style={{ padding: '0.75rem', background: 'var(--color-text)', color: 'var(--color-bg)', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem' }}>Login</button>
            </form>
        </div>
    );
}