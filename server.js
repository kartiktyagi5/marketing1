import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
    res.json({ status: 'Intelligence API Online', version: '1.0.0' });
});

// Endpoint: Fetch Research Highlights
app.get('/api/research-summary', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('responses')
            .select('*');

        if (error) throw error;

        const total = data.length;
        if (total === 0) return res.json({ message: 'No research data found' });

        // Server-side Aggregation
        const avg = (key) => data.reduce((s, r) => s + (r[key] || 0), 0) / total;

        res.json({
            success: true,
            data: {
                total_sample: total,
                averages: {
                    digital_intent: avg('d_intent'),
                    offline_intent: avg('o_intent'),
                    digital_trust: avg('d_trust'),
                    offline_trust: avg('o_trust')
                }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Researcher Backend active on port ${PORT}`);
});
