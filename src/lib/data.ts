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
  featured?: boolean;
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

const projects: Project[] = [
  {
    id: 'arch-1',
    slug: 'akinyemi-family-house',
    title: 'Akinyemi Family House',
    category: 'Architecture',
    description: 'A courtyard-based, climate-responsive residential design in Lagos.',
    imageId: 'project-arch-1',
    galleryImageIds: ['project-arch-1-gallery-1', 'project-arch-1-gallery-2'],
    link: '#',
    role: 'Lead Architect',
    duration: '6 Months',
    technologies: ['Revit', 'AutoCAD', 'V-Ray', 'Sustainable Design'],
    overview: 'This project was a conceptual exploration for a multi-unit residential complex in a rapidly urbanizing area. The core challenge was to create a high-density living solution that prioritized resident well-being, sustainability, and community interaction, moving away from the typical isolated apartment block model.',
    process: 'The design process began with extensive site analysis and climate studies to inform a passive design strategy. We focused on natural ventilation, daylighting, and the use of locally-sourced, low-impact materials like rammed earth and bamboo. The layout was organized around a series of interconnected courtyards, creating a hierarchy of public and private spaces that encourage social interaction while maintaining individual privacy.',
    outcomes: 'The final design resulted in a 30% reduction in projected energy consumption compared to conventional buildings of similar scale. The modular construction plan also offered a cost-effective and scalable solution. The project was featured in a university exhibition on sustainable urban futures and served as a foundational study for my thesis on climate-responsive architecture.',
    featured: true,
  },
  {
    id: 'web3-1',
    slug: 'learn-to-earn-platform',
    title: 'Learn-to-Earn Platform Prototype',
    category: 'Web3',
    description: 'A decentralized platform with proof-of-skill credentials.',
    imageId: 'project-web3-1',
    galleryImageIds: ['project-web3-1-gallery-1', 'project-web3-1-gallery-2'],
    link: '#',
    role: 'Protocol Developer',
    duration: '4 Months',
    technologies: ['Solidity', 'Ethers.js', 'Hardhat', 'TypeScript'],
    overview: 'In the current web, user data is siloed and controlled by corporations. This project aimed to create a decentralized protocol that allows users to own and manage their digital identity, credentials, and data across different platforms without relying on a central intermediary.',
    process: 'We designed a system of smart contracts on Ethereum that allows users to create a unique identity anchor. Verifiable credentials can be issued by trusted entities (e.g., universities, employers) and attached to this identity, which the user can then selectively disclose to third-party applications. We used a test-driven development approach with Hardhat to ensure the security and reliability of the contracts.',
    outcomes: 'Successfully deployed a functional version of the protocol on the Sepolia testnet. We developed a proof-of-concept dApp demonstrating how a user could log into a service and verify their educational credentials without revealing any other personal information. The project was open-sourced and has been forked by several developers exploring similar concepts.',
    featured: true,
  },
  {
    id: 'writing-1',
    slug: '0xsketches-substack',
    title: '0xSketches (Substack)',
    category: 'Writing',
    description: 'Reflections at the intersection of architecture and Web3.',
    imageId: 'project-writing-1',
    galleryImageIds: ['project-writing-1-gallery-1'],
    link: '#',
    role: 'Author',
    duration: 'Ongoing',
    technologies: ['Substack', 'Content Strategy'],
    overview: 'This essay was born from my dual life as an architecture student and a developer. I noticed a deep connection between the principles of good design in the physical world—structure, hierarchy, legibility, and elegance—and the qualities of well-written code. The article aimed to bridge these two worlds for an audience of designers and developers.',
    process: 'I structured the essay around key architectural concepts like "form follows function," "rhythm and repetition," and "economy of means." For each concept, I provided a parallel example from software development, such as the single responsibility principle, DRY (Don\'t Repeat Yourself) patterns, and writing minimalist, efficient algorithms. The goal was to make abstract coding principles tangible through architectural metaphors.',
    outcomes: 'The article was published on my Substack, "0xSketches," and was widely shared on platforms like X and Hacker News. It sparked a vibrant discussion about the interdisciplinary nature of design and creativity, and was featured in a popular developer newsletter. It remains one of my most-read pieces.',
    featured: true,
  },
  {
    id: 'comm-1',
    slug: 'aether-community',
    title: 'Aether Community',
    category: 'Community',
    description: 'A global, locally-rooted hub for architects and designers.',
    imageId: 'project-comm-1',
    link: '#',
    role: 'Co-founder & Organizer',
    duration: 'Ongoing',
    technologies: ['Community Management', 'Public Speaking', 'Event Planning'],
    overview: 'As both a designer and developer, I often felt a gap between these two communities. They solve similar problems but speak different languages. Dev x Design was created to bridge that gap, providing a space for professionals and students from both fields to meet, share ideas, and learn from each other.',
    process: 'We started by hosting monthly events at a local co-working space. Each meetup featured one talk from a designer and one from a developer on a shared theme (e.g., "Design Systems," "Prototyping," "Accessibility"). This was followed by a structured networking session to encourage meaningful conversations. We promoted the events through social media and partnerships with local universities and tech companies.',
    outcomes: 'The community has grown to over 500 members in its first year. We have hosted 12 successful events and facilitated numerous collaborations, mentorships, and even job placements. The meetup has become a recognized hub for the local design and tech scene, fostering a culture of mutual respect and cross-disciplinary innovation.',
    featured: false,
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
    featured: false,
  },
  {
    id: 'web3-2',
    slug: 'nft-ticketing-platform',
    title: 'NFT Ticketing Platform',
    category: 'Web3',
    description: 'A proof-of-concept for issuing event tickets as non-fungible tokens on the blockchain to prevent fraud and enable a secondary market.',
    imageId: 'project-web3-2',
    link: '#',
    role: 'Smart Contract Engineer',
    duration: '3 Months',
    technologies: ['Solidity', 'OpenZeppelin', 'The Graph', 'Next.js'],
    overview: 'Event ticketing is plagued by issues like counterfeiting and exorbitant resale prices on centralized platforms. This project explored using NFTs to represent tickets, creating a transparent and secure system where ownership is verifiable on the blockchain. The goal was to empower artists and event organizers while giving fans true ownership of their tickets.',
    process: 'We developed an ERC-721 smart contract that included features like dynamic metadata (to update with event details) and transfer restrictions to control resale. A subgraph was built using The Graph Protocol to efficiently query ticket data for a frontend application. The dApp, built with Next.js and Ethers.js, allowed users to view their tickets, transfer them, and see a history of ownership.',
    outcomes: 'The platform was successfully demonstrated in a university tech showcase. It proved the viability of using NFTs for ticketing, highlighting benefits like reduced fraud and the potential for artists to earn royalties on secondary sales. The code was open-sourced and has been used as a learning resource for other developers entering the Web3 space.',
    featured: false,
  },
];

