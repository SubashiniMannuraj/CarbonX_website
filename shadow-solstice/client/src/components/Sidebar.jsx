import React from 'react';

const Sidebar = ({ currentView, setCurrentView, onOpenSettings }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'ds' },
        { id: 'market', label: 'Market', icon: 'mk' },
        { id: 'portfolio', label: 'Portfolio', icon: 'pf' },
        { id: 'orders', label: 'Orders', icon: 'od' },
        { id: 'projects', label: 'Projects', icon: 'pj' },
        { id: 'reports', label: 'Reports', icon: 'rp' },
    ];

    return (
        <div style={{ width: '260px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
            <div style={{ padding: '2rem', display: 'flex', alignItems: 'center' }}>
                <h1 className="font-bold" style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, var(--accent-green), var(--accent-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CarbonX
                </h1>
            </div>

            <nav style={{ flex: 1, padding: '1rem' }}>
                <ul className="flex flex-col gap-4">
                    {menuItems.map(item => (
                        <li
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: currentView === item.id ? 'var(--accent-green)' : 'var(--text-secondary)',
                                backgroundColor: currentView === item.id ? 'rgba(0, 237, 160, 0.1)' : 'transparent',
                                borderLeft: currentView === item.id ? '3px solid var(--accent-green)' : '3px solid transparent',
                                transition: 'all 0.2s'
                            }}
                            className="font-medium text-sm flex items-center gap-4"
                        >
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '2rem' }}>
                <div
                    style={{ padding: '0.75rem', color: currentView === 'settings' ? 'var(--accent-green)' : 'var(--text-secondary)', cursor: 'pointer' }}
                    className="flex items-center gap-4 text-sm hover:text-white transition-colors"
                    onClick={() => {
                        setCurrentView('settings');
                        // Optional: Reset to default tab or specific tab if needed, but passing setCurrentView is key
                        if (typeof onOpenSettings === 'function') onOpenSettings();
                        else setCurrentView('settings');
                    }}
                >
                    ⚙️ Settings
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
