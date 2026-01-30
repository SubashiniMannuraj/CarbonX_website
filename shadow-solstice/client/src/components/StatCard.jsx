import React from 'react';

const StatCard = ({ project }) => {
    const isPositive = project.price.change_24h_percent >= 0;

    return (
        <div className="card" style={{ padding: '1.25rem' }}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${project.type === 'VER' ? 'bg-blue-900 text-blue-300' : 'bg-purple-900 text-purple-300'}`}
                        style={{ background: project.type === 'VER' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)', color: project.type === 'VER' ? 'var(--accent-blue)' : 'var(--accent-purple)' }}>
                        {project.type}
                    </span>
                    <span className="text-xs text-secondary ml-2">Verified</span>
                </div>

                {/* Mini Sparkline Placeholdler */}
                <div style={{ width: '40px', height: '20px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 40 20">
                        <path d={`M0,10 Q10,${isPositive ? 5 : 15} 20,10 T40,${isPositive ? 2 : 18}`} fill="none" stroke={isPositive ? "var(--accent-green)" : "var(--accent-red)"} strokeWidth="2" />
                    </svg>
                </div>
            </div>

            <h4 className="font-bold text-sm mb-1 truncate">{project.name}</h4>
            <p className="text-xs text-secondary mb-4 truncate">{project.company}</p>

            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-secondary mb-1">Current Price</p>
                    <p className="font-bold text-lg">${project.price.current.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-secondary mb-1">24h Change</p>
                    <p className={`text-xs font-semibold ${isPositive ? 'text-green' : 'text-red'}`}>
                        {isPositive ? '+' : ''}{project.price.change_24h_value} ({isPositive ? '+' : ''}{project.price.change_24h_percent}%)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
