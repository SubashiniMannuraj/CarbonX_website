const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient'); // Ensure you create this config file

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user portfolio
router.get('/portfolio', async (req, res) => {
    try {
        // Fetches the single portfolio record
        const { data, error } = await supabase
            .from('portfolios')
            .select('*, holdings(*)')
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get orders
router.get('/orders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get reports
router.get('/reports', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('generated_date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Execute Trade (Buy/Sell)
router.post('/trade', async (req, res) => {
    const { projectId, type, quantity } = req.body;

    try {
        // 1. Get Project Data
        const { data: project, error: projErr } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (projErr || !project) return res.status(404).json({ message: "Project not found" });

        const tradeValue = project.price_current * quantity;

        // 2. Create Order Record
        const { error: orderErr } = await supabase
            .from('orders')
            .insert([{
                id: `ORD-${Date.now()}`,
                project_name: project.name,
                type: type,
                quantity: quantity,
                price: project.price_current,
                total: tradeValue,
                status: 'Completed',
                date: new Date()
            }]);

        if (orderErr) throw orderErr;

        // 3. Logic for updating Portfolio/Holdings tables would go here
        // Note: In SQL, it is better to manage holdings as a separate table linked by project_id
        
        res.json({ message: "Trade executed successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Get market stats
router.get('/stats', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('market_stats')
            .select('*')
            .single();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get news
router.get('/news', async (req, res) => {
    try {
        const { data: staticNews, error } = await supabase
            .from('news')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        // Keep the dynamic "Live" news generation logic from your original code
        const sources = ["Reuters", "Bloomberg Green", "Carbon Pulse", "Climate Wire", "FT Energy"];
        const headlines = [
            "Voluntary Carbon Market sees sudden liquidity spike",
            "New methodology approved for blue carbon projects",
            "Tech giants announce massive new offset purchases"
        ];

        const randomNews = [];
        if (Math.random() > 0.3) {
            randomNews.push({
                id: `live-${Date.now()}`,
                headline: headlines[Math.floor(Math.random() * headlines.length)],
                source: sources[Math.floor(Math.random() * sources.length)],
                time_ago: "Just now",
                sentiment: Math.random() > 0.7 ? "Negative" : "Positive"
            });
        }

        res.json([...randomNews, ...staticNews].slice(0, 8));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
