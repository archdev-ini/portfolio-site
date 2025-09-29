import { DraftingCompass, CodeXml, Users, type LucideIcon } from 'lucide-react';
import { fetchProjects, fetchAllSkills, fetchExperience, fetchEducation, fetchSiteSettings, fetchAboutContent, fetchContactContent, fetchGroupedSkills, deleteJournalPost, updateJournalPost, createJournalPost } from './airtable';
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
    getSiteSettings: fetchSiteSettings,
    getAboutContent: fetchAboutContent,
    getContactContent: fetchContactContent,
    getProjects: fetchProjects,
    getJournalPosts: getJournalPostsFromRss,
    getProjectPosts: getProjectPostsFromRss,
    getGroupedSkills: async (): Promise<SkillCategory[]> => {
        try {
            const skills = await fetchGroupedSkills();
            const iconMap = {
                'Architecture & Design': DraftingCompass,
                'Web3 & Development': CodeXml,
                'Writing & Community': Users
            } as const;
            return skills.map(skill => ({
                ...skill,
                icon: iconMap[skill.category as keyof typeof iconMap] || Users,
            }));
        } catch (e) {
            console.error("Error fetching skills:", e);
            return [];
        }
    },
    getAllSkills: fetchAllSkills,
    getCVExperience: fetchExperience,
    getCVEducation: fetchEducation,
};
