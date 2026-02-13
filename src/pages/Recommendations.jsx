import React from 'react';

const Recommendations = () => {
    const responses = JSON.parse(localStorage.getItem('survey_responses') || '[]');
    const total = responses.length;

    if (total === 0) {
        return <div className="glass-panel animate-in" style={{ textAlign: 'center', margin: '4rem auto', maxWidth: '600px' }}><h2>Insufficient Intelligence Data</h2></div>;
    }

    const avg = (key) => responses.reduce((sum, r) => sum + (r[key] || 0), 0) / total;
    const dI = avg('d_intent'), oI = avg('o_intent');
    const dT = avg('d_trust'), oT = avg('o_trust');

    const RecommendationCard = ({ icon, title, description, color }) => (
        <div className="stat-card" style={{ textAlign: 'left', display: 'flex', gap: '2rem', alignItems: 'center', borderLeft: `8px solid ${color}` }}>
            <div style={{ fontSize: '3rem' }}>{icon}</div>
            <div>
                <h4 style={{ color: color, marginBottom: '0.5rem', fontSize: '1.2rem' }}>{title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{description}</p>
            </div>
        </div>
    );

    return (
        <section className="animate-in">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Strategic Recommendations</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Automated business intelligence derived from current research datasets.</p>
            </div>

            <div style={{ display: 'grid', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                <RecommendationCard
                    icon="🎯"
                    title="Channel Optimization"
                    color="var(--primary-accent)"
                    description={dI > oI
                        ? `Digital conversion is outperforming offline by ${(((dI / oI) - 1) * 100).toFixed(1)}%. We recommend aggressive reallocation of performance marketing spend toward digital channels.`
                        : "Offline channels maintain a superior intent capture. Stay focused on high-impact physical touchpoints and billboard ecosystems."}
                />

                <RecommendationCard
                    icon="🛡️"
                    title="Trust Integrity"
                    color="var(--secondary-accent)"
                    description={oT > dT
                        ? "The 'Trust Deficit' in digital media remains significant. Leverage traditional 'Bricks' media for high-stakes product launches and credibility campaigns."
                        : "Digital trust has achieved parity. Focus on influencer-driven transparency and social proof to maintain current credibility levels."}
                />

                <RecommendationCard
                    icon="👥"
                    title="Demographic Bimodalism"
                    color="var(--primary-color)"
                    description="Our model confirms a divergent strategic requirement: Build a separate mobile-native funnel for the 18-35 segment while maintaining legacy channel integrity for 50+ cohorts."
                />
            </div>

            <div className="hero" style={{ marginTop: '5rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Core Strategic Verdict</h3>
                <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '700px', margin: '0 auto' }}>
                    To maximize ROI, your marketing architecture must move toward an <strong>Integrated Hybrid Model</strong>:
                    utilizing {oT > dT ? 'Offline' : 'Digital'} for brand foundation and {dI > oI ? 'Digital' : 'Offline'} for conversion velocity.
                </p>
            </div>
        </section>
    );
};

export default Recommendations;