const journalPosts: JournalPost[] = [
  {
    id: 'journal-1',
    title: 'The Future of Sustainable Architecture in Tropical Climates',
    category: 'Reflections',
    description: 'Exploring passive design strategies, local materials, and climate-responsive architecture in rapidly urbanizing tropical regions.',
    imageId: 'journal-1',
    link: '#',
  },
  {
    id: 'journal-2',
    title: 'Designing Proof-of-Skill Systems for Web3',
    category: 'Experiments',
    description: 'A deep dive into creating decentralized, verifiable credentials that represent skills and accomplishments beyond traditional resumes.',
    imageId: 'journal-2',
    link: '#',
  },
  {
    id: 'journal-3',
    title: 'What Community-Building Taught Me About Architecture',
    category: 'Design Notes',
    description: 'On the parallels between designing social spaces and building online communities — lessons in scale, belonging, and shared purpose.',
    imageId: 'journal-3',
    link: '#',
  },
];

const skills: SkillCategory[] = [
  {
    category: 'Architecture & Design',
    icon: DraftingCompass,
    items: ['Architectural Design', 'Urban Planning', 'Sustainable Design', 'Revit', 'AutoCAD', 'Rhino 3D', 'V-Ray', 'Adobe Suite'],
  },
  {
    category: 'Web3 & Development',
    icon: CodeXml,
    items: ['Solidity', 'TypeScript', 'Next.js', 'Hardhat', 'Ethers.js', 'The Graph', 'Smart Contracts', 'dApp Development'],
  },
  {
    category: 'Writing & Community',
    icon: Users,
    items: ['Technical Writing', 'Content Strategy', 'Public Speaking', 'Community Management', 'Workshop Facilitation', 'Substack', 'Notion', 'Figma'],
  },
];

