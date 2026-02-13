import React from 'react';

const About = () => {
    return (
        <section className="animate-in">
            <div className="glass-panel" style={{ marginBottom: '4rem' }}>
                <span style={{
                    color: 'var(--primary-accent)',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '1rem'
                }}>
                    Foundation & Methodology
                </span>
                <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Behind the Study</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                    <div>
                        <h3>Contextual Framework</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                            In the contemporary marketing landscape, the dichotomy between <strong>Digital (Clicks)</strong> and
                            <strong> Physical (Bricks)</strong> touchpoints creates a complex trust-to-transaction funnel.
                            This MBA initiative deconstructs these interactions to find where consumer loyalty is truly forged.
                        </p>
                    </div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.03)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <h3 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>The Research Core</h3>
                        <p style={{ fontSize: '0.95rem' }}>
                            "Does the perceived weight of traditional media still outperform digital micro-targeted stimuli in establishing long-term brand equity?"
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div className="stat-card">
                    <h4 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>Hypothesis H0</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>There is no statistically significant variance in purchase intention between digital and offline marketing mediums across primary demographics.</p>
                </div>
                <div className="stat-card" style={{ borderBottom: '4px solid var(--secondary-accent)' }}>
                    <h4 style={{ color: 'var(--secondary-accent)', marginBottom: '1rem' }}>Hypothesis H1</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Digital marketing stimuli yield a significantly higher conversion probability in participants aged 18-35 compared to traditional offline media.</p>
                </div>
            </div>

            <div className="glass-panel" style={{ textAlign: 'center' }}>
                <h3 style={{ marginBottom: '3rem' }}>Generational Moderation Model</h3>
                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <svg width="100%" height="300" viewBox="0 0 800 300" style={{ maxWidth: '700px' }}>
                        {/* Independent Variable */}
                        <rect x="50" y="100" width="200" height="100" rx="20" fill="var(--primary-color)" />
                        <text x="150" y="145" textAnchor="middle" fill="white" fontWeight="800">MARKETING MEDIUM</text>
                        <text x="150" y="170" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Digital vs. Offline</text>

                        {/* Arrow */}
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                                <path d="M0,0 L10,5 L0,10 Z" fill="var(--primary-color)" />
                            </marker>
                        </defs>
                        <line x1="250" y1="150" x2="540" y2="150" stroke="var(--primary-color)" strokeWidth="3" markerEnd="url(#arrow)" />

                        {/* Moderating Variable */}
                        <rect x="300" y="20" width="200" height="70" rx="15" fill="var(--primary-accent)" />
                        <text x="400" y="55" textAnchor="middle" fill="white" fontWeight="800">AGE (MODERATOR)</text>
                        <line x1="400" y1="90" x2="400" y2="150" stroke="var(--primary-accent)" strokeWidth="2" strokeDasharray="6" />

                        {/* Dependent Variable */}
                        <rect x="550" y="100" width="200" height="100" rx="20" fill="var(--primary-color)" />
                        <text x="650" y="145" textAnchor="middle" fill="white" fontWeight="800">CONSUMER RESPONSE</text>
                        <text x="650" y="170" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">Purchase Intention & Trust</text>
                    </svg>
                </div>
            </div>
        </section>
    );
};

export default About;
