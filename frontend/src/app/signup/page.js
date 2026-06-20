'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const { user, signup } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('traveler');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await signup(name, email, password, role);
      if (response.success) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setError(response.message || 'Signup failed.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Begin your city exploration journey</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a...</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.select}
            >
              <option value="traveler">Traveler / Explorer</option>
              <option value="localGuide">Local Guide</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account? </span>
          <Link href="/login" style={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    animation: 'fadeIn 0.5s ease forwards',
  },
  header: {
    marginBottom: '28px',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  select: {
    background: '#0d192d',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
    cursor: 'pointer',
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    justifyContent: 'center',
    fontSize: '16px',
    borderRadius: '8px',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid var(--danger)',
    color: '#f87171',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  success: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid var(--success)',
    color: '#34d399',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
  },
  footerText: {
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--primary)',
    fontWeight: '600',
    textDecoration: 'none',
  },
};
