import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const MarketNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = () => {
            api.getNews()
                .then(data => {
                    if (data) setNews(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("News fetch error:", err);
                    setError("Failed to load news.");
                    setLoading(false);
                });
        };

        fetchNews();
        const interval = setInterval(fetchNews, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="card h-full flex items-center justify-center text-secondary border-none bg-transparent">
            Loading News...
        </div>
    );

    return (
        <div className="card h-full" style={{ borderRadius: '0', border: 'none', borderLeft: '1px solid var(--border-color)', backgroundColor: 'transparent' }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-6 pl-2">Market News</h3>

            <div className="flex flex-col gap-6">
                {news.map((item, index) => (
                    <div key={item._id || index} className="cursor-pointer hover:bg-white/5 p-2 rounded transition-colors">
                        <div className="flex gap-2">
                            <div className="mt-1">
                                {item.sentiment === 'Negative' ? '🟠' : '📄'}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium mb-1 leading-snug">{item.headline}</h4>
                                <div className="flex justify-between items-center text-xs text-secondary">
                                    <span>{item.source}</span>
                                    <span>{item.time_ago}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {news.length === 0 && <div className="text-center text-secondary text-sm">No recent news.</div>}
            </div>
            {error && <div className="text-xs text-red-500 mt-4 text-center">{error}</div>}
        </div>
    );
};

export default MarketNews;
