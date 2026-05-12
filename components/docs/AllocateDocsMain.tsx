"use client"

import React from 'react'
import { BookOpen, Search, ChevronRight, Info, Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { ThemeToggle } from '../shared/theme-toggle'
import { DOCS_CONFIG, DocSection as DocSectionType, Feature } from './docs.config'

const AllocateDocs = () => {
  return (
    <div className="flex min-h-screen bg-white/70 dark:bg-slate-950/70">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-100 dark:border-slate-800 sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-50 dark:border-slate-900">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white">
              <BookOpen size={14} />
            </div>
            Allocate Docs
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          {DOCS_CONFIG.navigation.map((section) => (
            <DocSection key={section.title} title={section.title}>
              {section.links.map((link) => (
                <DocLink key={link.title} href={link.href} active={link.title === "Introduction"}>
                  {link.title}
                </DocLink>
              ))}
            </DocSection>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            Docs <ChevronRight size={12} /> Getting Started <ChevronRight size={12} /> 
            <span className="text-slate-900 dark:text-slate-200 font-medium">Introduction</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative hidden sm:block">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  placeholder="Search documentation..." 
                  className="pl-9 pr-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border-none text-xs focus:ring-2 ring-blue-500/20 transition-all outline-none w-64"
                />
             </div>
             <ThemeToggle floating={false} className="opacity-100" />
          </div>
        </header>

        <div className="flex-1 flex justify-center">
          <article className="flex-1 px-8 py-12 max-w-3xl mx-auto lg:mx-0">
            {/* Header Content */}
            <div className="space-y-2 mb-8">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Introduction</h1>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                Welcome to Allocate. Learn how to manage resources and credit-based bookings efficiently.
              </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
              {/* Introduction Section */}
              <section id="intro" className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Zap size={18} className="text-amber-500" /> What is Allocate?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Allocate is a comprehensive workforce management platform designed to streamline organizational resources.
                </p>
              </section>

              {/* Callout */}
              <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 flex gap-4">
                <Info className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Pro Tip:</strong> Integrate Groq API to refine booking notes.
                </p>
              </div>

              {/* Dynamic Feature Grid */}
              <section id="features" className="space-y-4 pt-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Core Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DOCS_CONFIG.features.map((feature, idx) => (
                    <FeatureCard key={idx} {...feature} />
                  ))}
                </div>
              </section>
            </div>
          </article>

          {/* Table of Contents */}
          <aside className="hidden xl:block w-64 p-12 sticky top-14 h-[calc(100vh-3.5rem)]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">On this page</h4>
            <ul className="space-y-3 border-l border-slate-100 dark:border-slate-800">
              {DOCS_CONFIG.tableOfContents.map((item) => (
                <TOCLink key={item.id} href={`#${item.id}`}>
                  {item.title}
                </TOCLink>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </div>
  )
}

// Sub-components stay small and generic
const DocSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
)

const DocLink = ({ children, active, href }: { children: string; active?: boolean; href: string }) => (
  <a href={href} className={cn(
    "block px-2 py-1.5 rounded-lg text-sm font-medium transition-colors",
    active 
      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
  )}>
    {children}
  </a>
)

const TOCLink = ({ children, active, href }: { children: string; active?: boolean; href: string }) => (
  <li className={cn(
    "pl-4 -ml-px text-xs font-medium transition-colors border-l",
    active ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
  )}>
    <a href={href}>{children}</a>
  </li>
)

const FeatureCard = ({ icon: Icon, title, desc }: Feature) => (
  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow group">
    <Icon className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={20} />
    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{desc}</p>
  </div>
)

export default AllocateDocs