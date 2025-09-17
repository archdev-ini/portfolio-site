import { DraftingCompass, CodeXml, Users, LucideIcon, Home, Database, PenSquare, Scale, Blocks, Mic } from 'lucide-react';
import type { ComponentType } from 'react';

export type Project = {
  id: string;
  title: string;
  category: 'Architecture' | 'Web3' | 'Writing' | 'Community';
  description: string;
  imageId: string;
  link: string;
};

export type JournalPost = {
  id: string;
  title: string;
  category: 'Reflections' | 'Experiments' | 'Design Notes';
  description: string;
  imageId: string;
  link: string;
};

export type SkillCategory = {
  category: string;
  icon: ComponentType;
  items: string[];
};

export const projects: Project[] = [
  {
    id: 'arch-1',
    title: 'Serene Residential Complex',
    category: 'Architecture',
    description: 'A conceptual design for a residential complex focusing on sustainable materials and community spaces.',
    imageId: 'project-arch-1',
    link: '#',
  },
  {
    id: 'web3-1',
    title: 'Decentralized Identity Protocol',
    category: 'Web3',
    description: 'An open-source protocol for self-sovereign identity on the Ethereum blockchain, giving users control over their data.',
    imageId: 'project-web3-1',
    link: '#',
  },
  {
    id: 'writing-1',
    title: 'The Aesthetics of Code',
    category: 'Writing',
    description: 'An essay exploring the parallels between architectural design principles and writing clean, elegant code.',
    imageId: 'project-writing-1',
    link: '#',
  },
  {
    id: 'arch-2',
    title: 'Urban Regeneration Masterplan',
    category: 'Architecture',
    description: 'A masterplan for revitalizing an industrial district into a mixed-use urban hub with green corridors.',
    imageId: 'project-arch-2',
    link: '#',
  },
  {
    id: 'comm-1',
    title: 'Dev x Design Meetup',
    category: 'Community',
    description: 'Co-founded and organized a local meetup series for developers and designers to foster cross-disciplinary collaboration.',
    imageId: 'project-comm-1',
    link: '#',
  },
  {
    id: 'web3-2',
    title: 'NFT Ticketing Platform',
    category: 'Web3',
    description: 'A proof-of-concept for an event ticketing platform using NFTs to prevent fraud and enable a secondary market.',
    imageId: 'project-web3-2',
    link: '#',
  },
];

export const journalPosts: JournalPost[] = [
  {
    id: 'journal-1',
    title: 'On Digital Craftsmanship',
    category: 'Reflections',
    description: 'Exploring what it means to be a craftsman in the age of digital fabrication and artificial intelligence.',
    imageId: 'journal-1',
    link: '#',
  },
  {
    id: 'journal-2',
    title: 'The Future of Cities: Decentralized and Autonomous?',
    category: 'Experiments',
    description: 'A thought experiment on how blockchain technology could reshape urban planning and governance.',
    imageId: 'journal-2',
    link: '#',
  },
  {
    id: 'journal-3',
    title: 'Learning in Public: A Developer\'s Manifesto',
    category: 'Design Notes',
    description: 'Why sharing your learning process is one of the most effective ways to grow as a developer and builder.',
    imageId: 'journal-3',
    link: '#',
  },
];

export const skills: SkillCategory[] = [
  {
    category: 'Architecture & Design',
    icon: DraftingCompass,
    items: ['AutoCAD', 'Revit', 'SketchUp', 'Rhino 3D', 'V-Ray', 'Adobe Suite', 'Masterplanning', 'Sustainable Design'],
  },
  {
    category: 'Development & Web3',
    icon: CodeXml,
    items: ['React / Next.js', 'TypeScript', 'Solidity', 'Hardhat', 'Ethers.js', 'Node.js', 'PostgreSQL', 'Vercel'],
  },
  {
    category: 'Community & Writing',
    icon: Users,
    items: ['Technical Writing', 'Content Strategy', 'Public Speaking', 'Community Management', 'Workshop Facilitation', 'Substack', 'Notion', 'Figma'],
  },
];
