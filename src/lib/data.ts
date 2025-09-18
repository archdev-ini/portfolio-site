import { DraftingCompass, CodeXml, Users, type LucideIcon } from 'lucide-react';
import { fetchProjects, fetchJournalPosts, fetchSkills, fetchExperience, fetchEducation, fetchSiteSettings, fetchAboutContent, fetchContactContent } from './airtable';


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

export type Skill = {
    name: string;
    category: string;
}

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

export type SocialLink = {
    name: string;
    href: string;
}

export type SiteSettings = {
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
    headline: string;
    shortText: string;
    fullText: string[];
    highlights: Array<{ title: string, description: string }>;
    profileImageId: string;
}

export type ContactContent = {
    introText: string;
    ctaLine: string;
}

// "Database" object with functions to fetch data on the server
export const db = {
    getSiteSettings: async () => {
        try {
            return await fetchSiteSettings();
        } catch (e) {
            console.error("Error fetching site settings:", e);
            return { siteTitle: "Inioluwa.xyz", hero: { headline: 'Error', tagline: 'Error', intro: 'Could not load content.'}, footer: { text: '', socialLinks: [] } };
        }
    },
    getAboutContent: async () => {
        try {
            return await fetchAboutContent();
        } catch (e) {
            console.error("Error fetching about content:", e);
            return { headline: 'Error', shortText: 'Could not load content.', fullText: [], highlights: [], profileImageId: '' };
        }
    },
    getContactContent: async () => {
        try {
            return await fetchContactContent();
        } catch (e) {
            console.error("Error fetching contact content:", e);
            return { introText: 'Error', ctaLine: 'Could not load content.' };
        }
    },
    getProjects: async () => {
        try {
            return await fetchProjects();
        } catch (e) {
            console.error("Error fetching projects:", e);
            return [];
        }
    },
    getJournalPosts: async () => {
        try {
            return await fetchJournalPosts();
        } catch (e) {
            console.error("Error fetching journal posts:", e);
            return [];
        }
    },
    getSkills: async (): Promise<SkillCategory[]> => {
        try {
            const skills = await fetchSkills();
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
    getCVExperience: async () => {
        try {
            return await fetchExperience();
        } catch (e) {
            console.error("Error fetching CV experience:", e);
            return [];
        }
    },
    getCVEducation: async () => {
        try {
            return await fetchEducation();
        } catch (e) {
            console.error("Error fetching CV education:", e);
            return [];
        }
    },
};
