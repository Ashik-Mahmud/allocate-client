import React from 'react'
import AllocateDocs from '@/components/docs/AllocateDocsMain'

type Props = {}
export const metadata = {
    title: "Documentation - Allocate",
    description: "Comprehensive documentation for Allocate, the AI-powered resource management platform. Learn how to optimize your resources, manage credits, and get the most out of Allocate with our detailed guides and FAQs.",
}
export default function DocsPage() {
    return (
        <div>
            <AllocateDocs />
        </div>
    )
}

