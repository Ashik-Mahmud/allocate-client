import { 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Users, 
  Layout, 
  Settings, 
  Key 
} from 'lucide-react';
import { BsGithub } from 'react-icons/bs';
import { IconType } from 'react-icons';

export interface DocLink {
  title: string;
  href: string;
}

export interface DocSection {
  title: string;
  links: DocLink[];
}

export interface Feature {
  title: string;
  desc: string;
  icon: any | IconType;
}

export const DOCS_CONFIG = {
  navigation: [
    {
      title: "Getting Started",
      links: [
        { title: "Introduction", href: "#intro" },
        { title: "Installation", href: "#install" },
        { title: "Quick Start", href: "#quickstart" },
      ],
    },
    {
      title: "Core Concepts",
      links: [
        { title: "Resource Management", href: "#resources" },
        { title: "Credit System", href: "#credits" },
        { title: "User Roles", href: "#roles" },
      ],
    },
    {
      title: "API Reference",
      links: [
        { title: "Authentication", href: "#auth" },
        { title: "Endpoints", href: "#endpoints" },
        { title: "Webhooks", href: "#webhooks" },
      ],
    },
  ] as DocSection[],
  
  features: [
    { icon: ShieldCheck, title: "Role-based Access", desc: "Granular permissions for Admins and Users." },
    { icon: Terminal, title: "API-First Design", desc: "Fully documented RESTful endpoints." },
    { icon: Users, title: "Team Management", desc: "Manage users and organizational units." },
    { icon: Layout, title: "Resource Allocation", desc: "Efficiently assign resources." },
    { icon: Settings, title: "Customizable", desc: "Tailor Allocate to your needs." },
    { icon: BsGithub, title: "Open Source", desc: "Available on GitHub." },
  ] as Feature[],

  tableOfContents: [
    { title: "What is Allocate?", id: "intro" },
    { title: "Core Features", id: "features" },
    { title: "Integration", id: "integration" },
    { title: "Quick Samples", id: "samples" },
  ]
};