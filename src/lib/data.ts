import { DraftingCompass, CodeXml, Users, LucideIcon, Home, Database, PenSquare, Scale, Blocks, Mic, Briefcase, GraduationCap } from 'lucide-react';
import type { ComponentType } from 'react';

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: 'Architecture' | 'Web3' | 'Writing' | 'Community';
  description: string;
  imageId: string;
  galleryImageIds?: string[];
  link: string;
  role: string;
  duration: string;
  technologies: string[];
  overview: string;
  process: string;
  outcomes: string;
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
  icon: LucideIcon;
  items: string[];
};

export type CVItem = {
  date: string;
  title: string;
  subtitle: string;
  description: string;
};

export const projects: Project[] = [
  {
    id: 'arch-1',
    slug: 'serene-residential-complex',
    title: 'Serene Residential Complex',
    category: 'Architecture',
    description: 'A conceptual design for a residential complex focusing on sustainable materials and community spaces.',
    imageId: 'project-arch-1',
    galleryImageIds: ['project-arch-1-gallery-1', 'project-arch-1-gallery-2'],
    link: '#',
    role: 'Lead Architect',
    duration: '6 Months',
    technologies: ['Revit', 'AutoCAD', 'V-Ray', 'Sustainable Design'],
    overview: 'This project was a conceptual exploration for a multi-unit residential complex in a rapidly urbanizing area. The core challenge was to create a high-density living solution that prioritized resident well-being, sustainability, and community interaction, moving away from the typical isolated apartment block model.',
    process: 'The design process began with extensive site analysis and climate studies to inform a passive design strategy. We focused on natural ventilation, daylighting, and the use of locally-sourced, low-impact materials like rammed earth and bamboo. The layout was organized around a series of interconnected courtyards, creating a hierarchy of public and private spaces that encourage social interaction while maintaining individual privacy.',
    outcomes: 'The final design resulted in a 30% reduction in projected energy consumption compared to conventional buildings of similar scale. The modular construction plan also offered a cost-effective and scalable solution. The project was featured in a university exhibition on sustainable urban futures and served as a foundational study for my thesis on climate-responsive architecture.',
  },
  {
    id: 'web3-1',
    slug: 'decentralized-identity-protocol',
    title: 'Decentralized Identity Protocol',
    category: 'Web3',
    description: 'An open-source protocol for self-sovereign identity on the Ethereum blockchain, giving users control over their data.',
    imageId: 'project-web3-1',
    galleryImageIds: ['project-web3-1-gallery-1', 'project-web3-1-gallery-2'],
    link: '#',
    role: 'Protocol Developer',
    duration: '4 Months',
    technologies: ['Solidity', 'Ethers.js', 'Hardhat', 'TypeScript'],
    overview: 'In the current web, user data is siloed and controlled by corporations. This project aimed to create a decentralized protocol that allows users to own and manage their digital identity, credentials, and data across different platforms without relying on a central intermediary.',
    process: 'We designed a system of smart contracts on Ethereum that allows users to create a unique identity anchor. Verifiable credentials can be issued by trusted entities (e.g., universities, employers) and attached to this identity, which the user can then selectively disclose to third-party applications. We used a test-driven development approach with Hardhat to ensure the security and reliability of the contracts.',
    outcomes: 'Successfully deployed a functional version of the protocol on the Sepolia testnet. We developed a proof-of-concept dApp demonstrating how a user could log into a service and verify their educational credentials without revealing any other personal information. The project was open-sourced and has been forked by several developers exploring similar concepts.',
  },
  {
    id: 'writing-1',
    slug: 'the-aesthetics-of-code',
    title: 'The Aesthetics of Code',
    category: 'Writing',
    description: 'An essay exploring the parallels between architectural design principles and writing clean, elegant code.',
    imageId: 'project-writing-1',
    galleryImageIds: ['project-writing-1-gallery-1'],
    link: '#',
    role: 'Author',
    duration: '1 Week',
    technologies: ['Substack', 'Content Strategy'],
    overview: 'This essay was born from my dual life as an architecture student and a developer. I noticed a deep connection between the principles of good design in the physical world—structure, hierarchy, legibility, and elegance—and the qualities of well-written code. The article aimed to bridge these two worlds for an audience of designers and developers.',
    process: 'I structured the essay around key architectural concepts like "form follows function," "rhythm and repetition," and "economy of means." For each concept, I provided a parallel example from software development, such as the single responsibility principle, DRY (Don\'t Repeat Yourself) patterns, and writing minimalist, efficient algorithms. The goal was to make abstract coding principles tangible through architectural metaphors.',
    outcomes: 'The article was published on my Substack, "0xSketches," and was widely shared on platforms like X and Hacker News. It sparked a vibrant discussion about the interdisciplinary nature of design and creativity, and was featured in a popular developer newsletter. It remains one of my most-read pieces.',
  },
  {
    id: 'arch-2',
    slug: 'urban-regeneration-masterplan',
    title: 'Urban Regeneration Masterplan',
    category: 'Architecture',
    description: 'A masterplan for revitalizing an industrial district into a mixed-use urban hub with green corridors.',
    imageId: 'project-arch-2',
    link: '#',
    role: 'Urban Designer (Team)',
    duration: '1 Semester',
    technologies: ['Rhino 3D', 'Masterplanning', 'GIS', 'Adobe Suite'],
    overview: 'Our academic team was tasked with reimagining a derelict industrial zone on the edge of the city. The area was characterized by abandoned warehouses, poor infrastructure, and environmental degradation. Our goal was to propose a viable masterplan that would transform it into a vibrant, sustainable, and economically productive mixed-use district.',
    process: 'Our process was heavily research-driven, involving historical analysis, community consultation, and environmental assessments. We proposed a phased development strategy, starting with the creation of a central green corridor that would serve as the "lungs" of the new district. This was followed by adaptive reuse of existing warehouse structures for commercial and cultural spaces, and the introduction of new residential buildings with a focus on walkability and public transit.',
    outcomes: 'The masterplan won a university award for urban innovation. It successfully demonstrated a model for brownfield redevelopment that balanced economic viability with social and environmental goals. The proposal was presented to the local city planning authority as a case study for future urban regeneration projects.',
  },
  {
    id: 'comm-1',
    slug: 'dev-x-design-meetup',
    title: 'Dev x Design Meetup',
    category: 'Community',
    description: 'Co-founded and organized a local meetup series for developers and designers to foster cross-disciplinary collaboration.',
    imageId: 'project-comm-1',
    link: '#',
    role: 'Co-founder & Organizer',
    duration: 'Ongoing',
    technologies: ['Community Management', 'Public Speaking', 'Event Planning'],
    overview: 'As both a designer and developer, I often felt a gap between these two communities. They solve similar problems but speak different languages. Dev x Design was created to bridge that gap, providing a space for professionals and students from both fields to meet, share ideas, and learn from each other.',
    process: 'We started by hosting monthly events at a local co-working space. Each meetup featured one talk from a designer and one from a developer on a shared theme (e.g., "Design Systems," "Prototyping," "Accessibility"). This was followed by a structured networking session to encourage meaningful conversations. We promoted the events through social media and partnerships with local universities and tech companies.',
    outcomes: 'The community has grown to over 500 members in its first year. We have hosted 12 successful events and facilitated numerous collaborations, mentorships, and even job placements. The meetup has become a recognized hub for the local design and tech scene, fostering a culture of mutual respect and cross-disciplinary innovation.',
  },
  {
    id: 'web3-2',
    slug: 'nft-ticketing-platform',
    title: 'NFT Ticketing Platform',
    category: 'Web3',
    description: 'A proof-of-concept for an event ticketing platform using NFTs to prevent fraud and enable a secondary market.',
    imageId: 'project-web3-2',
    link: '#',
    role: 'Full-Stack Developer',
    duration: '2 Months',
    technologies: ['React', 'Next.js', 'Solidity', 'IPFS'],
    overview: 'The traditional event ticketing industry is plagued by issues like ticket scalping, fraud, and a lack of control for organizers and artists. This project explored how Non-Fungible Tokens (NFTs) could provide a more secure, transparent, and programmable solution for ticketing.',
    process: 'I built a full-stack dApp with a React/Next.js frontend and a Solidity smart contract backend. Each ticket was minted as an ERC-721 token, with its metadata stored on IPFS. The smart contract included logic to control resale prices (e.g., setting a maximum markup) and automatically pay out a percentage of secondary sales back to the event organizer or artist, creating a fairer ecosystem.',
    outcomes: 'The proof-of-concept was fully functional, allowing users to connect their wallet, purchase an NFT ticket, view it in their wallet, and simulate a "check-in" process that verified ownership. The project demonstrated a practical use case for NFTs beyond digital art, highlighting their potential to disrupt real-world industries. I wrote an accompanying article that was well-received in the Web3 community.',
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

export const cvExperience: CVItem[] = [
  {
    date: '2023 - Present',
    title: 'Founder & Lead Developer',
    subtitle: 'Aether & Rootos',
    description: 'Building decentralized platforms for creative collaboration and skill-based learning. Responsible for product vision, smart contract development, and community growth.',
  },
  {
    date: '2022 - 2023',
    title: 'Architectural Intern',
    subtitle: 'Urban-Future Architects',
    description: 'Contributed to the design and documentation of large-scale residential and mixed-use projects. Focused on sustainable design research and BIM modeling.',
  },
  {
    date: '2021',
    title: 'Web3 Research Fellow',
    subtitle: 'Decentralized Futures Lab',
    description: 'Researched and wrote a whitepaper on decentralized governance models (DAOs) and their potential application in urban planning.',
  },
];

export const cvEducation: CVItem[] = [
  {
    date: '2020 - 2025 (Expected)',
    title: 'Master of Architecture',
    subtitle: 'University of Lagos',
    description: 'Thesis focus: The integration of smart contracts in managing community-owned real estate and public spaces.',
  },
  {
    date: '2021',
    title: 'Full-Stack Web3 Developer Bootcamp',
    subtitle: 'Chainshot',
    description: 'Intensive, project-based program covering Solidity, smart contracts, dApp development, and decentralized finance (DeFi).',
  },
];
