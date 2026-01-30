import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Trade Modal State (for selling/buying from Portfolio)
    // For simplicity, we can implement Sell modal here or reuse a component. 
    // Implementing inline logic for "Quick Sell".
    const [actionId, setActionId] = useState(null); // project_id being acted upon
    const [processingAction, setProcessingAction] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        api.getPortfolio()
            .then(data => {
                if (data) setPortfolio(data);
                setLoading(false);
                setIsRefreshing(false);
            })
            .catch(err => {
                console.error("Portfolio fetch error:", err);
                setError("Failed to load portfolio.");
                setLoading(false);
                setIsRefreshing(false);
            });
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        loadData();
    };

    const handleSell = (holding) => {
        if (!window.confirm(`Are you sure you want to sell 1 unit of ${holding.project_name}?`)) return;

        setActionId(holding.project_id);
        setProcessingAction(true);

        // Execute trade for 1 unit
        api.executeTrade({
            projectId: holding.project_id.toString(), // Ensure ID string
            type: 'Sell',
            quantity: 1
        }).then(() => {
            // Refresh data after sell
            loadData();
            setProcessingAction(false);
            setActionId(null);
        }).catch(err => {
            alert('Failed to sell: ' + err.message);
            setProcessingAction(false);
            setActionId(null);
        });
    };

    if (loading && !portfolio) return <div className="p-8 text-center text-secondary animate-pulse">Loading Portfolio...</div>;
    if (error && !portfolio) return <div className="p-8 text-center text-red-500">{error}</div>;

    // Safety check for empty portfolio initialization
    const safePortfolio = portfolio || { total_value: 0, total_yield: 0, yield_percent: 0, trees_planted: 0, holdings: [] };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-3xl tracking-tight text-white">Your Portfolio</h2>
                    <p className="text-secondary text-sm mt-1">Track your carbon assets and impact.</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className={`text-sm px-4 py-2 rounded-lg bg-black/40 border border-gray-700 hover:bg-white/5 transition-all text-secondary hover:text-white flex items-center gap-2 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isRefreshing}
                >
                    <span className={isRefreshing ? 'animate-spin' : ''}>↻</span> Refresh Data
                </button>
            </div>

            {/* Overview Section - Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card bg-gradient-to-br from-green-900/20 to-transparent border-green-500/20 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-6 -mt-6 transition-all group-hover:bg-green-500/20"></div>
                    <p className="text-xs font-bold text-green uppercase tracking-wider mb-2">Total Asset Value</p>
                    <p className="text-3xl font-bold text-white font-mono tracking-tight">${safePortfolio.total_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs font-bold bg-green-900/40 text-green px-2 py-1 rounded border border-green-500/20">↑ {safePortfolio.yield_percent}%</span>
                        <span className="text-xs text-secondary">All Time</span>
                    </div>
                </div>

                <div className="card p-6 relative overflow-hidden">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Total Yield Generated</p>
                    <p className="text-3xl font-bold text-white font-mono tracking-tight">+${safePortfolio.total_yield.toLocaleString()}</p>
                    <p className="text-xs text-secondary mt-2">Profits realized from sales</p>
                </div>

                <div className="card p-6 relative overflow-hidden bg-gradient-to-br from-blue-900/10 to-transparent border-blue-500/10">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Environmental Impact</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-white">{safePortfolio.trees_planted}</p>
                        <span className="text-xl">🌳</span>
                    </div>
                    <p className="text-xs text-secondary mt-2">Trees planted equivalent</p>
                </div>

                <div className="card p-6 relative overflow-hidden">
                    <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Portfolio Rating</p>
                    <div className="flex items-center gap-4">
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">A+</p>
                        <div className="h-10 w-[1px] bg-gray-700"></div>
                        <p className="text-xs text-secondary leading-tight">Top tier<br />Composition</p>
                    </div>
                </div>
            </div>

            {/* Holdings Table - Premium Look */}
            <div className="card p-0 overflow-hidden border border-gray-800 shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
                    <h3 className="font-bold text-lg text-white">Current Holdings</h3>
                    <div className="flex gap-2">
                        <button className="text-xs font-medium text-secondary hover:text-white px-3 py-1.5 rounded bg-black/20 hover:bg-white/10 transition-colors">Group by Type</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-800 text-xs text-secondary uppercase tracking-wider">
                                <th className="p-6">Project Name</th>
                                <th className="p-6">Quantity</th>
                                <th className="p-6">Avg. Buy Price</th>
                                <th className="p-6">Current Market</th>
                                <th className="p-6">Total Value</th>
                                <th className="p-6">Unrealized P/L</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {safePortfolio.holdings.map(h => (
                                <tr key={h.project_id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <div className="font-bold text-white">{h.project_name}</div>
                                        <div className="text-xs text-secondary mt-1 font-mono">{h.project_id}</div>
                                    </td>
                                    <td className="p-6 font-mono text-white">{h.quantity}</td>
                                    <td className="p-6 text-secondary font-mono">${h.avg_price.toFixed(2)}</td>
                                    <td className="p-6 text-white font-mono">${h.current_price.toFixed(2)}</td>
                                    <td className="p-6 font-bold text-white font-mono">${h.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="p-6">
                                        <div className={`font-mono font-medium ${h.gain_loss >= 0 ? 'text-green' : 'text-red'}`}>
                                            {h.gain_loss >= 0 ? '+' : ''}${h.gain_loss.toFixed(2)}
                                        </div>
                                        <div className={`text-xs ${h.gain_loss >= 0 ? 'text-green/70' : 'text-red/70'}`}>
                                            {h.gain_loss_percent}%
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => handleSell(h)}
                                            disabled={processingAction && actionId === h.project_id}
                                            className={`text-xs font-bold border border-gray-700 bg-black/20 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 px-4 py-2 rounded-lg transition-all ${processingAction && actionId === h.project_id ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {processingAction && actionId === h.project_id ? 'Selling...' : 'Quick Sell'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {safePortfolio.holdings.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center text-4xl mb-4 text-gray-600">📂</div>
                            <p className="text-white font-medium text-lg">Your portfolio is empty.</p>
                            <p className="text-secondary text-sm mt-2">Head to the Market to start trading carbon credits.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
