import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generatedId, setGeneratedId] = useState(null); // ID of report being generated/downloaded

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        api.getReports()
            .then(data => {
                if (data) setReports(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Reports fetch error:", err);
                setError("Failed to load reports.");
                setLoading(false);
            });
    };

    const handleDownload = (report) => {
        if (report.status !== 'Ready') return;

        setGeneratedId(report._id || report.title); // Use title as fallback key if _id missing
        setTimeout(() => {
            alert(`Downloaded: ${report.title}`);
            setGeneratedId(null);
        }, 1000);
    };

    const handleGenerateReport = () => {
        const newReport = {
            _id: `temp-${Date.now()}`,
            title: `Custom Report - ${new Date().toLocaleDateString()}`,
            type: 'Custom',
            generated_date: new Date(),
            size: '--',
            status: 'Processing'
        };
        setReports([newReport, ...reports]);

        // Simulate processing
        setTimeout(() => {
            setReports(prev => prev.map(r =>
                r._id === newReport._id ? { ...r, status: 'Ready', size: '1.2 MB' } : r
            ));
        }, 3000);
    };

    if (loading) return <div className="p-8 text-center text-secondary animate-pulse">Loading Documents...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const getIcon = (type) => {
        switch (type) {
            case 'Financial': return '💰';
            case 'Impact': return '🌍';
            case 'Audit': return '📋';
            case 'Verification': return '✅';
            default: return '📄';
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="font-bold text-3xl tracking-tight text-white">Reports & Documents</h2>
                    <p className="text-secondary text-sm mt-1">Access your financial statements, impact audits, and verification certificates.</p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-900/30 transition-all transform active:scale-95 flex items-center gap-2"
                >
                    <span>+</span> Generate New Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((r, index) => (
                    <div
                        key={r._id || index}
                        className="card flex items-center justify-between p-6 bg-gradient-to-r from-[#151E32] to-[#1A2438] hover:border-blue-500/30 transition-all group border border-gray-800"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${r.type === 'Financial' ? 'bg-green-900/20 text-green' :
                                    r.type === 'Impact' ? 'bg-blue-900/20 text-blue-400' :
                                        'bg-purple-900/20 text-purple-400'
                                }`}>
                                {getIcon(r.type)}
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">{r.title}</h3>
                                <div className="flex gap-3 text-xs text-secondary mt-1 font-medium">
                                    <span>{new Date(r.generated_date).toLocaleDateString()}</span>
                                    <span className="text-gray-600">•</span>
                                    <span className="uppercase tracking-wider">{r.type}</span>
                                    <span className="text-gray-600">•</span>
                                    <span>{r.size}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            {r.status === 'Ready' ? (
                                <button
                                    onClick={() => handleDownload(r)}
                                    disabled={generatedId === (r._id || r.title)}
                                    className="text-xs font-bold text-blue-400 hover:text-white border border-blue-500/30 hover:bg-blue-600 hover:border-transparent px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                                >
                                    {generatedId === (r._id || r.title) ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <span>⬇</span> Download
                                        </>
                                    )}
                                </button>
                            ) : (
                                <span className="text-xs font-bold text-yellow-500 bg-yellow-900/20 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-yellow-500/20">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    Processing...
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {reports.length === 0 && !loading && (
                <div className="p-12 text-center text-secondary bg-black/20 rounded-xl border border-gray-800 border-dashed">
                    <p>No reports found.</p>
                </div>
            )}
        </div>
    );
};

export default Reports;
