import React, { useState } from 'react';

const Support = () => {
    const [formData, setFormData] = useState({
        subject: 'General Inquiry',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.message.trim()) return;

        setStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ ...formData, message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <div className="text-center py-8">
                <h2 className="font-bold text-4xl mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">How can we help you?</h2>
                <p className="text-secondary text-lg max-w-2xl mx-auto">Our support team is available 24/7 to assist you with trading, verification, and account related questions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2 card border-t-4 border-t-green-500 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="p-2 bg-green-900/20 rounded-lg text-green">✉️</span>
                        Send us a message
                    </h3>

                    {status === 'success' ? (
                        <div className="bg-green-900/20 border border-green-500/30 text-green p-8 rounded-xl text-center flex flex-col items-center justify-center h-80 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-3xl font-bold text-black mb-4">✓</div>
                            <p className="font-bold text-2xl mb-2">Message Sent Successfully!</p>
                            <p className="text-gray-300 max-w-md">Our team has received your inquiry (Ticket #98233) and will get back to you within 24 hours.</p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-6 text-sm text-green hover:text-white underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Subject</label>
                                <div className="relative">
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-sm focus:border-green-500 outline-none text-white appearance-none cursor-pointer hover:bg-black/60 transition-colors"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Technical Issue</option>
                                        <option>Billing & Account</option>
                                        <option>Verification Status</option>
                                        <option>Report a Bug</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-secondary">▼</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Message Details</label>
                                <textarea
                                    rows="8"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-sm focus:border-green-500 outline-none text-white placeholder-gray-600 resize-none hover:bg-black/60 transition-colors"
                                    placeholder="Please provide as much detail as possible about your issue..."
                                    required
                                ></textarea>
                            </div>
                            <div className="pt-4 flex items-center justify-between">
                                <p className="text-xs text-secondary italic">* Response time averages 2.5 hours.</p>
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all transform active:scale-95 flex items-center gap-2 ${status === 'submitting'
                                            ? 'bg-gray-700 cursor-not-allowed'
                                            : 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/40'
                                        }`}
                                >
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Info & FAQ */}
                <div className="flex flex-col gap-6">
                    <div className="card bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none"></div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            Live Support Channels
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-900/10 border border-blue-500/10 hover:border-blue-500/30 transition-colors group cursor-pointer">
                                <span className="text-2xl group-hover:scale-110 transition-transform">📞</span>
                                <div>
                                    <p className="font-bold text-white text-lg">+1 (888) 123-4567</p>
                                    <p className="text-xs text-blue-300">Priority Phone Support (Mon-Fri)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-900/10 border border-blue-500/10 hover:border-blue-500/30 transition-colors group cursor-pointer">
                                <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                                <div>
                                    <p className="font-bold text-white text-lg">Live Chat</p>
                                    <p className="text-xs text-green-400 flex items-center gap-1">● Agents Online</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-900/10 border border-blue-500/10 hover:border-blue-500/30 transition-colors group cursor-pointer">
                                <span className="text-2xl group-hover:scale-110 transition-transform">📧</span>
                                <div>
                                    <p className="font-bold text-white text-lg">support@carbonx.io</p>
                                    <p className="text-xs text-blue-300">General Inquiries</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">FAQ</h3>
                        <div className="space-y-1">
                            <details className="group cursor-pointer bg-black/20 rounded-lg open:bg-black/40 transition-colors">
                                <summary className="p-4 text-sm font-medium hover:text-green transition-colors list-none flex justify-between items-center outline-none">
                                    How do I verify a project?
                                    <span className="text-secondary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="px-4 pb-4 text-xs text-gray-400 leading-relaxed">
                                    Navigate to the Projects page and click "Request Verification". Upload the required PDF documentation, and our audit team will review it within 3-5 business days.
                                </p>
                            </details>
                            <details className="group cursor-pointer bg-black/20 rounded-lg open:bg-black/40 transition-colors">
                                <summary className="p-4 text-sm font-medium hover:text-green transition-colors list-none flex justify-between items-center outline-none">
                                    Withdrawal processing times?
                                    <span className="text-secondary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="px-4 pb-4 text-xs text-gray-400 leading-relaxed">
                                    Standard bank transfers take 2-3 business days. Crypto withdrawals (USDC/USDT) are processed automatically after 12 confirmations (approx. 1 hour).
                                </p>
                            </details>
                            <details className="group cursor-pointer bg-black/20 rounded-lg open:bg-black/40 transition-colors">
                                <summary className="p-4 text-sm font-medium hover:text-green transition-colors list-none flex justify-between items-center outline-none">
                                    Are my credits tradable?
                                    <span className="text-secondary group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="px-4 pb-4 text-xs text-gray-400 leading-relaxed">
                                    Yes, all VER and CER credits purchased through CarbonX can be traded on our secondary market instantly.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
