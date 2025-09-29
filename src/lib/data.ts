import { DraftingCompass, CodeXml, Users, type LucideIcon } from 'lucide-react';
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
        category: item.categories?.[0] || 'Uncategorized',
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
        category: item.categories?.find(cat => ['Architecture', 'Web3', 'Writing', 'Community'].includes(cat)) || 'General',
        tags: item.categories || [],
        imageId: `project-${(index % 3) + 1}`,
        content: item.content || '',
        // featured: item.categories?.includes('Featured') // Example of how featured could work
    };
}


async function getProjects(): Promise<Project[]> {
    const feedUrl = process.env.SUBSTACK_URL;
    if (!feedUrl) return [];

    const feedItems = await fetchRSSFeed(feedUrl);
    
    const projectTags = ['Project Journal', 'Design Sketches'];

    return feedItems
        .filter(item => item.categories?.some(cat => projectTags.includes(cat)))
        .map(mapFeedItemToProject);
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
