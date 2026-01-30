import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import ProjectCard from './ProjectCard';
import MarketNews from './MarketNews';
import { api } from '../services/api';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [marketStats, setMarketStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data
    useEffect(() => {
        console.log("Dashboard mounting, fetching data...");
        Promise.all([
            api.getProjects(),
            api.getMarketStats()
        ]).then(([projectsData, statsData]) => {
            console.log("Data received:", { projectsData, statsData });

            if (projectsData && projectsData.length > 0) {
                setProjects(projectsData.slice(0, 4));
            } else {
                console.warn("No projects received");
            }

            if (statsData) {
                setMarketStats({
                    totalVolume: statsData.total_volume,
                    avgPrice: statsData.average_price,
                    volatility: statsData.price_volatility,
                    totalProjects: statsData.total_projects
                });
            } else {
                console.warn("No stats received");
            }
            setLoading(false);
        }).catch(err => {
            console.error("Dashboard massive fail:", err);
            setError(`Failed to load data: ${err.message}`);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="text-secondary animate-pulse">Loading Live Data...</div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-full">
            <div className="text-red-500 bg-red-900/20 p-4 rounded border border-red-900">
                <p className="font-bold">Connection Error</p>
                <p className="text-sm">{error}</p>
                <p className="text-xs mt-2 text-secondary">Ensure server is running on port 5000</p>
            </div>
        </div>
    );

    return (
        <div className="flex gap-6 h-full max-w-7xl mx-auto w-full">
            {/* Main Content Column */}
            <div className="flex-1 flex flex-col gap-6">
                <h2 className="font-bold text-3xl tracking-tight text-white mb-2">Dashboard</h2>

                {/* Top Cards Grid */}
                <div className="grid grid-cols-4 gap-4">
                    {projects.map(p => (
                        <StatCard key={p._id} project={p} />
                    ))}
                    {projects.length === 0 && <div className="col-span-4 text-center text-secondary py-4">No projects data available</div>}
                </div>

                {/* Middle Section: Main Project Chart & Market Stats */}
                <div className="flex gap-6" style={{ minHeight: '350px' }}>
                    <div className="card flex-1 p-0 relative overflow-hidden" style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Simulating the Chart Card for Amazonian Conservation */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }} className="flex justify-between items-center">
                            <span className="text-sm font-semibold uppercase tracking-wider text-secondary">Amazonian Conservation (VER-001)</span>
                            <div className="flex gap-2">
                                {['7D', '30D', '90D'].map(t => (
                                    <span key={t} className={`text-xs px-2 py-1 rounded ${t === '30D' ? 'bg-green-900 text-green' : 'text-secondary'}`} style={{ background: t === '30D' ? 'rgba(0, 237, 160, 0.1)' : 'transparent' }}>{t}</span>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1 }}>
                            <h3 className="text-3xl font-bold mb-1">$26.00</h3>
                            <div className="text-red text-sm flex items-center gap-1 mb-8">
                                <span>▼ 0.89 (3.31%)</span>
                            </div>

                            {/* Mock Chart Line */}
                            <div style={{ width: '100%', height: '150px', position: 'relative' }}>
                                <svg viewBox="0 0 500 150" className="w-full h-full" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,80 Q50,90 100,50 T200,80 T300,100 T400,60 T500,70" fill="none" stroke="#EF4444" strokeWidth="2" />
                                    <path d="M0,80 Q50,90 100,50 T200,80 T300,100 T400,60 T500,70 V150 H0 Z" fill="url(#chartGradient)" />

                                    {/* Grid lines */}
                                    <line x1="0" y1="150" x2="500" y2="150" stroke="var(--border-color)" strokeWidth="0.5" />
                                    <line x1="0" y1="0" x2="500" y2="0" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4" />
                                </svg>
                            </div>

                            <div className="flex justify-between text-xs text-secondary mt-4">
                                <span>2025-04-13</span>
                                <span>2025-04-28</span>
                                <span>2025-05-12</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ width: '320px' }}>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-6">Market Statistics</h3>
                        {marketStats ? (
                            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                <div>
                                    <p className="text-xs text-secondary mb-1">TOTAL VOLUME</p>
                                    <p className="text-xl font-bold">{marketStats.totalVolume}</p>
                                    <p className="text-xs text-secondary">tCO₂e</p>
                                    <p className="text-xs text-green mt-1">↑ 12.5%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary mb-1">AVG PRICE</p>
                                    <p className="text-xl font-bold">${marketStats.avgPrice}</p>
                                    <p className="text-xs text-green mt-1">↑ 3.2%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary mb-1">VOLATILITY</p>
                                    <p className="text-xl font-bold">{marketStats.volatility}%</p>
                                    <p className="text-xs text-green mt-1">↓ 0.8%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-secondary mb-1">PROJECTS</p>
                                    <p className="text-xl font-bold">{marketStats.totalProjects}</p>
                                    <p className="text-xs text-green mt-1">↑ 15 new</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-secondary text-sm">Loading Stats...</div>
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">Indian Solar Farm (CER-001)</h3>
                        <p className="text-2xl font-bold">$35.32</p>
                    </div>
                    <div className="card">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">ESG Ratings Breakdown</h3>
                        <div className="flex justify-between items-center mb-2">
                            <span>Environmental</span>
                            <span className="font-bold">92/100</span>
                        </div>
                        <div style={{ height: '6px', width: '100%', background: 'var(--bg-primary)', borderRadius: '3px' }}>
                            <div style={{ width: '92%', height: '100%', background: 'var(--accent-green)', borderRadius: '3px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div style={{ width: '300px' }}>
                <MarketNews />
            </div>
        </div>
    );
};

export default Dashboard;
