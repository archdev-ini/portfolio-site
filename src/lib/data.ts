import { DraftingCompass, CodeXml, Users, type LucideIcon } from 'lucide-react';
import { fetchProjects, fetchAllSkills, fetchExperience, fetchEducation, fetchSiteSettings, fetchAboutContent, fetchContactContent, fetchGroupedSkills, deleteJournalPost, updateJournalPost, createJournalPost } from './airtable';
import { fetchRSSFeed } from './rss';
import { summarizePost } from '@/ai/flows/summarize-post-flow';

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
  category: 'Reflections' | 'Experiments' | 'Design Notes';
  description: string;
  imageId: string;
  link: string;
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

async function getJournalPostsFromRss(): Promise<JournalPost[]> {
    const feedItems = await fetchRSSFeed(process.env.SUBSTACK_URL || '');
    
    const journalPosts = await Promise.all(feedItems.map(async (item, index) => {
        // Use AI to get a summary and category
        const { description, category } = await summarizePost({ content: item.content || '' });
        
        return {
            id: item.link,
            title: item.title,
            link: item.link,
            description: description,
            category: category,
            // Cycle through placeholder images
            imageId: `journal-${(index % 3) + 1}`,
        };
    }));

    return journalPosts;
}


// "Database" object with functions to fetch data on the server
export const db = {
    getSiteSettings: fetchSiteSettings,
    getAboutContent: fetchAboutContent,
    getContactContent: fetchContactContent,
    getProjects: fetchProjects,
    getJournalPosts: getJournalPostsFromRss,
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
