import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [geoData, setGeoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserGeoData();
    }, []);

    const fetchUserGeoData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(import.meta.env.VITE_IPINFO_URL);
            setGeoData(response.data);
        } catch (err) {
            setError('Failed to fetch IP information');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>IP Geo Location</h1>
                <div style={styles.userInfo}>
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </header>

            <main style={styles.main}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Your IP Information</h2>
                    
                    {loading && <p style={styles.loading}>Loading...</p>}
                    {error && <p style={styles.error}>{error}</p>}
                    
                    {geoData && !loading && (
                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>IP Address</span>
                                <span style={styles.infoValue}>{geoData.ip}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>City</span>
                                <span style={styles.infoValue}>{geoData.city || 'N/A'}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Region</span>
                                <span style={styles.infoValue}>{geoData.region || 'N/A'}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Country</span>
                                <span style={styles.infoValue}>{geoData.country || 'N/A'}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Location</span>
                                <span style={styles.infoValue}>{geoData.loc || 'N/A'}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Organization</span>
                                <span style={styles.infoValue}>{geoData.org || 'N/A'}</span>
                            </div>
                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Timezone</span>
                                <span style={styles.infoValue}>{geoData.timezone || 'N/A'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
    },
    header: {
        backgroundColor: '#4F46E5',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    logoutBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    main: {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    cardTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1.5rem',
        color: '#111',
    },
    loading: {
        textAlign: 'center',
        color: '#6b7280',
    },
    error: {
        color: '#dc2626',
        textAlign: 'center',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '0.75rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
    },
    infoLabel: {
        fontSize: '0.875rem',
        color: '#6b7280',
    },
    infoValue: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#111',
    },
};

export default Home;
