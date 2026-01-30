const ProjectCard = ({ project, onViewDetails }) => {
    return (
        <div
            onClick={() => onViewDetails && onViewDetails(project)}
            className="card flex flex-col h-full relative overflow-hidden group hover:border-gray-600 transition-colors cursor-pointer transform hover:-translate-y-1 duration-200"
        >
            {/* Hover Decorator */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg leading-tight mb-1">{project.name}</h3>
                    <span className="text-xs text-secondary">{project.company}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${project.stats.rating === 'AAA' ? 'bg-green-900/30 text-green border border-green-500/30' : 'bg-gray-700 text-gray-300'}`}>
                    {project.stats.rating}
                </span>
            </div>

            <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-3">
                {project.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                <div>
                    <span className="text-secondary block mb-1">Price</span>
                    <span className="font-bold text-base text-white">${project.price.current.toFixed(2)}</span>
                </div>
                <div>
                    <span className="text-secondary block mb-1">Volume</span>
                    <span className="font-bold text-base text-white">{project.stats.volume.toLocaleString()}</span>
                </div>
                <div>
                    <span className="text-secondary block mb-1">Visualization</span>
                    <span className="font-bold text-green">{project.stats.visual_score}/100</span>
                </div>
                <div>
                    <span className="text-secondary block mb-1">Type</span>
                    <span className="font-bold text-white">{project.type}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="flex gap-2">
                    {project.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-1 rounded bg-white/5 text-secondary border border-white/5">
                            {tag}
                        </span>
                    ))}
                </div>
                <button
                    className="text-sm text-green hover:text-white font-medium transition-colors z-10 relative"
                >
                    View Details →
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
