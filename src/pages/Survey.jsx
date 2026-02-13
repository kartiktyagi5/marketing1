import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LikertCircle = ({ label, name, value, onChange }) => (
    <div style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '1rem', display: 'block', color: 'var(--primary-color)' }}>{label}</label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '400px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Disagree</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <div
                        key={num}
                        onClick={() => onChange(num)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: `2px solid ${value === num ? 'var(--primary-accent)' : '#e2e8f0'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            background: value === num ? 'var(--primary-accent)' : 'white',
                            color: value === num ? 'white' : 'var(--text-main)',
                            fontWeight: '700',
                            transition: 'all 0.2s ease',
                            boxShadow: value === num ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                    >
                        {num}
                    </div>
                ))}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Agree</span>
        </div>
    </div>
);

const Survey = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        age: '', gender: '', occupation: '',
        d_trust: 0, d_appeal: 0, d_intent: 0,
        o_trust: 0, o_appeal: 0, o_intent: 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.age || formData.d_trust === 0 || formData.o_trust === 0) {
            alert('Please complete all evaluation fields.');
            return;
        }

        setIsSubmitting(true);

        // Prepare cleaned data for the database
        const cleanedData = {
            age: formData.age,
            gender: formData.gender,
            occupation: formData.occupation,
            d_trust: parseInt(formData.d_trust),
            d_appeal: parseInt(formData.d_appeal),
            d_intent: parseInt(formData.d_intent),
            o_trust: parseInt(formData.o_trust),
            o_appeal: parseInt(formData.o_appeal),
            o_intent: parseInt(formData.o_intent)
        };

        try {
            // 1. Save Locally IMMEDIATELY (Safety First)
            const existing = JSON.parse(localStorage.getItem('survey_responses') || '[]');
            localStorage.setItem('survey_responses', JSON.stringify([...existing, cleanedData]));

            // 2. Attempt Sync to Supabase Cloud
            const { error } = await supabase
                .from('responses')
                .insert([cleanedData]);

            if (error) {
                console.error('Cloud Sync Error:', error.message);
                alert(`Data saved locally! Note: Cloud sync failed because: ${error.message}. Please check if the 'responses' table exists in your Supabase project.`);
            }

            // 3. Move to dashboard regardless of cloud status (since local is saved)
            navigate('/dashboard');
        } catch (err) {
            console.error('Submission Logic Error:', err);
            alert('Critical failure during save. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <section className="animate-in">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Consumer Perception Survey</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    Help us understand the psychological drivers behind marketing effectiveness in the modern age.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="glass-panel" style={{ marginBottom: '3rem' }}>
                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ background: 'var(--primary-accent)', color: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>01</span>
                        Demographic Profiling
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Age Cohort</label>
                            <select className="form-control" value={formData.age} onChange={(e) => updateField('age', e.target.value)} required>
                                <option value="">Select Age</option>
                                <option value="18-30">18–30 (Gen Z / Young Millennial)</option>
                                <option value="31-50">31–50 (Millennial / Gen X)</option>
                                <option value="50+">50+ (Baby Boomer / Silent)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Occupation</label>
                            <input type="text" className="form-control" placeholder="Professional Title" value={formData.occupation} onChange={(e) => updateField('occupation', e.target.value)} required />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '2rem' }}>
                        <span style={{ color: 'var(--primary-accent)' }}>Comparative Analysis</span>
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
                        {/* Offline Card */}
                        <div className="ad-card" style={{ border: '1px solid #e2e8f0' }}>
                            <div className="ad-img-wrapper" style={{ position: 'relative' }}>
                                <img src="https://storage.googleapis.com/sales.appinst.io/2019/04/the-ultimate-guide-to-offline-marketing.png" alt="Offline Billboard Advertisement" />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    right: '0',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                    color: 'white',
                                    padding: '2rem 1.5rem 1rem',
                                    fontSize: '1.2rem',
                                    fontWeight: '900',
                                    letterSpacing: '1px'
                                }}>
                                    OFFLINE MARKET
                                    <div style={{ fontSize: '0.7rem', fontWeight: '400', opacity: 0.8, marginTop: '0.2rem' }}>Traditional Billboard & Physical Stimuli</div>
                                </div>
                            </div>
                            <div style={{ padding: '2.5rem' }}>
                                <LikertCircle label="Trust in the brand" value={formData.o_trust} onChange={(v) => updateField('o_trust', v)} />
                                <LikertCircle label="Appeal of the ad" value={formData.o_appeal} onChange={(v) => updateField('o_appeal', v)} />
                                <LikertCircle label="Likelihood to buy" value={formData.o_intent} onChange={(v) => updateField('o_intent', v)} />
                            </div>
                        </div>

                        {/* Digital Card */}
                        <div className="ad-card" style={{ border: '1px solid #e2e8f0' }}>
                            <div className="ad-img-wrapper" style={{ position: 'relative' }}>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTboMbQFH9Fm1he_uneOlSoLwckG3T02_cWEw&s" alt="Online Digital Advertisement" />
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    right: '0',
                                    background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)',
                                    color: 'white',
                                    padding: '2rem 1.5rem 1rem',
                                    fontSize: '1.2rem',
                                    fontWeight: '900',
                                    letterSpacing: '1px'
                                }}>
                                    ONLINE MARKET
                                    <div style={{ fontSize: '0.7rem', fontWeight: '400', opacity: 0.8, marginTop: '0.2rem' }}>Digital Campaigns & Social Micro-Targets</div>
                                </div>
                            </div>
                            <div style={{ padding: '2.5rem' }}>
                                <LikertCircle label="Trust in the brand" value={formData.d_trust} onChange={(v) => updateField('d_trust', v)} />
                                <LikertCircle label="Appeal of the ad" value={formData.d_appeal} onChange={(v) => updateField('d_appeal', v)} />
                                <LikertCircle label="Likelihood to buy" value={formData.d_intent} onChange={(v) => updateField('d_intent', v)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', paddingBottom: '4rem' }}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-wow"
                        style={{
                            padding: '1.5rem 5rem',
                            background: isSubmitting ? 'var(--text-muted)' : 'var(--primary-color)',
                            color: 'white',
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Syncing to Intelligence Cloud...' : 'Submit Research Data'}
                    </button>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>* Your data will be anonymous and used for academic research only.</p>
                </div>
            </form>
        </section>
    );
};

export default Survey;
