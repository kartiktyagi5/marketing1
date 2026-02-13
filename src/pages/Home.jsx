import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section>
            <div className="hero animate-in">
                <div className="hero-content">
                    <span style={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        background: 'rgba(255,255,255,0.15)',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '2rem',
                        display: 'inline-block',
                        marginBottom: '1.5rem'
                    }}>
                        MBA Research Project 2026
                    </span>
                    <h1>Clicks vs Bricks</h1>
                    <p>
                        A deep-dive comparative analysis of <strong>Digital</strong> vs <strong>Offline</strong> marketing influence on consumer purchase intention and brand trust metrics.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <Link to="/survey" className="btn-wow">Participate in Study</Link>
                        <Link to="/analysis" className="btn-wow" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>
                            View Data Analysis
                        </Link>
                    </div>
                </div>
            </div>

            <div className="glass-panel animate-in" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Evolution of Market Trust.</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                            As consumers balance their lives between digital screens and physical spaces, the drivers of
                            <strong> brand trust</strong> have shifted. This study explores where the real conversion happens:
                            in the palm of a hand or on a city billboard.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--primary-accent)' }}>74%</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>of surveyed Gen Z prefer digital discovery channels.</p>
                        </div>
                        <div style={{ background: 'rgba(139, 92, 246, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--secondary-accent)' }}>High</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Correlation between offline presence and premium brand trust.</p>
                        </div>
                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.1)', gridColumn: 'span 2' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--success-color)' }}>Predictive</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Our model predicts purchase intention based on cross-channel engagement stimuli.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
