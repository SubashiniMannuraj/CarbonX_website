const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user portfolio (simplified for demo)
router.get('/portfolio', async (req, res) => {
    try {
        const { data, error } = await supabase.from('portfolios').select('*, holdings(*)').single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get orders
router.get('/orders', async (req, res) => {
    try {
        const { data, error } = await supabase.from('orders').select('*').order('date', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get market stats
router.get('/stats', async (req, res) => {
    try {
        const { data, error } = await supabase.from('market_stats').select('*').single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Execute Trade
router.post('/trade', async (req, res) => {
    const { projectId, type, quantity } = req.body;
    try {
        const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();
        if (!project) return res.status(404).json({ message: "Project not found" });

        const tradeValue = project.price_current * quantity;

        await supabase.from('orders').insert([{
            id: `ORD-${Date.now()}`,
            project_name: project.name,
            type,
            quantity,
            price: project.price_current,
            total: tradeValue,
            status: 'Completed',
            date: new Date()
        }]);

        res.json({ message: "Trade executed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
