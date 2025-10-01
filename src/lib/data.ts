import { DraftingCompass, CodeXml, Users, BrainCircuit, type LucideIcon } from 'lucide-react';
import { fetchRSSFeed, type FeedItem } from './rss';

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string; // From RSS feed tags
  description: string;
  imageId: string;
  link: string;
  content: string; // Full content from RSS
  tags?: string[];
  featured?: boolean; // We might need to derive this differently
};

export type JournalPost = {
  id: string;
  title: string;
  category: string; 
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
    name: 'Github' | 'Twitter' | 'LinkedIn' | 'Substack' | 'Email' | 'Instagram';
    href: string;
}

export type SiteSettings = {
    id: string;
    siteTitle: string;
    hero: {
        headline: string;
        subline: string;
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
const MOCK_SITE_SETTINGS: SiteSettings = {
    id: 'rec_sitesettings',
    siteTitle: 'Inioluwa Oladipupo',
    hero: {
        headline: 'Inioluwa Oladipupo',
        subline: 'Architecture Student · Web3 Developer · Founder, IO Studio (est. 2025)',
        tagline: 'Shaping space. Building code. Empowering communities.',
        intro: "I'm an architecture student and Web3 developer exploring the intersection of design, technology, and community. Through IO Studio, my personal creative lab, I document experiments, build projects, and share ideas that combine architectural thinking with decentralized systems."
    },
    footer: {
        text: '© 2024 IO Studio. All Rights Reserved.',
        socialLinks: [
            { name: 'Email', href: 'mailto:inioluwaoladipupostudio@gmail.com' },
            { name: 'LinkedIn', href: 'https://linkedin.com' },
            { name: 'Twitter', href: 'https://twitter.com/inioluwa_xyz' },
            { name: 'Substack', href: 'https://substack.com' },
        ]
    }
};

const MOCK_ABOUT_CONTENT: AboutContent = {
    id: 'rec_about',
    headline: 'About Me',
    shortText: 'I’m an architecture student and Web3 developer exploring the intersection of design, technology, and community. Through IO Studio, my personal creative lab, I document experiments, build projects, and share ideas that combine architectural thinking with decentralized systems.',
    fullText: [
        "I’m an architecture student and Web3 developer exploring the intersection of design, technology, and community.",
        "Through IO Studio, my personal creative lab, I document experiments, build projects, and share ideas that combine architectural thinking with decentralized systems.",
        "I believe in futures that are sustainable, equitable, and rooted in culture — whether through climate-responsive buildings or community-driven digital platforms."
    ],
    highlights: [],
    profileImageId: 'about-portrait'
};

const MOCK_CONTACT_CONTENT: ContactContent = {
    id: 'rec_contact',
    introText: 'Let’s connect.',
    ctaLine: 'I’m always open to conversations, collaborations, and opportunities around architecture, technology, and community building.'
}

const MOCK_SKILLS: SkillCategory[] = [
    {
      category: 'Architecture Projects',
      icon: DraftingCompass,
      items: [
        'Academic + conceptual projects exploring form, culture, and sustainability.',
        'Designs rooted in Lagos, rethinking living, learning, and community spaces.',
      ],
    },
    {
      category: 'Web3 + Code Projects',
      icon: CodeXml,
      items: [
        'Smart contracts in Solidity.',
        'Frontend experiments with React + Ethers.js.',
        'Decentralized learning platforms and proof-of-skill ideas.',
      ],
    },
    {
      category: 'Crossovers',
      icon: BrainCircuit,
      items: [
        'Where drawings meet code.',
        'From digital-first design workflows to merging BIM with blockchain experiments.',
      ],
    },
];

const MOCK_CV_EXPERIENCE: CVItem[] = [
    { id: 'exp1', date: '2023 - Present', title: 'Founder', subtitle: 'IO Studio', description: 'Personal creative lab for projects at the intersection of architecture, code, and community.' },
    { id: 'exp2', date: 'Ongoing', title: '0x120 Days of Web3 Dev Challenge', subtitle: 'Self-Directed', description: 'A public learning journey documenting my progress in Web3 development.' },
    { id: 'exp3', date: 'Ongoing', title: '148-day Architecture + Revit Learning Journey', subtitle: 'Self-Directed', description: 'Intensive study and practice in architectural software and principles.' },
];

const MOCK_CV_EDUCATION: CVItem[] = [
    { id: 'edu1', date: '2020 - 2025', title: 'Master of Architecture (Expected)', subtitle: 'University of Digital Futures', description: 'Focusing on computational design and sustainable urbanism.' },
];

// Helper to create a slug from a URL
const createSlugFromLink = (link: string): string => {
    try {
        const url = new URL(link);
        const pathParts = url.pathname.split('/');
        // Get the last part of the path, which is usually the post slug
        return pathParts[pathParts.length - 1] || 'post';
    } catch (e) {
        // Fallback for invalid URLs
        return 'post' + Math.random().toString(36).substring(7);
    }
}


function mapFeedItemToJournalPost(item: FeedItem, index: number): JournalPost {
    const description = item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : 'No description available.';
    return {
        id: item.link,
        title: item.title,
        link: item.link,
        description: description,
        category: item.categories?.[0] || 'General',
        tags: item.categories || [],
        imageId: `journal-${(index % 3) + 1}`,
    };
}

function mapFeedItemToProject(item: FeedItem, index: number): Project {
    const description = item.contentSnippet ? item.contentSnippet.substring(0, 150) + '...' : 'No description available.';
    return {
        id: item.link,
        slug: createSlugFromLink(item.link),
        title: item.title,
        link: item.link,
        description: description,
        category: 'General',
        tags: item.categories || [],
        imageId: `project-${(index % 3) + 1}`,
        content: item.content || '',
    };
}

const FEED_URL = 'https://iodesignstudio.substack.com/feed';

async function getProjects(): Promise<Project[]> {
    const feedItems = await fetchRSSFeed(FEED_URL);
    return feedItems.map(mapFeedItemToProject);
}


async function getJournalPostsFromRss(): Promise<JournalPost[]> {
    const feedItems = await fetchRSSFeed(FEED_URL);
    return feedItems.map(mapFeedItemToJournalPost);
}

// "Database" object with functions to fetch data on the server
export const db = {
    getSiteSettings: async (): Promise<SiteSettings> => MOCK_SITE_SETTINGS,
    getAboutContent: async (): Promise<AboutContent> => MOCK_ABOUT_CONTENT,
    getContactContent: async (): Promise<ContactContent> => MOCK_CONTACT_CONTENT,
    getProjects: getProjects,
    getJournalPosts: getJournalPostsFromRss,
    // Note: getProjectPosts is deprecated, use getProjects
    getProjectPosts: async (): Promise<JournalPost[]> => {
        console.warn("getProjectPosts is deprecated, use getProjects which returns Project[] type");
        const projects = await getProjects();
        // This is a temporary adapter. You should update the call sites.
        return projects.map(p => ({...p, category: p.category}));
    },
    getGroupedSkills: async (): Promise<SkillCategory[]> => MOCK_SKILLS,
    getCVExperience: async (): Promise<CVItem[]> => MOCK_CV_EXPERIENCE,
    getCVEducation: async (): Promise<CVItem[]> => MOCK_CV_EDUCATION,
};
