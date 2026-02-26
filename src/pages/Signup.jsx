import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginBg from '../assets/login-bg.jpg';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, {
                name,
                email,
                password,
                password_confirmation: confirmPassword
            });
            navigate('/');
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ general: err.response?.data?.message || 'Registration failed' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftSide}>
            </div>
            <div style={styles.rightSide}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Create Account</h2>
                    <p style={styles.subtitle}>Sign up to get started</p>
                    {errors.general && <p style={styles.generalError}>{errors.general}</p>}
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={errors.name ? {...styles.input, ...styles.inputError} : styles.input}
                                placeholder="Enter your name"
                            />
                            {errors.name && <p style={styles.fieldError}>{errors.name[0]}</p>}
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={errors.email ? {...styles.input, ...styles.inputError} : styles.input}
                                placeholder="Enter your email"
                            />
                            {errors.email && <p style={styles.fieldError}>{errors.email[0]}</p>}
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={errors.password ? {...styles.input, ...styles.inputError} : styles.input}
                                placeholder="Enter your password"
                                minLength={8}
                            />
                            {errors.password && <p style={styles.fieldError}>{errors.password[0]}</p>}
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={errors.confirmPassword ? {...styles.input, ...styles.inputError} : styles.input}
                                placeholder="Confirm your password"
                                minLength={8}
                            />
                            {errors.confirmPassword && <p style={styles.fieldError}>{errors.confirmPassword}</p>}
                        </div>
                        <button type="submit" style={styles.button} disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                    <p style={styles.footer}>
                        Already have an account? <a href="/" style={styles.link}>Sign In</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
    },
    leftSide: {
        flex: 1,
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    rightSide: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#f9fafb',
    },
    card: {
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '420px',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: 'bold',
        color: '#111',
        marginBottom: '0.5rem',
        textAlign: 'center',
    },
    subtitle: {
        color: '#6b7280',
        marginBottom: '2rem',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.9rem',
        fontWeight: '500',
        color: '#374151',
    },
    input: {
        padding: '0.875rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'border-color 0.2s',
        outline: 'none',
    },
    inputError: {
        border: '1px solid #dc2626',
    },
    fieldError: {
        color: '#dc2626',
        fontSize: '0.8rem',
    },
    generalError: {
        color: '#dc2626',
        fontSize: '0.875rem',
        textAlign: 'center',
        padding: '0.75rem',
        backgroundColor: '#fef2f2',
        borderRadius: '6px',
        marginBottom: '1rem',
    },
    button: {
        padding: '0.875rem',
        backgroundColor: '#4F46E5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginTop: '0.5rem',
        transition: 'background-color 0.2s',
    },
    footer: {
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#6b7280',
        marginTop: '1.5rem',
    },
    link: {
        color: '#4F46E5',
        textDecoration: 'none',
        fontWeight: '500',
    },
};

export default Signup;
