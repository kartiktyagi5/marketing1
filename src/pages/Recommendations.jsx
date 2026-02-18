import React from 'react';

const Recommendations = () => {
    const responses = JSON.parse(localStorage.getItem('survey_responses') || '[]');
    const total = responses.length;

    if (total < 1) {
        return (
            <div className="glass-panel animate-in" style={{ textAlign: 'center', margin: '4rem auto', maxWidth: '600px', padding: '4rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📉</div>
                <h2>Insufficient Dataset</h2>
                <p style={{ color: 'var(--text-muted)' }}>Please collect at least 1 response to generate strategic insights.</p>
            </div>
        );
    }

    const avg = (key) => responses.reduce((sum, r) => sum + (parseFloat(r[key]) || 0), 0) / total;

    // Core KPIs
    const dI = avg('d_intent'), oI = avg('o_intent');
    const dT = avg('d_trust'), oT = avg('o_trust');

    // Advanced Logic for Demographic Recommendation
    const groups = { '18-30': 0, '31-50': 0, '50+': 0 };
    const groupCounts = { '18-30': 0, '31-50': 0, '50+': 0 };

    responses.forEach(r => {
        if (groups[r.age] !== undefined) {
            groups[r.age] += parseFloat(r.d_intent) || 0;
            groupCounts[r.age]++;
        }
    });

    const ageAverages = {
        young: groupCounts['18-30'] > 0 ? groups['18-30'] / groupCounts['18-30'] : 0,
        old: groupCounts['50+'] > 0 ? groups['50+'] / groupCounts['50+'] : 0
    };

    const RecommendationCard = ({ icon, title, description, color }) => (
        <div className="stat-card" style={{ textAlign: 'left', display: 'flex', gap: '2rem', alignItems: 'center', borderLeft: `8px solid ${color}` }}>
            <div style={{ fontSize: '3rem' }}>{icon}</div>
            <div>
                <h4 style={{ color: color, marginBottom: '0.5rem', fontSize: '1.2rem' }}>{title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{description}</p>
            </div>
        </div>
    );

    return (
        <section className="animate-in">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Strategic Recommendations</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                    Machine-analyzed business intelligence derived from <strong>{total} genuine data points</strong>.
                </p>
            </div>

            <div style={{ display: 'grid', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                <RecommendationCard
                    icon="🎯"
                    title="Channel Optimization"
                    color="var(--primary-accent)"
                    description={dI > oI
                        ? `Digital intent is currently ${(((dI / Math.max(oI, 1)) - 1) * 100).toFixed(1)}% higher than offline. Recommendation: Reallocate 15% of Billboard budget to Social Performance ads.`
                        : oI > dI
                            ? `Offline channels are outperforming digital by ${(((oI / Math.max(dI, 1)) - 1) * 100).toFixed(1)}%. Focus on high-traffic physical locations and experiential pop-ups.`
                            : "Both channels are at total parity. Maintain current balanced spending."}
                />

                <RecommendationCard
                    icon="🛡️"
                    title="Trust Integrity"
                    color="var(--secondary-accent)"
                    description={oT > dT + 0.5
                        ? "A significant 'Digital Trust Gap' exists. Use Offline media for high-credibility claims and Digital for broad awareness only."
                        : dT > oT + 0.5
                            ? "Digital trust has surpassed physical. Leverage influencer-led social proof as your primary credibility driver."
                            : "Trust levels are stable across mediums. You can launch complex products on both channels with equal reliability."}
                />

                <RecommendationCard
                    icon="👥"
                    title="Demographic Strategy"
                    color="var(--primary-color)"
                    description={Math.abs(ageAverages.young - ageAverages.old) > 0.5
                        ? `Heavy Demographic Skew: The ${ageAverages.young > ageAverages.old ? '18-30' : '50+'} segment is your primary driver for Digital adoption. Create a separate mobile-native funnel for this cohort.`
                        : "Demographic Uniformity: Your marketing strategy is resonating equally across all age groups. A unified brand voice is highly recommended for maximum ROI."}
                />
            </div>

            <div className="hero" style={{ marginTop: '5rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '2rem' }}>
                <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Core Strategic Verdict</h3>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
                    Based on current dataset (N={total}), we recommend an <strong>{dI > oI ? 'Online-Led' : 'Offline-Led'} Hybrid Model</strong>.
                    {oT > dT ? " Leverage physical touchpoints to anchor brand trust," : " Leverage digital transparency to maintain credibility,"}
                    and use {dI > oI ? 'Digital' : 'Offline'} for the final conversion push.
                </p>
            </div>
        </section>
    );
};

export default Recommendations;
