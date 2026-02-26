import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Welcome, {user?.name}!</h1>
            <p>Email: {user?.email}</p>
            <button onClick={handleLogout} style={{
                padding: '0.5rem 1rem',
                marginTop: '1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
            }}>
                Logout
            </button>
        </div>
    );
};

export default Home;
