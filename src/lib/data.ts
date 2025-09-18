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

const siteSettings = await fetchSiteSettings();
const aboutContent = await fetchAboutContent();
const contactContent = await fetchContactContent();
const projects = await fetchProjects();
const journalPosts = await fetchJournalPosts();
const skills = await fetchSkills();
const cvExperience = await fetchExperience();
const cvEducation = await fetchEducation();


// Replace imported icons with actual components
const iconMap = {
    'Architecture & Design': DraftingCompass,
    'Web3 & Development': CodeXml,
    'Writing & Community': Users
} as const;

const mappedSkills = skills.map(skill => ({
    ...skill,
    icon: iconMap[skill.category as keyof typeof iconMap] || Users,
}));


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
        all: () => mappedSkills,
    },
    cv: {
        experience: () => cvExperience,
        education: () => cvEducation,
    }
}