const cvExperience: CVItem[] = [
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

const cvEducation: CVItem[] = [
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

const siteSettings = {
    siteTitle: 'Inioluwa.xyz',
    hero: {
        headline: 'Inioluwa Oladipupo',
        tagline: 'Architect • Web3 Developer • Creative Builder',
        intro: 'I design spaces, build digital futures, and shape communities — blending architecture, technology, and culture into meaningful experiences.',
    },
    footer: {
        text: 'Designed with intention.',
        socialLinks: [
            { name: 'Github', href: 'https://github.com/inioluwa-xyz' },
            { name: 'Twitter', href: 'https://twitter.com/inioluwa_xyz' },
            { name: 'LinkedIn', href: 'https://linkedin.com/in/inioluwa-oladipupo' },
            { name: 'Substack', href: 'https://substack.com' },
            { name: 'Email', href: 'mailto:hello@inioluwa.xyz' },
        ]
    }
};

const aboutContent = {
    headline: 'Designing Futures — in Space, Code, and Community',
    shortText: 'I’m an architecture student and Web3 developer exploring how design, code, and community can shape the future. My work spans sustainable architecture, decentralized learning platforms, writing, and ecosystem building — all rooted in one goal: creating intentional systems that last.',
    fullText: [
        'I’m Inioluwa Oladipupo, an architecture student and Web3 developer passionate about shaping environments — both physical and digital — that empower people.',
        'My journey sits at the crossroads of sustainable architecture, decentralized technology, and creative community building. From sketching a courtyard home for a family in Lagos to experimenting with smart contracts and proof-of-skill platforms, I’ve always been driven by one question:',
        'How can design — whether a building, a line of code, or a community — create lasting impact?',
        'I believe design isn’t just about form or function; it’s about systems. It’s the way spaces influence behavior, how technologies redistribute power, and how communities spark possibility. That’s why my work spans multiple disciplines but stays rooted in one mission: to build intentional ecosystems where creativity, culture, and innovation thrive together.',
    ],
    highlights: [
        {
          title: 'Architecture',
          description: 'Climate-responsive, sustainable design with a focus on local materials and community living.',
        },
        {
          title: 'Web3 / Development',
          description: 'Smart contracts, decentralized learning platforms, and experiments at the edge of design + technology.',
        },
        {
          title: 'Writing',
          description: '0xSketches (Substack), essays, and reflections that document my process and explore design futures.',
        },
        {
          title: 'Community',
          description: 'Founder of Aether, Rootos, and Buildbase — platforms empowering learning, collaboration, and resource-sharing.',
        }
    ],
    profileImageId: 'about-portrait',
};

const contactContent = {
    introText: 'Let’s Build Something Together',
    ctaLine: 'From architectural design to decentralized applications, I collaborate on projects that push boundaries and create lasting value.',
};


// "Database" object
export const db = {
    site: siteSettings,
    about: aboutContent,
    contact: contactContent,
    projects: {
        find: (slug: string) => projects.find(p => p.slug === slug),
        all: () => projects,
        featured: () => projects.filter(p => p.featured),
    },
    journal: {
        all: () => journalPosts,
        latest: (count: number) => journalPosts.slice(0, count),
    },
    skills: {
        all: () => skills,
    },
    cv: {
        experience: () => cvExperience,
        education: () => cvEducation,
    }
}
