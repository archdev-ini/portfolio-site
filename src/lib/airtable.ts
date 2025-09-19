import Airtable, { type FieldSet, type Records } from 'airtable';
import type { Project, JournalPost, SkillCategory, CVItem, SiteSettings, AboutContent, ContactContent } from './data';

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Airtable API Key or Base ID is not defined in environment variables');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const getRecords = async <T extends FieldSet>(tableName: string): Promise<Records<T>> => {
    try {
        const records = await base(tableName).select().all();
        return records as Records<T>;
    } catch (err: any) {
        console.warn(`[Airtable] Warning: Could not fetch records from table "${tableName}". It might be missing, misnamed, or the API key may be invalid. The app will proceed with empty data for this section. Error: ${err.message}`);
        return []; // Resolve with an empty array on error to prevent crashing
    }
};

const updateRecord = async (tableName: string, recordId: string, fields: { [key: string]: any }) => {
    try {
        const updatedRecords = await base(tableName).update([{ id: recordId, fields }]);
        return updatedRecords[0];
    } catch (err: any) {
        console.error(`[Airtable] Error updating record in table "${tableName}": ${err.message}`);
        throw err;
    }
};


// Mapper Functions
const mapToProject = (record: any): Project => ({
  id: record.id,
  slug: record.fields['slug'],
  title: record.fields['title'],
  category: record.fields.category || 'Community',
  description: record.fields.description,
  imageId: record.fields.imageId || 'project-arch-1',
  galleryImageIds: record.fields.galleryImageIds ? record.fields.galleryImageIds.split(',') : [],
  link: record.fields.link || '#',
  role: record.fields.role || 'N/A',
  duration: record.fields.duration || 'N/A',
  technologies: record.fields.technologies ? record.fields.technologies.split(',') : [],
  overview: record.fields.overview,
  process: record.fields.process,
  outcomes: record.fields.outcomes,
  featured: record.fields.featured || false,
});

const mapToJournalPost = (record: any): JournalPost => ({
  id: record.id,
  title: record.fields.title,
  category: record.fields.category || 'Reflections',
  description: record.fields.description,
  imageId: record.fields.imageId || 'journal-1',
  link: record.fields.link || '#',
});

