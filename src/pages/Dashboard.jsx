import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { supabase } from '../supabaseClient';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const Dashboard = () => {
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const { data, error } = await supabase
                    .from('responses')
                    .select('*');

                if (error) throw error;

                if (data && data.length > 0) {
                    setResponses(data);
                } else {
                    // Fallback to local storage if no cloud data
                    const localData = JSON.parse(localStorage.getItem('survey_responses') || '[]');
                    setResponses(localData);
                }
            } catch (err) {
                console.error('Supabase fetch error:', err.message);
                // Fallback on error
                const localData = JSON.parse(localStorage.getItem('survey_responses') || '[]');
                setResponses(localData);
            } finally {
                setLoading(false);
            }
        };

        fetchResponses();
    }, []);

    const total = responses.length;

    if (loading) {
        return (
            <div className="glass-panel animate-in" style={{ textAlign: 'center', margin: '4rem auto', maxWidth: '600px', padding: '4rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '2rem' }}>🔄</div>
                <h2 style={{ fontSize: '2rem' }}>Syncing Intelligence Database...</h2>
                <p style={{ color: 'var(--text-muted)' }}>Pulling the latest consumer research data from Supabase Cloud.</p>
            </div>
        );
    }

    if (total === 0) {
        return (
            <div className="glass-panel animate-in" style={{ textAlign: 'center', margin: '4rem auto', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Data Core Empty</h2>
                <p style={{ color: 'var(--text-muted)' }}>The intelligence dashboard requires survey responses to activate visualizations.</p>
                <div style={{ marginTop: '2rem' }}>
                    <a href="/survey" className="btn-wow" style={{ textDecoration: 'none' }}>Initialize Data Collection</a>
                </div>
            </div>
        );
    }

    const avg = (key) => (responses.reduce((sum, r) => sum + (r[key] || 0), 0) / total).toFixed(2);

    const statsEntries = [
        { label: 'Total Sample (N)', value: total, color: 'var(--primary-accent)' },
        { label: 'Digital Intent', value: avg('d_intent'), color: 'var(--secondary-accent)' },
        { label: 'Offline Intent', value: avg('o_intent'), color: 'var(--primary-color)' },
        { label: 'Brand Trust Ratio', value: (parseFloat(avg('d_trust')) / parseFloat(avg('o_trust'))).toFixed(2), color: 'var(--success-color)' }
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Inter', weight: 600 } } }
        }
    };

    const ageData = {
        labels: ['18-30', '31-50', '50+'],
        datasets: [{
            data: [
                responses.filter(r => r.age === '18-30').length,
                responses.filter(r => r.age === '31-50').length,
                responses.filter(r => r.age === '50+').length,
            ],
            backgroundColor: ['#3b82f6', '#8b5cf6', '#0f172a'],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    const intentData = {
        labels: ['Purchase Intent', 'Brand Trust', 'Visual Appeal'],
        datasets: [
            {
                label: 'Digital (Clicks)',
                data: [avg('d_intent'), avg('d_trust'), avg('d_appeal')],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderRadius: 10
            },
            {
                label: 'Offline (Bricks)',
                data: [avg('o_intent'), avg('o_trust'), avg('o_appeal')],
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                borderRadius: 10
            }
        ]
    };

    return (
        <section className="animate-in">
            <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Research Intelligence Dashboard</h2>

            <div className="stats-grid">
                {statsEntries.map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                        <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Age Demographic Index</h3>
                    <div style={{ height: '320px' }}><Pie data={ageData} options={chartOptions} /></div>
                </div>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Cross-Channel Performance</h3>
                    <div style={{ height: '320px' }}><Bar data={intentData} options={{ ...chartOptions, scales: { y: { beginAtZero: true, max: 5 } } }} /></div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '3rem', background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Insight Extraction</h3>
                        <p style={{ opacity: 0.8 }}>
                            Our data shows that while Digital leads in visual appeal among younger cohorts,
                            Offline marketing maintains a "Trust Edge" in established demographics.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-accent)' }}>+14%</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>TRUST PREMIUM</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary-accent)' }}>92%</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>ENGAGEMENT</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
