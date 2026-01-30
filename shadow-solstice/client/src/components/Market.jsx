import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Market = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tradeQuantity, setTradeQuantity] = useState(1);
    const [tradeStatus, setTradeStatus] = useState('idle'); // idle, processing, success, error

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        api.getProjects()
            .then(data => {
                if (data) setProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Market fetch error:", err);
                setError("Failed to load market data.");
                setLoading(false);
            });
    };

    const handleExportCSV = () => {
        if (!projects.length) return;

        const headers = ['Name', 'Company', 'Type', 'Price ($)', '24h Change (%)', 'Volume', 'Rating'];
        const rows = projects.map(p => [
            `"${p.name}"`,
            `"${p.company}"`,
            p.type,
            p.price.current,
            p.price.change_24h_percent,
            p.stats.volume,
            p.stats.rating
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `carbonx_market_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openTradeModal = (project) => {
        setSelectedProject(project);
        setTradeQuantity(1);
        setTradeStatus('idle');
        setShowTradeModal(true);
    };

    const executeTrade = () => {
        setTradeStatus('processing');
        api.executeTrade({
            projectId: selectedProject._id,
            type: 'Buy',
            quantity: tradeQuantity
        }).then(() => {
            setTradeStatus('success');
            setTimeout(() => {
                setShowTradeModal(false);
                setTradeStatus('idle');
                setSelectedProject(null);
            }, 1500);
        }).catch(err => {
            console.error(err);
            setTradeStatus('error');
        });
    };

    const TradeModal = () => {
        if (!showTradeModal || !selectedProject) return null;

        const totalCost = (selectedProject.price.current * tradeQuantity).toFixed(2);

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-[#151E32] border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100 p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className={`text-[10px] px-2 py-1 rounded font-bold mb-2 inline-block ${selectedProject.type === 'VER' ? 'bg-blue-900/40 text-blue-400' : 'bg-purple-900/40 text-purple-400'}`}>
                                {selectedProject.type}
                            </span>
                            <h3 className="text-xl font-bold text-white">{selectedProject.name}</h3>
                            <p className="text-sm text-secondary">{selectedProject.company}</p>
                        </div>
                        <button
                            onClick={() => setShowTradeModal(false)}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {tradeStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-black mb-4 animate-bounce">✓</div>
                            <p className="text-xl font-bold text-white">Order Executed</p>
                            <p className="text-sm text-secondary mt-2">Placed buy order for {tradeQuantity} credits of {selectedProject.name}</p>
                        </div>
                    ) : tradeStatus === 'error' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-3xl font-bold text-black mb-4">⚠</div>
                            <p className="text-xl font-bold text-white">Transaction Failed</p>
                            <p className="text-sm text-secondary mt-2">Could not process your order. Please try again.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-8">
                                <div className="bg-black/20 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                                    <span className="text-sm text-secondary">Market Price</span>
                                    <span className="font-mono text-lg font-bold">${selectedProject.price.current.toFixed(2)}</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Quantity (Credits)</label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setTradeQuantity(Math.max(1, tradeQuantity - 1))}
                                            className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl font-bold transition-colors"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={tradeQuantity}
                                            onChange={(e) => setTradeQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                                            className="flex-1 bg-black/40 border border-gray-700 rounded-lg py-2 text-center text-lg font-mono focus:border-green-500 outline-none text-white"
                                        />
                                        <button
                                            onClick={() => setTradeQuantity(tradeQuantity + 1)}
                                            className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl font-bold transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-800 mb-6">
                                <span className="text-sm text-secondary">Estimated Total</span>
                                <span className="text-2xl font-bold text-green">${totalCost}</span>
                            </div>

                            <button
                                onClick={executeTrade}
                                disabled={tradeStatus === 'processing'}
                                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-95 ${tradeStatus === 'processing'
                                    ? 'bg-gray-700 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/30'
                                    }`}
                            >
                                {tradeStatus === 'processing' ? 'Processing...' : 'Confirm Buy Order'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-secondary animate-pulse">Loading Market Data...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="flex flex-col gap-6 h-full relative max-w-7xl mx-auto w-full">
            <TradeModal />

            <div className="flex justify-between items-center">
                <h2 className="font-bold text-3xl tracking-tight text-white">Market</h2>
                <div className="flex gap-2">
                    <button className="text-sm px-4 py-2 rounded bg-card border border-gray-700 hover:bg-white/5 transition-colors">Filters</button>
                    <button
                        onClick={handleExportCSV}
                        className="text-sm px-4 py-2 rounded bg-green-900/30 text-green border border-green-900/50 hover:bg-green-900/50 transition-colors flex items-center gap-2"
                    >
                        <span>⬇</span> Export CSV
                    </button>
                </div>
            </div>

            <div className="card p-0 overflow-hidden flex-1 shadow-2xl border border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-700 text-xs text-secondary uppercase tracking-wider bg-black/20">
                                <th className="p-4 font-semibold">Credit</th>
                                <th className="p-4 font-semibold">Price</th>
                                <th className="p-4 font-semibold">24h Change</th>
                                <th className="p-4 font-semibold">Volume</th>
                                <th className="p-4 font-semibold">Rating</th>
                                <th className="p-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {projects.map(p => {
                                const isPositive = p.price.change_24h_percent >= 0;
                                return (
                                    <tr key={p._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${p.type === 'VER' ? 'bg-blue-900/40 text-blue-400 border border-blue-500/20' : 'bg-purple-900/40 text-purple-400 border border-purple-500/20'}`}>
                                                        {p.type}
                                                    </span>
                                                    {p.verification.verified && (
                                                        <span className="text-[10px] text-green flex items-center gap-0.5 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-500/20">
                                                            <span>✓</span> Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-sm text-white group-hover:text-green transition-colors">{p.name}</span>
                                                <span className="text-xs text-secondary mt-0.5">{p.company}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono font-medium text-white">${p.price.current.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-green' : 'text-red'}`}>
                                                {isPositive ? '↑' : '↓'}
                                                {Math.abs(p.price.change_24h_value)} ({Math.abs(p.price.change_24h_percent)}%)
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-secondary font-mono">{p.stats.volume.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded font-bold ${p.stats.rating === 'AAA' ? 'bg-green-900/30 text-green border border-green-500/30' : p.stats.rating.startsWith('A') ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' : 'bg-gray-700 text-gray-300'}`}>
                                                {p.stats.rating}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => openTradeModal(p)}
                                                className="text-xs font-bold bg-white text-black hover:bg-green-400 hover:scale-105 px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-green-900/50"
                                            >
                                                Trade
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {projects.length === 0 && <div className="p-8 text-center text-secondary">No market data available.</div>}
                </div>
            </div>
        </div>
    );
};

export default Market;
