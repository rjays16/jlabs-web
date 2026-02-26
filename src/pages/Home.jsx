import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [geoData, setGeoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchIp, setSearchIp] = useState('');
    const [searching, setSearching] = useState(false);
    const [history, setHistory] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    api.interceptors.request.use((config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserGeoData();
        fetchHistory();
    }, []);

    const fetchUserGeoData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/api/ip/my');
            setGeoData(response.data);
        } catch (err) {
            setError('Failed to fetch IP information');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/ip/history');
            setHistory(response.data);
        } catch (err) {
            console.error('Failed to fetch history');
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchIp.trim()) {
            return;
        }

        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        
        if (!ipRegex.test(searchIp.trim())) {
            setError('Please enter a valid IP address');
            return;
        }

        setSearching(true);
        setError('');
        
        try {
            const response = await api.post('/api/ip/search', { ip: searchIp.trim() });
            setGeoData(response.data);
            fetchHistory();
        } catch (err) {
            setError('Failed to fetch information');
        } finally {
            setSearching(false);
        }
    };

    const handleClear = () => {
        setSearchIp('');
        fetchUserGeoData();
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) => 
            prev.includes(id) 
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === history.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(history.map((item) => item.id));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;
        
        try {
            await api.delete('/api/ip/history', { data: { ids: selectedItems } });
            setSelectedItems([]);
            fetchHistory();
        } catch (err) {
            console.error('Failed to delete history');
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
                <div style={styles.searchCard}>
                    <form onSubmit={handleSearch} style={styles.searchForm}>
                        <input
                            type="text"
                            value={searchIp}
                            onChange={(e) => setSearchIp(e.target.value)}
                            placeholder="Enter IP address to search"
                            style={styles.searchInput}
                        />
                        <button type="submit" style={styles.searchBtn} disabled={searching}>
                            {searching ? 'Searching...' : 'Search'}
                        </button>
                        <button type="button" onClick={handleClear} style={styles.clearBtn}>
                            Clear
                        </button>
                    </form>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>IP Information</h2>
                    
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

                <div style={styles.historyCard}>
                    <div style={styles.historyHeader}>
                        <h2 style={styles.cardTitle}>Search History</h2>
                        {selectedItems.length > 0 && (
                            <button onClick={handleDeleteSelected} style={styles.deleteBtn}>
                                Delete ({selectedItems.length})
                            </button>
                        )}
                    </div>
                    {history.length === 0 ? (
                        <p style={styles.noHistory}>No search history yet</p>
                    ) : (
                        <div style={styles.historyList}>
                            <div style={styles.historyItem} style={{ cursor: 'default', backgroundColor: '#e5e7eb' }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedItems.length === history.length && history.length > 0}
                                    onChange={handleSelectAll}
                                    style={styles.checkbox}
                                />
                                <span style={{ ...styles.historyIp, marginLeft: '0.5rem' }}>Select All</span>
                            </div>
                            {history.map((item) => (
                                <div 
                                    key={item.id} 
                                    style={{
                                        ...styles.historyItem,
                                        backgroundColor: selectedItems.includes(item.id) ? '#e0e7ff' : '#f9fafb'
                                    }}
                                >
                                    <div style={styles.historyItemLeft}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleSelectItem(item.id)}
                                            style={styles.checkbox}
                                        />
                                        <span 
                                            style={styles.historyIp}
                                            onClick={() => {
                                                setGeoData({
                                                    ip: item.ip_address,
                                                    city: item.city,
                                                    region: item.region,
                                                    country: item.country,
                                                    loc: item.location,
                                                    org: item.org,
                                                    timezone: item.timezone,
                                                });
                                            }}
                                        >
                                            {item.ip_address}
                                        </span>
                                    </div>
                                    <span style={styles.historyLocation}>
                                        {item.city ? `${item.city}, ${item.country}` : item.country || 'N/A'}
                                    </span>
                                </div>
                            ))}
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
    searchCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem',
    },
    searchForm: {
        display: 'flex',
        gap: '0.75rem',
    },
    searchInput: {
        flex: 1,
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
        outline: 'none',
    },
    searchBtn: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    clearBtn: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem',
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
        marginBottom: '1rem',
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
    historyCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    historyHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
    },
    deleteBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    checkbox: {
        width: '18px',
        height: '18px',
        cursor: 'pointer',
    },
    historyItemLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    noHistory: {
        textAlign: 'center',
        color: '#6b7280',
    },
    historyList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    historyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.75rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    historyIp: {
        fontWeight: '500',
    },
    historyLocation: {
        color: '#6b7280',
    },
};

export default Home;
