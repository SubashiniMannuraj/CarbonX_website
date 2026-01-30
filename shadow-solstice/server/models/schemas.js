const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: String,
    company: String,
    type: String, // "VER", "CER"
    location: String,
    description: String,
    verification: {
        agency: String,
        verified: Boolean
    },
    price: {
        current: Number,
        change_24h_value: Number,
        change_24h_percent: Number
    },
    stats: {
        volume: Number,
        rating: String,
        visual_score: Number
    },
    credits: {
        total: Number,
        available: Number
    },
    tags: [String]
});

const MarketStatSchema = new mongoose.Schema({
    total_volume: String,
    average_price: Number,
    price_volatility: Number,
    total_projects: Number
});

const NewsSchema = new mongoose.Schema({
    headline: String,
    source: String,
    time_ago: String,
    sentiment: String
});

const PortfolioSchema = new mongoose.Schema({
    total_value: Number,
    total_yield: Number,
    yield_percent: Number,
    trees_planted: Number,
    holdings: [{
        project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        project_name: String,
        quantity: Number,
        avg_price: Number,
        current_price: Number,
        value: Number,
        gain_loss: Number,
        gain_loss_percent: Number
    }]
});

const OrderSchema = new mongoose.Schema({
    id: String,
    project_name: String,
    type: String, // "Buy" or "Sell"
    quantity: Number,
    price: Number,
    total: Number,
    status: String, // "Completed", "Pending", "Failed"
    date: Date
});

const ReportSchema = new mongoose.Schema({
    title: String,
    type: String, // "Impact", "Financial", "Audit"
    generated_date: Date,
    size: String,
    status: String // "Ready", "Processing"
});

module.exports = {
    Project: mongoose.model('Project', ProjectSchema),
    MarketStat: mongoose.model('MarketStat', MarketStatSchema),
    News: mongoose.model('News', NewsSchema),
    Portfolio: mongoose.model('Portfolio', PortfolioSchema),
    Order: mongoose.model('Order', OrderSchema),
    Report: mongoose.model('Report', ReportSchema)
};
