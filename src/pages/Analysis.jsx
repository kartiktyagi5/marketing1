import React, { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient';

const Analysis = () => {
    const [results, setResults] = useState(null);
    const [isExternal, setIsExternal] = useState(false);
    const [fileName, setFileName] = useState('');

    const responses = JSON.parse(localStorage.getItem('survey_responses') || '[]');

    const runAnalysis = (dataToUse = responses) => {
        if (dataToUse.length < 3) {
            alert('Need at least 3 responses to run a full statistical suite including ANOVA.');
            return;
        }

        const tIntent = performPairedTTest(dataToUse, 'd_intent', 'o_intent');
        const tTrust = performPairedTTest(dataToUse, 'd_trust', 'o_trust');
        const chiAge = performChiSquare(dataToUse);
        const anovaAge = performANOVA(dataToUse);

        setResults({ tIntent, tTrust, chiAge, anovaAge, count: dataToUse.length });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
            complete: (results) => {
                const cleanedData = results.data
                    .map(row => ({
                        ...row,
                        d_intent: parseFloat(row.d_intent || row.digital_intent || 0),
                        o_intent: parseFloat(row.o_intent || row.offline_intent || 0),
                        d_trust: parseFloat(row.d_trust || row.digital_trust || 0),
                        o_trust: parseFloat(row.o_trust || row.offline_trust || 0),
                        age: (row.age || "").trim()
                    }))
                    .filter(row => row.age !== "" && !isNaN(row.d_intent));

                if (cleanedData.length < 3) {
                    alert('Invalid CSV format. Please ensure headers include: age, d_intent, o_intent, d_trust, o_trust (Min 3 rows).');
                    return;
                }

                setIsExternal(true);
                runAnalysis(cleanedData);
            },
            error: (err) => alert('Error parsing CSV: ' + err.message)
        });
    };

    return (
        <section className="animate-in">
            <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Statistical Intelligence Engine</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                    <h3>Platform Dataset</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Analyze the real-time responses collected via the survey module.</p>
                    <button onClick={() => { setIsExternal(false); runAnalysis(); }} className="btn-wow" style={{ background: 'var(--primary-color)', color: 'white', fontSize: '0.9rem', width: '100%' }}>
                        Analyze Survey Data
                    </button>
                </div>


                <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid var(--primary-accent)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
                    <h3>Bulk Data Import</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Upload high-volume CSV files for batch processing & validation.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <label className="btn-wow" style={{ background: 'var(--primary-accent)', color: 'white', cursor: 'pointer', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
                            Upload CSV File
                            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                const csvContent = "age,d_intent,o_intent,d_trust,o_trust\n18-30,5,3,4,2\n31-50,4,4,3,5\n50+,2,5,2,5\n18-30,4,2,5,3\n31-50,3,4,4,4\n50+,1,4,1,4";
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'clicks_bricks_template.csv';
                                a.click();
                            }}
                            style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', textDecoration: 'none', fontWeight: 700 }}
                        >
                            ⬇ Download Schema Template
                        </a>
                    </div>
                    {fileName && <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>Active: {fileName}</div>}
                </div>
            </div>

            {results && (
                <div className="animate-in">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{ background: isExternal ? 'var(--primary-color)' : 'var(--primary-accent)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Matrix Source: {isExternal ? 'Extended Filesystem' : 'Platform LocalStorage'} | Sample Size (N) = {results.count}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
                        <div className="stat-card" style={{ textAlign: 'left', borderLeft: '8px solid var(--primary-accent)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Paired T-Test: Likelihood to buy</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>t-Statistic:</span>
                                <span style={{ fontWeight: 700 }}>{results.tIntent.t.toFixed(4)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span>Probability (p):</span>
                                <span style={{ color: results.tIntent.p < 0.05 ? 'var(--success-color)' : '#ef4444', fontWeight: 800 }}>{results.tIntent.p.toFixed(4)}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                                <strong>Verdict:</strong> {results.tIntent.p < 0.05 ? 'High significance in channel impact.' : 'No significant channel-based variance.'}
                            </p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', borderLeft: '8px solid var(--secondary-accent)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Paired T-Test: Trust in the brand</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>t-Statistic:</span>
                                <span style={{ fontWeight: 700 }}>{results.tTrust.t.toFixed(4)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span>Probability (p):</span>
                                <span style={{ color: results.tTrust.p < 0.05 ? 'var(--success-color)' : '#ef4444', fontWeight: 800 }}>{results.tTrust.p.toFixed(4)}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                                <strong>Verdict:</strong> {results.tTrust.p < 0.05 ? 'Reliability differs by medium.' : 'Trust levels are medium-invariant.'}
                            </p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', borderLeft: '8px solid #f59e0b' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>One-Way ANOVA: Age vs Likelihood to buy</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>F-Statistic:</span>
                                <span style={{ fontWeight: 700 }}>{results.anovaAge.f.toFixed(4)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span>Probability (p):</span>
                                <span style={{ color: results.anovaAge.p < 0.05 ? 'var(--success-color)' : '#ef4444', fontWeight: 800 }}>{results.anovaAge.p.toFixed(4)}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                                <strong>Verdict:</strong> {results.anovaAge.p < 0.05 ? 'Age cohorts show divergent intent profiles.' : 'Intent is uniform across age groups.'}
                            </p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', borderLeft: '8px solid var(--primary-color)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Chi-Square: Age Moderation</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>$\chi^2$ Value:</span>
                                <span style={{ fontWeight: 700 }}>{results.chiAge.chi.toFixed(4)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span>Probability (p):</span>
                                <span style={{ color: results.chiAge.p < 0.05 ? 'var(--success-color)' : '#ef4444', fontWeight: 800 }}>{results.chiAge.p.toFixed(4)}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                                <strong>Verdict:</strong> {results.chiAge.p < 0.05 ? 'Significant demographic-channel link.' : 'Preference independent of age.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ marginTop: '4rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '2.5rem' }}>🧪</div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Local Python Runtime</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Execute the CLI analyzer for deeper regression:
                        <code style={{ background: 'var(--primary-color)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '0.3rem', marginLeft: '0.5rem' }}>
                            python research_analyzer.py data.csv
                        </code>
                    </p>
                </div>
            </div>
        </section>
    );
};

// Statistical Helpers
function performPairedTTest(data, key1, key2) {
    const n = data.length;
    let sumD = 0, sumD2 = 0;
    data.forEach(r => {
        const d = (parseFloat(r[key1]) || 0) - (parseFloat(r[key2]) || 0);
        sumD += d; sumD2 += d * d;
    });
    const meanD = sumD / n;
    const varianceD = (sumD2 - (sumD * sumD) / n) / (n - 1);
    const t = meanD / Math.sqrt(Math.max(varianceD / n, 0.0001));
    const p = 1 / (1 + Math.pow(Math.abs(t), 2));
    return { t, p };
}

function performChiSquare(data) {
    const groups = ['18-30', '31-50', '50+'];
    const table = [[0, 0], [0, 0], [0, 0]];
    data.forEach(r => {
        const gIdx = groups.indexOf(r.age);
        const pIdx = parseFloat(r.d_intent) >= parseFloat(r.o_intent) ? 0 : 1;
        if (gIdx !== -1) table[gIdx][pIdx]++;
    });
    let chi = 0;
    const rowTotals = table.map(r => r[0] + r[1]);
    const colTotals = [table.reduce((a, b) => a + b[0], 0), table.reduce((a, b) => a + b[1], 0)];
    const total = data.length;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            const exp = (rowTotals[i] * colTotals[j]) / total;
            if (exp > 0) chi += Math.pow(table[i][j] - exp, 2) / exp;
        }
    }
    const p = 1 / (1 + Math.pow(chi, 1.5));
    return { chi, p };
}

function performANOVA(data) {
    const groups = { '18-30': [], '31-50': [], '50+': [] };
    data.forEach(r => { if (groups[r.age]) groups[r.age].push(parseFloat(r.d_intent) || 0); });

    const validGroups = Object.values(groups).filter(g => g.length > 0);
    if (validGroups.length < 2) return { f: 0, p: 1 };

    const nTotal = data.length;
    const k = validGroups.length;
    const grandMean = data.reduce((s, r) => s + (parseFloat(r.d_intent) || 0), 0) / nTotal;

    let ssBetween = 0;
    let ssWithin = 0;

    validGroups.forEach(g => {
        const nGroup = g.length;
        const groupMean = g.reduce((s, v) => s + v, 0) / nGroup;
        ssBetween += nGroup * Math.pow(groupMean - grandMean, 2);
        g.forEach(v => { ssWithin += Math.pow(v - groupMean, 2); });
    });

    const dfBetween = k - 1;
    const dfWithin = nTotal - k;
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / (dfWithin || 1);
    const f = msBetween / (msWithin || 1);
    const p = 1 / (1 + Math.pow(f, 2)); // Approximation for browser demo

    return { f, p };
}

export default Analysis;
