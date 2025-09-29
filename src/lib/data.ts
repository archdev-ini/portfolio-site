import { DraftingCompass, CodeXml, Users, type LucideIcon } from 'lucide-react';
import { fetchRSSFeed, type FeedItem } from './rss';

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: 'Architecture' | 'Web3' | 'Writing' | 'Community';
  description: string;
  imageId: string | null;
  galleryImageIds: string[];
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
  category: 'Reflections' | 'Experiments' | 'Design Notes' | string; // Allow for other tags
  description: string;
  imageId: string;
  link: string;
  tags?: string[];
};

export type Skill = {
    id: string;
    name: string;
    category: 'Architecture & Design' | 'Web3 & Development' | 'Writing & Community';
}

export type SkillCategory = {
  category: string;
  icon: LucideIcon;
  items: string[];
};

export type CVItem = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
};

export type SocialLink = {
    name: string;
    href: string;
}

export type SiteSettings = {
    id: string;
    siteTitle: string;
    hero: {
        headline: string;
        tagline: string;
        intro: string;
    };
    footer: {
        text: string;
        socialLinks: SocialLink[];
    }
};

export type AboutContent = {
    id: string;
    headline: string;
    shortText: string;
    fullText: string[];
    highlights: Array<{ title: string, description: string }>;
    profileImageId: string;
}

export type ContactContent = {
    id: string;
    introText: string;
    ctaLine: string;
}

// MOCK DATA
const MOCK_PROJECTS: Project[] = [
    {
        id: 'rec1',
        slug: 'serene-residence',
        title: 'Serene Residential Complex',
        category: 'Architecture',
        description: 'A concept for a modular, eco-conscious residential complex focusing on community and sustainable living.',
        imageId: 'project-arch-1',
        galleryImageIds: ['project-arch-1-gallery-1', 'project-arch-1-gallery-2'],
        link: '#',
        role: 'Lead Designer & Planner',
        duration: '6 Months (Concept)',
        technologies: ['Revit', 'AutoCAD', 'SketchUp'],
        overview: 'This project explores how modular construction can create beautiful, affordable, and sustainable housing. The design prioritizes natural light, shared green spaces, and a low environmental footprint.',
        process: 'The process began with extensive research into sustainable materials and modular building techniques. This was followed by iterative design phases, moving from hand-drawn sketches to detailed 3D models and renderings. Community feedback was incorporated at various stages.',
        outcomes: 'The final concept includes a detailed site plan, floor plans for various unit types, and a comprehensive sustainability report. The project serves as a blueprint for future developments in the region.',
        featured: true,
    },
    {
        id: 'rec2',
        slug: 'decentralized-identity',
        title: 'Decentralized Identity Protocol',
        category: 'Web3',
        description: 'An open-source protocol for managing digital identity on the blockchain, giving users control over their data.',
        imageId: 'project-web3-1',
        galleryImageIds: ['project-web3-1-gallery-1', 'project-web3-1-gallery-2'],
        link: '#',
        role: 'Protocol Designer & Community Manager',
        duration: 'Ongoing',
        technologies: ['Solidity', 'Next.js', 'Genkit'],
        overview: 'In a world where data is a commodity, this protocol aims to return ownership to the individual. It allows users to create a self-sovereign digital identity that they can use across various online services without compromising their privacy.',
        process: 'The development is community-driven, following a transparent roadmap. It involves smart contract development, building SDKs for developers, and fostering a community of early adopters and contributors.',
        outcomes: 'An initial version of the protocol has been deployed on a testnet. The project has garnered a small but active community, and several dApps are exploring integration.',
        featured: true,
    },
     {
        id: 'rec3',
        slug: 'aesthetics-of-code',
        title: 'The Aesthetics of Code',
        category: 'Writing',
        description: 'A series of essays exploring the intersection of code, design, and philosophy.',
        imageId: 'project-writing-1',
        galleryImageIds: ['project-writing-1-gallery-1'],
        link: '#',
        role: 'Writer & Researcher',
        duration: '3 Months',
        technologies: ['Substack', 'Obsidian'],
        overview: 'This essay collection delves into the idea that code can be more than just functional; it can be expressive, elegant, and beautiful. It draws parallels between software architecture and traditional architecture, and between programming languages and natural languages.',
        process: 'Each essay began as a series of notes and sketches in Obsidian. These were then developed into long-form articles, edited, and published on Substack. The writing process was intentionally public, with drafts shared for feedback.',
        outcomes: 'The series was well-received, sparking conversations on social media and leading to invitations to speak on podcasts. It has helped to establish a unique voice in the tech and design space.',
        featured: true,
    }
];

const MOCK_SITE_SETTINGS: SiteSettings = {
    id: 'rec_sitesettings',
    siteTitle: 'Inioluwa Oladipupo',
    hero: {
        headline: 'Architecture · Web3 · Creative Innovation',
        tagline: 'Designing Futures. Building Communities.',
        intro: "I’m Inioluwa Oladipupo—an architect in training and a community builder in Web3, exploring how spaces, systems, and stories can reimagine the way we live, learn, and connect."
    },
    footer: {
        text: '© 2024 Inioluwa Oladipupo. All Rights Reserved.',
        socialLinks: [
            { name: 'Github', href: 'https://github.com' },
            { name: 'Twitter', href: 'https://twitter.com/inioluwa_xyz' },
            { name: 'LinkedIn', href: 'https://linkedin.com' },
            { name: 'Substack', href: 'https://substack.com' },
            { name: 'Email', href: 'mailto:inioluwaoladipupostudio@gmail.com' }
        ]
    }
};

