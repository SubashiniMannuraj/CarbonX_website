const express = require('express');
const router = express.Router();
const { Project, MarketStat, News, Portfolio, Order, Report } = require('../models/schemas');

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user portfolio
router.get('/portfolio', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne();
        res.json(portfolio);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get reports
router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ generated_date: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Execute Trade (Buy/Sell)
router.post('/trade', async (req, res) => {
    const { projectId, type, quantity } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        let portfolio = await Portfolio.findOne();
        if (!portfolio) {
            // Create default if not exists
            portfolio = new Portfolio({
                total_value: 0,
                total_yield: 0,
                yield_percent: 0,
                trees_planted: 0,
                holdings: []
            });
        }

        const tradeValue = project.price.current * quantity;

        // Create Order Record
        const newOrder = new Order({
            id: `ORD-${Date.now()}`,
            project_name: project.name,
            type: type, // 'Buy' or 'Sell'
            quantity: quantity,
            price: project.price.current,
            total: tradeValue,
            status: 'Completed',
            date: new Date()
        });
        await newOrder.save();

        if (type === 'Buy') {
            // Update Portfolio
            const existingHolding = portfolio.holdings.find(h => h.project_id.toString() === projectId);

            if (existingHolding) {
                // Update existing
                const totalCost = (existingHolding.quantity * existingHolding.avg_price) + tradeValue;
                const newQuantity = existingHolding.quantity + parseInt(quantity);
                existingHolding.avg_price = totalCost / newQuantity;
                existingHolding.quantity = newQuantity;
                existingHolding.value = newQuantity * project.price.current;
                existingHolding.current_price = project.price.current;
            } else {
                // Add new
                portfolio.holdings.push({
                    project_id: project._id,
                    project_name: project.name,
                    quantity: parseInt(quantity),
                    avg_price: project.price.current,
                    current_price: project.price.current,
                    value: tradeValue,
                    gain_loss: 0,
                    gain_loss_percent: 0
                });
            }

            portfolio.total_value += tradeValue;
            portfolio.trees_planted += parseInt(quantity); // impactful assumption

        } else if (type === 'Sell') {
            const existingHolding = portfolio.holdings.find(h => h.project_id.toString() === projectId);
            if (!existingHolding || existingHolding.quantity < quantity) {
                return res.status(400).json({ message: "Insufficient holdings" });
            }

            existingHolding.quantity -= parseInt(quantity);
            existingHolding.value = existingHolding.quantity * project.price.current;

            if (existingHolding.quantity === 0) {
                portfolio.holdings = portfolio.holdings.filter(h => h.project_id.toString() !== projectId);
            }

            portfolio.total_value -= tradeValue;
        }

        await portfolio.save();
        res.json({ message: "Trade executed", order: newOrder, portfolio });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Get market stats
router.get('/stats', async (req, res) => {
    try {
        const stats = await MarketStat.findOne(); // Assuming single stats doc
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get news with dynamic updates
router.get('/news', async (req, res) => {
    try {
        const staticNews = await News.find().sort({ _id: -1 });

        // Generate a random "Live" news item occasionally
        const sources = ["Reuters", "Bloomberg Green", "Carbon Pulse", "Climate Wire", "FT Energy"];
        const headlines = [
            "Voluntary Carbon Market sees sudden liquidity spike",
            "New methodology approved for blue carbon projects",
            "Tech giants announce massive new offset purchases",
            "Price correction in nature-based solutions market",
            "Regulatory uncertainty causes minor volatility",
            "Solar credits trading volume up 15% this week"
        ];

        const randomNews = [];
        if (Math.random() > 0.3) {
            randomNews.push({
                _id: `live-${Date.now()}`,
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
