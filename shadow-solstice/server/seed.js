const mongoose = require('mongoose');
const { Project, MarketStat, News, Portfolio, Order, Report } = require('./models/schemas');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbonx', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('MongoDB Connected for Seeding');

    await Project.deleteMany({});
    await MarketStat.deleteMany({});
    await News.deleteMany({});
    await Portfolio.deleteMany({});
    await Order.deleteMany({});
    await Report.deleteMany({});

    // 1. Projects
    const projectsData = [
        {
            name: "Amazonian Rainforest Conservation",
            company: "Brazil Forestry Initiative",
            type: "VER",
            location: "Brazil",
            description: "Protects 100,000 hectares of primary rainforest from deforestation.",
            verification: { agency: "SGS", verified: true },
            price: { current: 24.75, change_24h_value: 1.23, change_24h_percent: 5.23 },
            stats: { volume: 15780, rating: "AA", visual_score: 95 },
            credits: { total: 500000, available: 280000 },
            tags: ["Climate Action", "Life on Land", "Biodiversity"]
        },
        {
            name: "Indian Solar Farm Development",
            company: "Renewable Energy Fund",
            type: "CER",
            location: "India",
            description: "Development of utility-scale solar farms to replace coal power.",
            verification: { agency: "DNV GL", verified: true },
            price: { current: 32.50, change_24h_value: 2.25, change_24h_percent: 7.44 },
            stats: { volume: 12450, rating: "AAA", visual_score: 98 },
            credits: { total: 750000, available: 420000 },
            tags: ["Affordable Clean Energy", "Climate Action", "Industry Innovation"]
        },
        {
            name: "Kenyan Reforestation Project",
            company: "Africa Green Initiative",
            type: "VER",
            location: "Kenya",
            description: "Community-led reforestation project in Kenya.",
            verification: { agency: "Rainforest Alliance", verified: true },
            price: { current: 15.25, change_24h_value: 0.75, change_24h_percent: 5.17 },
            stats: { volume: 6280, rating: "BBB", visual_score: 82 },
            credits: { total: 200000, available: 120000 },
            tags: ["Life on Land", "Decent Work", "Climate Action"]
        },
        {
            name: "Indonesian Mangrove Restoration",
            company: "Blue Carbon Coalition",
            type: "VER",
            location: "Indonesia",
            description: "Restoration of mangrove ecosystems to store blue carbon.",
            verification: { agency: "Bureau Veritas", verified: true },
            price: { current: 18.92, change_24h_value: -0.48, change_24h_percent: -2.47 },
            stats: { volume: 8940, rating: "A", visual_score: 88 },
            credits: { total: 320000, available: 180000 },
            tags: ["Life Below Water", "Climate Action", "Coastal Communities"]
        },
        {
            name: "Chinese Wind Farm Expansion",
            company: "Asia Clean Energy Fund",
            type: "CER",
            location: "China",
            description: "Expansion of wind power capacity impacting rural communities.",
            verification: { agency: "TUV Nord", verified: true },
            price: { current: 28.30, change_24h_value: -1.15, change_24h_percent: -3.90 },
            stats: { volume: 9870, rating: "AA", visual_score: 75 },
            credits: { total: 400000, available: 250000 },
            tags: ["Affordable Clean Energy", "No Poverty"]
        },
        {
            name: "Costa Rican Biodiversity Protection",
            company: "Central American Conservation",
            type: "VER",
            location: "Costa Rica",
            description: "Preserving rich biodiversity hotspots.",
            verification: { agency: "SGS", verified: true },
            price: { current: 22.40, change_24h_value: 0.90, change_24h_percent: 4.19 },
            stats: { volume: 4560, rating: "A", visual_score: 91 },
            credits: { total: 150000, available: 50000 },
            tags: ["Life on Land", "Biodiversity"]
        }
    ];

    const savedProjects = await Project.insertMany(projectsData);

    // 2. Portfolio
    const portfolio = {
        total_value: 45240.50,
        total_yield: 337.50,
        yield_percent: 3.49,
        trees_planted: 1125,
        holdings: [
            {
                project_id: savedProjects[0]._id, // Amazonian
                project_name: savedProjects[0].name,
                quantity: 150,
                avg_price: 23.80,
                current_price: savedProjects[0].price.current,
                value: 150 * savedProjects[0].price.current,
                gain_loss: 142.50,
                gain_loss_percent: 3.99
            },
            {
                project_id: savedProjects[1]._id, // Indian Solar
                project_name: savedProjects[1].name,
                quantity: 100,
                avg_price: 31.25,
                current_price: savedProjects[1].price.current,
                value: 100 * savedProjects[1].price.current,
                gain_loss: 125.00,
                gain_loss_percent: 4.00
            },
            {
                project_id: savedProjects[2]._id, // Kenyan
                project_name: savedProjects[2].name,
                quantity: 200,
                avg_price: 14.90,
                current_price: savedProjects[2].price.current,
                value: 200 * savedProjects[2].price.current,
                gain_loss: 70.00,
                gain_loss_percent: 2.35
            }
        ]
    };
    await Portfolio.create(portfolio);

    // 3. Market Stats
    await MarketStat.create({
        total_volume: "1.2M",
        average_price: 24.75,
        price_volatility: 4.2,
        total_projects: 872
    });

    // 4. News
    await News.insertMany([
        { headline: "Carbon Market Trading Volume Hits Record High", source: "Bloomberg Green", time_ago: "2h ago", sentiment: "Positive" },
        { headline: "New EU Regulations on Carbon Credit Verification", source: "Reuters", time_ago: "5h ago", sentiment: "Neutral" },
        { headline: "Amazonian Project Expands Conservation Efforts", source: "Climate Wire", time_ago: "10h ago", sentiment: "Positive" }
    ]);

    // 5. Orders (New)
    await Order.insertMany([
        { id: "ORD-2025-001", project_name: "Amazonian Rainforest Conservation", type: "Buy", quantity: 50, price: 23.50, total: 1175.00, status: "Completed", date: new Date("2024-05-20") },
        { id: "ORD-2025-002", project_name: "Indian Solar Farm Development", type: "Buy", quantity: 100, price: 31.25, total: 3125.00, status: "Completed", date: new Date("2024-06-15") },
        { id: "ORD-2025-003", project_name: "Kenyan Reforestation Project", type: "Sell", quantity: 50, price: 16.00, total: 800.00, status: "Completed", date: new Date("2024-07-02") },
        { id: "ORD-2025-004", project_name: "China Wind Farm", type: "Buy", quantity: 200, price: 28.00, total: 5600.00, status: "Pending", date: new Date("2024-07-28") }
    ]);

    // 6. Reports (New)
    await Report.insertMany([
        { title: "2024 Annual Impact Report", type: "Impact", generated_date: new Date("2024-12-31"), size: "4.2 MB", status: "Ready" },
        { title: "Q1 2025 Financial Statement", type: "Financial", generated_date: new Date("2025-03-31"), size: "2.8 MB", status: "Ready" },
        { title: "Portfolio Carbon Audit", type: "Audit", generated_date: new Date("2025-06-15"), size: "8.5 MB", status: "Ready" },
        { title: "July Project Verification Summary", type: "Verification", generated_date: new Date(), size: "--", status: "Processing" }
    ]);

    console.log('Seeding Completed');
    mongoose.connection.close();
}).catch(err => console.error(err));