const MOCK_ABOUT_CONTENT: AboutContent = {
    id: 'rec_about',
    headline: 'Shaping Space. Empowering Communities. Reimagining Futures.',
    shortText: 'I’m an architecture student and Web3 community builder working at the intersection of design, technology, and storytelling.',
    fullText: [
        "I’m Inioluwa Oladipupo—an architecture student and Web3 community builder working at the intersection of design, technology, and storytelling.",
        "My journey is about more than projects or platforms—it’s about creating systems that empower people and spark new possibilities.",
        "In architecture, I design climate-responsive, culturally rooted spaces that adapt to people’s needs today while anticipating tomorrow’s challenges.",
        "In Web3, I focus on building communities—designing ecosystems where collaboration, learning, and creativity thrive beyond borders.",
        "Through writing, I connect ideas, document the process, and invite others into the conversation of shaping futures together.",
        "Across all of this, my mission is simple: to blend design, community, and innovation into frameworks that don’t just imagine change but make it real."
    ],
    highlights: [
        { title: 'Architecture', description: 'Designing sustainable, human-centered spaces with cultural depth and environmental intelligence.' },
        { title: 'Web3 / Community', description: 'Building decentralized communities and open ecosystems that enable people to learn, connect, and grow.' },
        { title: 'Writing', description: 'Publishing essays and reflections on architecture, technology, and creativity through platforms like 0xSketches.' },
        { title: 'Initiatives', description: 'Through projects like Aether Community, Rootos, and Buildbase, I explore new ways to democratize knowledge, empower collaboration, and design systems that matter.' }
    ],
    profileImageId: 'about-portrait'
};

const MOCK_CONTACT_CONTENT: ContactContent = {
    id: 'rec_contact',
    introText: 'Get in Touch',
    ctaLine: 'I’m building toward futures where design, technology, and community align. If you’re working on something visionary—or want to co-create the systems of tomorrow—let’s connect.'
}

const MOCK_SKILLS: SkillCategory[] = [
    {
      category: 'Architecture & Design',
      icon: DraftingCompass,
      items: [
        'Climate-responsive, conceptual design',
        'BIM-driven workflows (Revit, AutoCAD)',
        'Systems thinking for built environments',
      ],
    },
    {
      category: 'Web3 & Development',
      icon: CodeXml,
      items: [
        'Decentralized collaboration frameworks',
        'Community building & engagement',
        'Smart Contract Concepts',
        'Next.js & React',
      ],
    },
    {
      category: 'Writing & Community',
      icon: Users,
      items: [
        'Content strategy & storytelling',
        'Open learning platforms',
        'Cross-disciplinary innovation',
        'Community design & management'
      ],
    },
];

const MOCK_CV_EXPERIENCE: CVItem[] = [
    { id: 'exp1', date: '2023 - Present', title: 'Community Architect', subtitle: 'Aether Community', description: 'Designing and building a decentralized learning ecosystem for creatives and developers.' },
    { id: 'exp2', date: '2022 - 2023', title: 'Architectural Intern', subtitle: 'Studio Praxis', description: 'Contributed to the design and documentation of several residential and commercial projects.' },
];

const MOCK_CV_EDUCATION: CVItem[] = [
    { id: 'edu1', date: '2020 - 2025', title: 'Master of Architecture', subtitle: 'University of Digital Futures', description: 'Focusing on computational design and sustainable urbanism.' },
];


function mapFeedItemToJournalPost(item: FeedItem, index: number): JournalPost {
    const description = item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : 'No description available.';
    return {
        id: item.link,
        title: item.title,
        link: item.link,
        description: description,
        category: item.categories?.[0] || 'Uncategorized',
        tags: item.categories || [],
        imageId: `journal-${(index % 3) + 1}`,
    };
}

async function getJournalPostsFromRss(): Promise<JournalPost[]> {
    const feedUrl = process.env.SUBSTACK_URL;
    if (!feedUrl) return [];

    const feedItems = await fetchRSSFeed(feedUrl);
    
    const journalTags = ['Studio Notes', 'Building Futures', 'IO Lab'];

    return feedItems
        .filter(item => item.categories?.some(cat => journalTags.includes(cat)))
        .map(mapFeedItemToJournalPost);
}

async function getProjectPostsFromRss(): Promise<JournalPost[]> {
    const feedUrl = process.env.SUBSTACK_URL;
    if (!feedUrl) return [];

    const feedItems = await fetchRSSFeed(feedUrl);
    
    const projectTags = ['Project Journal', 'Design Sketches'];

    return feedItems
        .filter(item => item.categories?.some(cat => projectTags.includes(cat)))
        .map(mapFeedItemToJournalPost);
}

// "Database" object with functions to fetch data on the server
export const db = {
    getSiteSettings: async (): Promise<SiteSettings> => MOCK_SITE_SETTINGS,
    getAboutContent: async (): Promise<AboutContent> => MOCK_ABOUT_CONTENT,
    getContactContent: async (): Promise<ContactContent> => MOCK_CONTACT_CONTENT,
    getProjects: async (): Promise<Project[]> => MOCK_PROJECTS,
    getJournalPosts: getJournalPostsFromRss,
    getProjectPosts: getProjectPostsFromRss,
    getGroupedSkills: async (): Promise<SkillCategory[]> => MOCK_SKILLS,
    getCVExperience: async (): Promise<CVItem[]> => MOCK_CV_EXPERIENCE,
    getCVEducation: async (): Promise<CVItem[]> => MOCK_CV_EDUCATION,
};
