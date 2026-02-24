import React from 'react';

export const GamesFilters = () => {
    const tabs = ["ALL ARENAS", "HIGH STAKES", "FAST ROUNDS"];

    return (
        <div className="flex items-center justify-between border-y border-white/10 py-4 mb-8">
            <div className="flex gap-4">
                {tabs.map((tab, i) => (
                    <button
                        key={tab}
                        className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase transition-all border ${i === 0
                                ? "bg-neon-green text-black border-neon-green"
                                : "bg-transparent text-zinc-400 border-white/10 hover:border-white/20"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="FILTER_BY_ID"
                    className="bg-black/60 border border-white/10 pl-10 pr-4 py-2 text-[10px] font-mono tracking-widest text-zinc-400 focus:outline-none focus:border-neon-green/50 w-64 uppercase"
                />
            </div>
        </div>
    );
};
