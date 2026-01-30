import React from 'react';

const Header = ({ onOpenSettings, onSearch }) => {
    return (
        <header className="glass-header flex items-center justify-between" style={{ height: '70px', padding: '0 2rem' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '300px' }}>
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="search-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch && onSearch(e.target.value);
                            e.target.value = ''; // Optional: clear after search or keep it? Keeping it might be better but let's clear for now or simple trigger
                        }
                    }}
                    style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        padding: '0.5rem 1rem 0.5rem 2.5rem',
                        borderRadius: '6px',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                        outline: 'none'
                    }}
                />
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>🔍</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                <button
                    className="text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.4rem 0.8rem', borderRadius: '4px', color: 'var(--text-secondary)' }}
                    onClick={() => alert("Support Center:\n- Phone: +1 800 123 4567\n- Email: support@carbonx.io\n- Live Chat: Offline")}
                >
                    Support
                </button>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => onOpenSettings('notifications')}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--accent-red)', borderRadius: '50%', position: 'absolute', top: 0, right: 0 }}></div>
                    🔔
                </div>
                <div
                    className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors duration-200"
                    onClick={() => onOpenSettings('profile')}
                >
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-blue), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>DA</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">Demo Account</span>
                        <span className="text-[10px] text-green mt-1">Verified Trader</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