const mapToSkillCategory = (records: any[]): SkillCategory[] => {
    const skillMap: { [key: string]: any } = {};

    records.forEach(record => {
        const category = record.fields.category || 'General';
        if (!skillMap[category]) {
            skillMap[category] = { category, items: [] };
        }
        skillMap[category].items.push(record.fields['name']);
    });

    const categoryOrder = ['Architecture & Design', 'Web3 & Development', 'Writing & Community'];
    return Object.values(skillMap).sort((a: any, b: any) => {
        const indexA = categoryOrder.indexOf(a.category);
        const indexB = categoryOrder.indexOf(b.category);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
}


const mapToCVItem = (record: any): CVItem => ({
  id: record.id,
  date: record.fields.date,
  title: record.fields.title,
  subtitle: record.fields.subtitle,
  description: record.fields.description,
});

const mapToEducationItem = (record: any): CVItem => ({
    id: record.id,
    date: record.fields.date,
    title: record.fields.title,
    subtitle: record.fields.subtitle,
    description: record.fields.description,
});


// Fetch Functions
export const fetchProjects = async (): Promise<Project[]> => {
  const records = await getRecords('Projects');
  return records.map(mapToProject);
};

export const fetchJournalPosts = async (): Promise<JournalPost[]> => {
  const records = await getRecords('Journal');
  return records.map(mapToJournalPost).sort((a,b) => b.id.localeCompare(a.id));
};

export const fetchSkills = async (): Promise<any[]> => {
    const records = await getRecords('Skills');
    return mapToSkillCategory(records);
};

export const fetchExperience = async (): Promise<CVItem[]> => {
    const records = await getRecords('CV_Experience');
    return records.map(mapToCVItem);
}

export const fetchEducation = async (): Promise<CVItem[]> => {
    const records = await getRecords('CV_Education');
    return records.map(mapToEducationItem);
}

export const fetchSiteSettings = async (): Promise<any> => {
    const records = await getRecords('SiteSettings');
    const settings = records[0];
    if (!settings) {
        console.warn("[Airtable] No record found in 'SiteSettings' table. Using fallback data.");
        return { id: null, hero: { headline: '', tagline: '', intro: '' }, footer: { socialLinks: [] } };
    }
    return {
        id: settings.id,
        siteTitle: settings.fields.siteTitle,
        hero: {
            headline: settings.fields.heroHeadline,
            tagline: settings.fields.heroTagline,
            intro: settings.fields.heroIntro,
        },
        footer: {
            text: settings.fields.footerText,
            socialLinks: [
                { name: 'Github', href: settings.fields.socialGithub },
                { name: 'Twitter', href: settings.fields.socialTwitter },
                { name: 'LinkedIn', href: settings.fields.socialLinkedIn },
                { name: 'Substack', href: settings.fields.socialSubstack },
                { name: 'Email', href: settings.fields.socialEmail ? `mailto:${settings.fields.socialEmail}` : '' },
            ].filter(link => link.href)
        }
    };
}

export const updateSiteSettings = async (id: string, data: Partial<SiteSettings>) => {
    const fieldsToUpdate: { [key: string]: any } = {};

    if (data.siteTitle) fieldsToUpdate.siteTitle = data.siteTitle;
    if (data.hero?.headline) fieldsToUpdate.heroHeadline = data.hero.headline;
    if (data.hero?.tagline) fieldsToUpdate.heroTagline = data.hero.tagline;
    if (data.hero?.intro) fieldsToUpdate.heroIntro = data.hero.intro;
    if (data.footer?.text) fieldsToUpdate.footerText = data.footer.text;
    
    if (data.footer?.socialLinks) {
        data.footer.socialLinks.forEach(link => {
            if (link.name === 'Github') fieldsToUpdate.socialGithub = link.href;
            if (link.name === 'Twitter') fieldsToUpdate.socialTwitter = link.href;
            if (link.name === 'LinkedIn') fieldsToUpdate.socialLinkedIn = link.href;
            if (link.name === 'Substack') fieldsToUpdate.socialSubstack = link.href;
            if (link.name === 'Email') fieldsToUpdate.socialEmail = link.href.replace('mailto:', '');
        });
    }

    return await updateRecord('SiteSettings', id, fieldsToUpdate);
};


export const fetchAboutContent = async (): Promise<any> => {
    const records = await getRecords('About');
    const record = records[0];
     if (!record || !record.fields) {
        console.warn("[Airtable] No record found in 'About' table. Using fallback data.");
        return { id: null, fullText: [], highlights: [] };
    }
    const content = record.fields;
    return {
        id: record.id,
        headline: content.headline,
        shortText: content.shortText,
        fullText: content.fullText ? content.fullText.split('\n') : [],
        highlights: [
            { title: 'Architecture', description: content.highlightArchitecture },
            { title: 'Web3 / Development', description: content.highlightWeb3 },
            { title: 'Writing', description: content.highlightWriting },
            { title: 'Community', description: content.highlightCommunity },
        ].filter(h => h.description),
        profileImageId: content.profileImageId
    };
}

export const fetchContactContent = async (): Promise<any> => {
    const records = await getRecords('Contact');
    const record = records[0];
    if (!record || !record.fields) {
        console.warn("[Airtable] No record found in 'Contact' table. Using fallback data.");
        return { id: null, introText: 'Get in Touch', ctaLine: 'Have a project in mind or want to connect? I’d love to hear from you.' };
    }
    return {
        id: record.id,
        introText: record.fields.introText,
        ctaLine: record.fields.ctaLine,
    };
}
