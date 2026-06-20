'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import InteractiveGlobe from '../components/InteractiveGlobe';

export default function LandingPage() {
  const { user, theme, toggleTheme } = useAuth();

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <Link href="/" style={{ ...styles.logo, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={styles.logoIcon}>🕌</span>
          <span style={styles.logoText}>TravelCity</span>
        </Link>
        <div style={styles.navLinks}>
          <button 
            onClick={toggleTheme} 
            className="btn-secondary" 
            style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <FaSun color="#f59e0b" /> : <FaMoon color="#4f46e5" />}
          </button>
          {user ? (
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-secondary" style={{ padding: '8px 16px' }}>
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '8px 16px' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header style={styles.hero} className="landing-hero-grid">
        <div style={styles.heroContent} className="glass-panel landing-hero-content-floating">
          <span style={styles.badge}>🌟 The Ultimate City Explorer Boilerplate</span>
          <h1 style={styles.title}>
            Plan, Explore & Log Your <br />
            <span style={styles.gradientText}>Dream Journeys</span>
          </h1>
          <p style={styles.subtitle}>
            A modern, collaborative travel application. Keep track of cities, countries, places, mosques, hotels, local guides, expenses, and customize your itinerary, all in one premium glassmorphic interface.
          </p>
          <div style={styles.ctaGroup}>
            {user ? (
              <Link href="/dashboard" className="btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                Enter Your Dashboard
              </Link>
            ) : (
              <>
                <Link href="/signup" className="btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                  Create Free Account
                </Link>
                <Link href="/login" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                  Explore Features
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Interactive 3D Rotating Globe */}
        <div style={styles.heroGlobeContainer} className="landing-hero-globe-fullsize">
          <InteractiveGlobe />
        </div>
      </header>

      {/* Features Grid */}
      <section style={styles.featuresSection}>
        <h2 style={styles.featuresTitle}>Unleash Your Inner Explorer</h2>
        <p style={styles.featuresSubtitle}>Everything you need to plan and document your travel experience</p>
        
        <div style={styles.featuresGrid}>
          <div className="glass-panel-interactive" style={styles.featureCard}>
            <div style={styles.featureIcon}>🗺️</div>
            <h3 style={styles.featureName}>City & Country Explorer</h3>
            <p style={styles.featureDescription}>
              Browse through curated countries and cities. Discover places of interest, local guides, and culture notes.
            </p>
          </div>

          <div className="glass-panel-interactive" style={styles.featureCard}>
            <div style={styles.featureIcon}>📅</div>
            <h3 style={styles.featureName}>Itinerary Planner</h3>
            <p style={styles.featureDescription}>
              Structure your trip day-by-day. Group cities, assign dates, and outline budgets for smooth travel execution.
            </p>
          </div>

          <div className="glass-panel-interactive" style={styles.featureCard}>
            <div style={styles.featureIcon}>💳</div>
            <h3 style={styles.featureName}>Expense Tracker</h3>
            <p style={styles.featureDescription}>
              Log transport, food, accommodation, and tickets. Keep an eye on your budget constraints in real time.
            </p>
          </div>

          <div className="glass-panel-interactive" style={styles.featureCard}>
            <div style={styles.featureIcon}>🕌</div>
            <h3 style={styles.featureName}>Halal & Local Guide Info</h3>
            <p style={styles.featureDescription}>
              Find mosques, religious notes, and connect with certified local guides for an immersive cultural experience.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 TravelCity Explorer. Crafted for travelers worldwide.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 8%',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(5, 11, 20, 0.5)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '24px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  hero: {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    padding: '80px 8% 40px',
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    maxWidth: '540px',
    padding: '36px',
    borderRadius: 'var(--radius-lg)',
    background: 'rgba(6, 78, 59, 0.25)',
    border: '1px solid rgba(217, 119, 6, 0.2)',
    backdropFilter: 'blur(20px)',
    boxShadow: 'var(--shadow-lg)',
    animation: 'fadeIn 0.6s ease forwards',
  },
  heroGlobeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '100px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    color: 'var(--primary)',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  title: {
    fontSize: '56px',
    fontWeight: '800',
    lineHeight: '1.15',
    letterSpacing: '-1px',
    marginBottom: '24px',
  },
  gradientText: {
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '40px',
  },
  ctaGroup: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap',
  },
  featuresSection: {
    padding: '100px 8%',
    background: 'rgba(11, 21, 40, 0.3)',
    textAlign: 'center',
    borderTop: '1px solid var(--border-color)',
  },
  featuresTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  featuresSubtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '60px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    padding: '32px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  featureIcon: {
    fontSize: '36px',
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
  },
  featureName: {
    fontSize: '20px',
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  footer: {
    padding: '32px',
    textAlign: 'center',
    fontSize: '14px',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border-color)',
    background: 'rgba(5, 11, 20, 0.8)',
  },
};
