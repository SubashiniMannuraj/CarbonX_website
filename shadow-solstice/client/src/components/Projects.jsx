import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProjectCard from './ProjectCard';

// Modal Component defined outside to prevent re-renders
const DetailsModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#151E32] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all scale-100 p-8 relative" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2"
                >
                    ✕
                </button>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wide ${project.type === 'VER' ? 'bg-blue-900/40 text-blue-400 border border-blue-500/20' : 'bg-purple-900/40 text-purple-400 border border-purple-500/20'}`}>
                                {project.type}
                            </span>
                            {project.verification.verified && (
                                <span className="text-[10px] text-green flex items-center gap-1 bg-green-900/20 px-2 py-1 rounded border border-green-500/20">
                                    <span>✓</span> {project.verification.agency} Verified
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-1">{project.name}</h2>
                        <p className="text-secondary">{project.company} • {project.location}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-secondary mb-1">Current Price</p>
                        <p className="text-3xl font-mono font-bold text-white">${project.price.current.toFixed(2)}</p>
                        <p className={`text-sm ${project.price.change_24h_percent >= 0 ? 'text-green' : 'text-red'}`}>
                            {project.price.change_24h_percent >= 0 ? '+' : ''}{project.price.change_24h_percent}%
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-black/20 p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-secondary uppercase tracking-wider mb-1">Volume (24h)</p>
                        <p className="font-bold text-lg text-white">{project.stats.volume.toLocaleString()}</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-secondary uppercase tracking-wider mb-1">Vintage Score</p>
                        <p className="font-bold text-lg text-white">{project.stats.visual_score}/100</p>
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl border border-gray-800">
                        <p className="text-xs text-secondary uppercase tracking-wider mb-1">Rating</p>
                        <p className={`font-bold text-lg ${project.stats.rating === 'AAA' ? 'text-green' : 'text-white'}`}>{project.stats.rating}</p>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-bold text-white mb-2">Project Description</h3>
                    <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-gray-700 pl-4">
                        {project.description}
                        <br /><br />
                        This project contributes to the following UN Sustainable Development Goals:
                    </p>
                    <div className="flex gap-2 mt-4">
                        {project.tags.map((tag, i) => (
                            <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-secondary">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-3 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors">
                        View Documentation
                    </button>
                    <button className="flex-1 py-3 rounded-xl font-bold bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/30 transition-all transform active:scale-95">
                        Trade {project.name}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Projects = ({ initialSearchTerm = '' }) => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [sortMode, setSortMode] = useState('relevancy');
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (initialSearchTerm) {
            setSearchTerm(initialSearchTerm);
        }
    }, [initialSearchTerm]);

    useEffect(() => {
        api.getProjects()
            .then(data => {
                if (data) {
                    setProjects(data);
                    setFilteredProjects(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Projects fetch error:", err);
                setError("Failed to load projects.");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        let result = [...projects];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(lowerTerm) ||
                p.company.toLowerCase().includes(lowerTerm) ||
                p.type.toLowerCase().includes(lowerTerm) ||
                p.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
            );
        }

        switch (sortMode) {
            case 'price_asc':
                result.sort((a, b) => a.price.current - b.price.current);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price.current - a.price.current);
                break;
            case 'rating':
                const ratingOrder = { 'AAA': 3, 'AA': 2, 'A': 1, 'BBB': 0 };
                result.sort((a, b) => (ratingOrder[b.stats.rating] || 0) - (ratingOrder[a.stats.rating] || 0));
                break;
            default:
                break;
        }

        setFilteredProjects(result);
    }, [searchTerm, sortMode, projects]);

    return (
        <div className="flex flex-col gap-8 h-full">
            <DetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="font-bold text-3xl tracking-tight text-white">Verified Projects</h2>
                    <p className="text-secondary text-sm mt-1">Browse and discover high-impact carbon offset projects.</p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search projects, tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-green-500 outline-none text-white placeholder-gray-600 transition-colors"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                {filteredProjects.map(p => (
                    <div
                        key={p._id}
                        onClick={() => setSelectedProject(p)}
                        className="cursor-pointer h-full transform transition-transform duration-200 hover:-translate-y-1"
                    >
                        <ProjectCard project={p} onViewDetails={(proj) => setSelectedProject(proj)} />
                    </div>
                ))}
            </div>
            {filteredProjects.length === 0 && !loading && (
                <div className="p-12 text-center text-secondary bg-black/20 rounded-xl border border-gray-800 border-dashed">
                    <p>No projects match your search.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSortMode('relevancy'); }}
                        className="text-green text-sm hover:underline mt-2"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default Projects;
