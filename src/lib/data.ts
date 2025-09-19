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
    getSiteSettings: fetchSiteSettings,
    getAboutContent: fetchAboutContent,
    getContactContent: fetchContactContent,
    getProjects: fetchProjects,
    getJournalPosts: fetchJournalPosts,
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
    getCVExperience: fetchExperience,
    getCVEducation: fetchEducation,
};
