'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import localProjectsData from '../../data/projects.json';

interface Project {
  id: string;
  title: string;
  description: string;
  extendedDescription: string;
  category: string;
  stack: string[];
  githubUrl: string;
  demoUrl?: string;
  author: string;
}

export default function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>(localProjectsData as Project[]);
  const [githubUser, setGithubUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load configuration on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGithubUser(localStorage.getItem('walther_github_user') || '');
    }
    setIsLoading(false);
  }, []);

  // Helper to dynamically rewrite the GitHub URL
  const getRewrittenGithubUrl = (url: string) => {
    const targetUser = githubUser || 'walterparradocorredor-stack';
    return url.replace('madfer93', targetUser);
  };

  // Preview only the first 3 projects
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="w-full space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-cyan-400 border-slate-800 animate-spin" />
          <p className="text-xs font-mono text-cyan-400 animate-pulse">Obteniendo proyectos en tiempo real...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card-hover flex flex-col justify-between overflow-hidden relative group p-6 text-left"
              style={{ minHeight: '260px' }}
            >
              {/* Card Header: Category and Username */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] tracking-wider px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-bold text-gray-400 group-hover:text-blue-400 transition-colors uppercase">
                  {project.category}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold font-mono">
                  @{githubUser || 'walterparradocorredor-stack'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 flex-grow">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Card Footer: Tech Stack & Actions */}
              <div className="mt-6 pt-4 border-t border-slate-900/60 space-y-4">
                <div className="flex flex-wrap gap-1">
                  {project.stack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-950/80 text-gray-500 border border-slate-900"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 3 && (
                    <span className="text-[9px] font-mono text-gray-600 pl-1">
                      +{project.stack.length - 3} más
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={getRewrittenGithubUrl(project.githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 rounded-lg bg-slate-950 hover:bg-slate-900 text-xs font-bold text-slate-300 hover:text-cyan-400 transition-all border border-slate-900 hover:border-cyan-500/20"
                  >
                    Código
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-xs font-bold text-blue-400 transition-all border border-blue-500/20 hover:border-blue-500/40"
                    >
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
