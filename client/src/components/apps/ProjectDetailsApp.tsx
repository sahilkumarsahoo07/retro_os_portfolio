import React from 'react';
import { Project } from '@shared/schema';
import { ExternalLink, Github, Terminal } from 'lucide-react';

export default function ProjectDetailsApp({ params, onClose }: { params?: Project, onClose: () => void }) {
    if (!params) {
        return (
            <div className="flex items-center justify-center h-full bg-white text-gray-500">
                <p>No project data selected.</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white text-black font-body text-sm overflow-hidden select-none">
            {/* Project Header */}
            <div className="bg-[#000080] text-white p-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 flex items-center justify-center win98-inset">
                        <Terminal size={32} strokeWidth={1} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-tight">{params.title}</h1>
                        <p className="text-xs text-blue-200">Release 1.0.0</p>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-win98">

                {/* Description */}
                <section>
                    <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Description</h2>
                    <p className="text-gray-800 leading-relaxed px-1">
                        {params.description}
                    </p>
                </section>

                {/* Tech Stack */}
                <section>
                    <h2 className="text-xs font-bold uppercase mb-2 bg-[#dfdfdf] px-2 py-0.5 border-l-4 border-[#000080]">Technical Specifications</h2>
                    <div className="flex flex-wrap gap-2 px-1">
                        {params.technologies?.map(tech => (
                            <span key={tech} className="px-2 py-1 bg-[#f0f0f0] border border-[#808080] text-[10px] font-bold">
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Metadata Table */}
                <div className="win98-inset bg-[#dfdfdf] p-2 text-[11px]">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="text-gray-600">Platform:</div>
                        <div className="font-bold text-black font-mono uppercase">Windows 98 x64 (Simulated)</div>
                        <div className="text-gray-600">Development:</div>
                        <div className="font-bold text-black font-mono">Modern Tech Stack</div>
                        <div className="text-gray-600">Build Status:</div>
                        <div className="font-bold text-green-700 font-mono">STABLE</div>
                    </div>
                </div>

            </div>

            {/* Action Bar (Footer) */}
            <div className="p-3 bg-[#c0c0c0] border-t border-[#808080] flex justify-end gap-2 shrink-0">
                {params.githubLink && (
                    <a
                        href={params.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="win98-outset bg-[#c0c0c0] px-4 py-1.5 flex items-center gap-2 text-xs active:win98-inset"
                    >
                        <Github size={14} />
                        Source <u>C</u>ode
                    </a>
                )}
                {params.liveDemo && (
                    <a
                        href={params.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="win98-outset bg-[#c0c0c0] text-black px-4 py-1.5 flex items-center gap-2 text-xs active:win98-inset font-bold"
                    >
                        <ExternalLink size={14} />
                        <u>L</u>ive Demo
                    </a>
                )}
                <button
                    onClick={onClose}
                    className="win98-outset bg-[#c0c0c0] px-6 py-1.5 text-xs active:win98-inset ml-2"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
