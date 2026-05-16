"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css' // Import standard sleek layout styles

// Dynamically import Quill with SSR disabled to prevent Next.js hydration flickering
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-40 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse rounded-xl" />
  ),
})

type Props = {
  value: string
  onChange: (htmlContent: string) => void
  placeholder?: string
}

// Minimalist, accessible default toolbar options tailored for workspace updates
const defaultModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'code', 'link'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['clean'] // Clear formatting option
  ],
}

const defaultFormats = [
  'header',
  'bold', 'italic', 'underline', 'code', "link",
  'list' // <-- Change 'ordered' and 'bullet' to just 'list'
]

const SharedRichEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write a description here... Markdown or basic rich styling supported." 
}: Props) => {
  return (
    <div className="w-full rich-editor-wrapper bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 focus-within:border-slate-400 dark:focus-within:border-slate-700 transition-all shadow-sm">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={defaultModules}
        formats={defaultFormats}
        placeholder={placeholder}
       
      />

      {/* Tailwind Layout Overrides for Quill Theme Styles */}
      <style jsx global>{`
        /* Toolbar adjustments */
        .rich-editor-wrapper .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background-color: #f8fafc;
          padding: 8px 12px;
        }
        .dark .rich-editor-wrapper .ql-toolbar.ql-snow {
          border-bottom-color: #1e293b !important;
          background-color: #0f172a;
        }

        /* Editing board box canvas styles */
        .rich-editor-wrapper .ql-container.ql-snow {
          border: none !important;
          font-family: inherit;
          font-size: 0.875rem;
        }
        .rich-editor-wrapper .ql-editor {
          min-height: 180px;
          max-height: 400px;
          color: #1e293b;
          line-height: 1.6;
        }
        .dark .rich-editor-wrapper .ql-editor {
          color: #f1f5f9;
        }

        /* Placeholder colors override */
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
          left: 15px;
        }
        .dark .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #4b5563;
        }

        /* Custom styling override for interactive toolbar SVGs inside Dark Mode */
        .dark .rich-editor-wrapper .ql-snow .ql-stroke {
          stroke: #94a3b8 !important;
        }
        .dark .rich-editor-wrapper .ql-snow .ql-fill {
          fill: #94a3b8 !important;
        }
        .dark .rich-editor-wrapper .ql-snow .ql-picker {
          color: #94a3b8 !important;
        }
        .dark .rich-editor-wrapper .ql-snow .ql-picker-options {
          background-color: #0f172a !important;
          border-color: #1e293b !important;
        }
      `}</style>
    </div>
  )
}

export default SharedRichEditor