import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Settings = ({ activeTab = 'profile' }) => {
    const [currentTab, setCurrentTab] = useState(activeTab);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Form States
    const [profile, setProfile] = useState({
        fullName: 'Demo User',
        email: 'demo@carbonx.com',
        company: 'EcoCorp Industries',
        role: 'Trader'
    });

    useEffect(() => {
        setCurrentTab(activeTab);
    }, [activeTab]);

    const handleSave = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            // Simulate API call delay for effect
            await new Promise(r => setTimeout(r, 800));
            // In a real app: await api.saveSettings(profile);
            setMessage({ type: 'success', text: 'Settings saved successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'security', label: 'Security', icon: '🔒' }
    ];

    return (
        <div className="max-w-6xl mx-auto h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="font-bold text-3xl tracking-tight text-white">Settings</h2>
                    <p className="text-secondary text-sm mt-1">Manage your account settings and preferences.</p>
                </div>
            </div>

            <div className="flex gap-8 h-full">
                {/* Internal Sidebar */}
                <div className="w-64 flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setCurrentTab(tab.id)}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${currentTab === tab.id
                                    ? 'bg-gradient-to-r from-green-900/40 to-green-900/10 text-green border border-green-900/50 shadow-lg shadow-green-900/20'
                                    : 'text-secondary hover:bg-white/5 hover:text-white border border-transparent'
                                }`}
                        >
                            <span className="text-lg opacity-80">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 card backdrop-blur-md bg-opacity-80 border-gray-800 p-8 h-fit">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-green-900/20 text-green border border-green-900/30' : 'bg-red-900/20 text-red border border-red-900/30'}`}>
                            <span>{message.type === 'success' ? '✓' : '⚠'}</span>
                            {message.text}
                        </div>
                    )}

                    {currentTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex items-center gap-6 pb-8 border-b border-gray-800">
                                <div className="relative group cursor-pointer">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-2xl ring-4 ring-black/50">
                                        DA
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-semibold">Edit</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{profile.fullName}</h3>
                                    <p className="text-secondary text-sm mb-3">Managed by Organization</p>
                                    <div className="flex gap-3">
                                        <button className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-1.5 rounded-full transition-colors">Change Avatar</button>
                                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors px-2">Remove</button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-gray-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-gray-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Company</label>
                                    <input
                                        type="text"
                                        value={profile.company}
                                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-gray-600"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Role</label>
                                    <input
                                        disabled
                                        value={profile.role}
                                        className="w-full bg-black/20 border border-gray-800 rounded-lg p-3 text-sm text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentTab === 'preferences' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Appearance</h3>
                                <p className="text-sm text-secondary mb-6">Customize how the application looks on your device.</p>

                                <div className="bg-black/20 rounded-xl p-4 border border-gray-800 flex justify-between items-center mb-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-white">Dark Mode</h4>
                                        <p className="text-xs text-secondary mt-1">Uses a dark color palette for low-light environments.</p>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-not-allowed opacity-70">
                                        <div className="w-11 h-6 bg-green-900/30 rounded-full border border-green-900/50"></div>
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Localization</h3>
                                <p className="text-sm text-secondary mb-6">Set your language and region preferences.</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Language</label>
                                        <select className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none text-white">
                                            <option>English (United States)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Currency</label>
                                        <select className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none text-white">
                                            <option>USD ($)</option>
                                            <option>EUR (€)</option>
                                            <option>GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentTab === 'notifications' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <h3 className="text-lg font-bold text-white">Email Notifications</h3>
                            <div className="bg-black/20 rounded-xl divide-y divide-gray-800 border border-gray-800">
                                {['Market Volatility Alerts', 'New Project Listings', 'Order Confirmations', 'Weekly Impact Digest'].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                                        <span className="text-sm font-medium text-gray-200">{item}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 transition-colors"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="bg-gradient-to-r from-blue-900/10 to-transparent p-6 rounded-xl border border-blue-500/20 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400">🛡️</div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Two-Factor Authentication</h4>
                                        <p className="text-sm text-secondary mt-1 mb-4">Add an extra layer of security to your account by requiring a code when logging in.</p>
                                        <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium transition-colors">Enable 2FA</button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Change Password</label>
                                <div className="space-y-3">
                                    <input type="password" placeholder="Current Password" className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none transition-all text-white" />
                                    <input type="password" placeholder="New Password" className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none transition-all text-white" />
                                    <input type="password" placeholder="Confirm New Password" className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-green-500 outline-none transition-all text-white" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-800 flex justify-end gap-3">
                        <button
                            className="px-6 py-2.5 rounded-lg text-sm font-medium text-secondary hover:text-white hover:bg-white/5 transition-colors"
                            onClick={() => setProfile({
                                fullName: 'Demo User',
                                email: 'demo@carbonx.com',
                                company: 'EcoCorp Industries',
                                role: 'Trader'
                            })}
                            disabled={isLoading}
                        >
                            Reset
                        </button>
                        <button
                            className={`px-8 py-2.5 rounded-lg text-sm font-bold text-white transition-all transform active:scale-95 flex items-center gap-2 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-900/30'}`}
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
