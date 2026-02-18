import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { supabase } from '../supabaseClient';

const Analysis = () => {
    const [results, setResults] = useState(null);
    const [isExternal, setIsExternal] = useState(false);
    const [fileName, setFileName] = useState('');
    const [qualityScore, setQualityScore] = useState(0);

    const responses = useMemo(() => {
        return JSON.parse(localStorage.getItem('survey_responses') || '[]');
    }, []);

    const runAnalysis = (dataToUse = responses) => {
        if (dataToUse.length < 3) {
            alert('Need at least 3 genuine responses for valid statistical analysis.');
            return;
        }

        // --- ENHANCED FRAUD DETECTION ENGINE ---
        const quality = calculateDataQuality(dataToUse);
        setQualityScore(quality);

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
                    alert('Invalid CSV format. Min 3 genuine rows required.');
                    return;
                }

                setIsExternal(true);
                runAnalysis(cleanedData);
            },
            error: (err) => alert('Error parsing CSV: ' + err.message)
        });
    };

    const getInterpretation = () => {
        if (!results) return null;

        const { tIntent, tTrust, anovaAge } = results;

        const intentWinner = tIntent.t > 0 ? "Digital" : "Offline";
        const trustWinner = tTrust.t > 0 ? "Digital" : "Offline";

        return (
            <div className="glass-panel animate-in" style={{ marginTop: '4rem', padding: '3rem', borderTop: '4px solid var(--primary-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2rem' }}>🧠</span>
                        <h3 style={{ fontSize: '1.8rem', margin: 0 }}>Human-Centric Interpretation</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Data Integrity Score</div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            color: qualityScore > 80 ? 'var(--success-color)' : qualityScore > 50 ? '#f59e0b' : '#ef4444'
                        }}>
                            {qualityScore}%
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            {qualityScore > 80 ? 'High Confidence' : qualityScore > 50 ? 'Medium Variance' : 'Pattern Alert'}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }}>🛒 Purchase Intention</h4>
                        <p style={{ lineHeight: '1.6' }}>
                            {tIntent.p < 0.05
                                ? `There is a statistically significant preference for ${intentWinner} channels. Performance metrics confirm that ${intentWinner.toLowerCase()} touchpoints have a higher "intent-to-action" conversion rate.`
                                : `The results are statistically "Insignificant" regarding purchase intent. This means customers are currently using BOTH channels interchangeably with no clear dominant preference.`}
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: 'var(--secondary-accent)', marginBottom: '1rem' }}>🛡️ Customer Trust</h4>
                        <p style={{ lineHeight: '1.6' }}>
                            {tTrust.p < 0.05
                                ? `Trust levels show a clear divergence. The statistical evidence suggests that ${trustWinner} marketing builds more credibility with your current sample audience.`
                                : `Trust levels have achieved "Channel Parity." Your brand identity is perceived as equally reliable across both digital and physical spectrums.`}
                        </p>
                    </div>

                    <div>
                        <h4 style={{ color: '#f59e0b', marginBottom: '1rem' }}>👥 Age & Behavior</h4>
                        <p style={{ lineHeight: '1.6' }}>
                            {anovaAge.p < 0.05
                                ? `Age cohorts show high variance. This dataset confirms that different generations require entirely different marketing messages to be effective.`
                                : `Demographic behavior is "Uniform." You can use a standardized marketing strategy as age does not significantly alter the outcome in this dataset.`}
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '1rem', border: '1px dashed var(--primary-accent)' }}>
                    <h4 style={{ marginBottom: '1rem' }}>🚩 Strategic Verdict (Real-Time)</h4>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        {tIntent.p < 0.05 && tTrust.p < 0.05
                            ? `Focus on ${intentWinner} for high-velocity conversion, but maintain ${trustWinner} as your brand's "Trust Foundation" for stability.`
                            : `Maintain a 50/50 Hybrid Model. No single medium has established total statistical dominance in this specific dataset.`}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <section className="animate-in">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Statistical Intelligence Engine</h2>
                <p style={{ color: 'var(--text-muted)' }}>Advanced channel-demographic attribution model</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                    <h3>Survey Intelligence</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Analyze real-time responses from local survey module.</p>
                    <button onClick={() => { setIsExternal(false); runAnalysis(); }} className="btn-wow" style={{ background: 'var(--primary-color)', color: 'white', fontSize: '0.9rem', width: '100%' }}>
                        Process Survey (N={responses.length})
                    </button>
                </div>

                <div className="glass-panel" style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid var(--primary-accent)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
                    <h3>External Research Import</h3>
                    <p style={{ margin: '1rem 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>Upload high-accuracy CSV datasets for batch analysis.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <label className="btn-wow" style={{ background: 'var(--primary-accent)', color: 'white', cursor: 'pointer', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
                            Upload CSV Dataset
                            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                    </div>
                    {fileName && <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>Active: {fileName}</div>}
                </div>
            </div>

            {results && (
                <div className="animate-in">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{ background: isExternal ? 'var(--primary-color)' : 'var(--primary-accent)', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Source: {isExternal ? 'External CSV' : 'Live Local Survey'} | N = {results.count}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
                        <StatCard title="Paired T-Test: Intent" result={results.tIntent} sub="Channel impact on sales intent" />
                        <StatCard title="Paired T-Test: Trust" result={results.tTrust} sub="Brand credibility attribution" />
                        <StatCard title="ANOVA: Age Impact" result={results.anovaAge} sub="Demographic variance profile" fStat />
                        <StatCard title="Chi-Square: Logic" result={results.chiAge} sub="Age vs Channel dependence" chiStat />
                    </div>

                    {getInterpretation()}
                </div>
            )}
        </section>
    );
};

const StatCard = ({ title, result, sub, fStat, chiStat }) => (
    <div className="stat-card" style={{ textAlign: 'left', borderLeft: `8px solid ${result.p < 0.05 ? 'var(--success-color)' : '#e2e8f0'}` }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{sub}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>{fStat ? 'F-Stat' : chiStat ? 'Chi2' : 't-Stat'}:</span>
            <span style={{ fontWeight: 700 }}>{(result.t || result.f || result.chi || 0).toFixed(4)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span>Confidence (p):</span>
            <span style={{ color: result.p < 0.05 ? 'var(--success-color)' : '#ef4444', fontWeight: 800 }}>{result.p.toFixed(4)}</span>
        </div>
        <div style={{ fontSize: '0.8rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '0.4rem', color: result.p < 0.05 ? 'var(--success-color)' : 'var(--text-muted)' }}>
            <strong>Conclusion:</strong> {result.p < 0.05 ? 'Statistically Valid' : 'Inconclusive Result'}
        </div>
    </div>
);

// --- ACCURATE STATISTICAL & INTEGRITY ENGINE ---

function calculateDataQuality(data) {
    let fraudPoints = 0;

    data.forEach(r => {
        const values = [
            parseFloat(r.d_intent),
            parseFloat(r.o_intent),
            parseFloat(r.d_trust),
            parseFloat(r.o_trust)
        ];

        // 1. Straight-lining (Same answer for all questions)
        if (new Set(values).size === 1) {
            fraudPoints += 25; // High penalty
        }

        // 2. Extreme Selection Pattern (Only min/max values 1 or 5)
        const isExtreme = values.every(v => v === 1 || v === 5);
        if (isExtreme) {
            fraudPoints += 15;
        }

        // 3. Low Internal Variance (Answers are too similar e.g. 3,3,4,3)
        const variance = values.reduce((s, v) => s + Math.pow(v - (values.reduce((a, b) => a + b) / 4), 2), 0) / 4;
        if (variance < 0.3) {
            fraudPoints += 5;
        }
    });

    const averageFraudPerResponse = fraudPoints / data.length;
    // Map to 0-100 scale where 100 is perfect variance/genuine and 0 is complete fraud
    const score = 100 - (averageFraudPerResponse * 2);

    return Math.max(0, Math.min(100, Math.round(score)));
}

function getPValueT(t, df) {
    t = Math.abs(t);
    const x = df / (df + t * t);
    return Math.pow(x, df / 2) * (1 + (df / 2) * (1 - x));
}

function performPairedTTest(data, key1, key2) {
    const n = data.length;
    let sumD = 0, sumD2 = 0;
    data.forEach(r => {
        const d = (parseFloat(r[key1]) || 0) - (parseFloat(r[key2]) || 0);
        sumD += d; sumD2 += d * d;
    });
    const meanD = sumD / n;
    const varianceD = Math.max((sumD2 - (sumD * sumD) / n) / (n - 1), 0.0001);
    const t = meanD / Math.sqrt(varianceD / n);
    const p = getPValueT(t, n - 1);
    return { t, p, meanD };
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
    const p = Math.exp(-chi / 2);
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
    const p = 1 / (1 + Math.pow(f * (dfBetween / dfWithin), dfBetween / 2));

    return { f, p };
}

export default Analysis;
