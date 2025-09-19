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
  slug: record.fields['Project Name'] ? record.fields['Project Name'].toLowerCase().replace(/\s+/g, '-') : record.id,
  title: record.fields['Project Name'],
  category: record.fields.Tags && record.fields.Tags.length > 0 ? record.fields.Tags[0] : 'Community', // Default or logic
  description: record.fields.Description,
  imageId: `project-arch-1`, // This needs to be mapped from your data
  galleryImageIds: [],
  link: '#',
  role: 'N/A', // Not in new schema
  duration: `${record.fields['Start Date']} - ${record.fields['End Date'] || 'Present'}`,
  technologies: record.fields.Tags || [],
  overview: record.fields.Description,
  process: 'N/A', // Not in new schema
  outcomes: 'N/A', // Not in new schema
  featured: record.fields.Status === 'Completed', // Example logic
});

const mapToJournalPost = (record: any): JournalPost => ({
  id: record.id,
  title: record.fields.Title,
  category: record.fields.Tags && record.fields.Tags.length > 0 ? record.fields.Tags[0] : 'Reflections',
  description: record.fields.Content ? record.fields.Content.substring(0, 100) + '...' : '',
  imageId: 'journal-1', // This needs to be mapped
  link: '#', // Not in new schema
});

const mapToSkillCategory = (records: any[]): SkillCategory[] => {
    const skillMap: { [key: string]: any } = {};

    records.forEach(record => {
        const category = record.fields.Category && record.fields.Category.length > 0 ? record.fields.Category[0] : 'General';
        if (!skillMap[category]) {
            skillMap[category] = { category, items: [] };
        }
        skillMap[category].items.push(record.fields['Skill Name']);
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
  date: `${record.fields['Start Date']} - ${record.fields['End Date'] || 'Present'}`,
  title: record.fields.Position,
  subtitle: record.fields.Company,
  description: record.fields.Description,
});

const mapToEducationItem = (record: any): CVItem => ({
    date: `${record.fields['Start Date']} - ${record.fields['End Date'] || 'Present'}`,
    title: record.fields.Degree,
    subtitle: record.fields.Institution,
    description: record.fields.Description || `Studied ${record.fields['Field of Study']}.`,
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
                { name: 'Email', href: `mailto:${settings.fields.socialEmail}` },
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
    
    // Assuming social links are passed in a flat structure for simplicity in the form
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
    const content = records[0]?.fields; // Assuming one record for about page content
     if (!content) {
        console.warn("[Airtable] No record found in 'About' table. Using fallback data.");
        return { fullText: [], highlights: [] };
    }
    return {
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
    const introRecord = records.find(r => r.fields.Label === 'introText');
    const ctaRecord = records.find(r => r.fields.Label === 'ctaLine');

    return {
        introText: introRecord ? introRecord.fields.Value : 'Get in Touch',
        ctaLine: ctaRecord ? ctaRecord.fields.Value : 'Have a project in mind or want to connect? I’d love to hear from you.',
    };
}
