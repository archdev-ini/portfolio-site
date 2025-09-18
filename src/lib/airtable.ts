import Airtable, { type FieldSet, type Records } from 'airtable';
import type { Project, JournalPost, SkillCategory, CVItem, SiteSettings, AboutContent, ContactContent } from './data';

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Airtable API Key or Base ID is not defined in environment variables');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const getRecords = async <T extends FieldSet>(tableName: string): Promise<Records<T>> => {
  return new Promise((resolve) => {
    const allRecords: Records<T> = [];
    base(tableName)
      .select({
        // Add any default select options here, e.g., sorting
      })
      .eachPage(
        (records, fetchNextPage) => {
          allRecords.push(...records);
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.warn(`[Airtable] Warning: Could not fetch records from table "${tableName}". It might be missing or misnamed. The app will proceed with empty data for this section. Error: ${err.message}`);
            resolve([]); // Resolve with an empty array on error
            return;
          }
          resolve(allRecords);
        }
      );
  });
};


const getRecord = async <T extends FieldSet>(tableName: string, recordId: string): Promise<T | null> => {
    try {
        const record = await base(tableName).find(recordId);
        return record.fields as T;
    } catch(err: any) {
        console.warn(`[Airtable] Warning: Could not fetch record "${recordId}" from table "${tableName}". It might be missing. Error: ${err.message}`);
        return null;
    }
}


// Mapper Functions
const mapToProject = (record: any): Project => ({
  id: record.id,
  slug: record.fields.slug,
  title: record.fields.title,
  category: record.fields.category,
  description: record.fields.description,
  imageId: record.fields.imageId,
  galleryImageIds: record.fields.galleryImageIds ? record.fields.galleryImageIds.split(',') : [],
  link: record.fields.link || '#',
  role: record.fields.role,
  duration: record.fields.duration,
  technologies: record.fields.technologies ? record.fields.technologies.split(',') : [],
  overview: record.fields.overview,
  process: record.fields.process,
  outcomes: record.fields.outcomes,
  featured: record.fields.featured || false,
});

const mapToJournalPost = (record: any): JournalPost => ({
  id: record.id,
  title: record.fields.title,
  category: record.fields.category,
  description: record.fields.description,
  imageId: record.fields.imageId,
  link: record.fields.link || '#',
});

const mapToSkillCategory = (records: any[]): SkillCategory[] => {
    const skillMap: { [key: string]: SkillCategory } = {};
    const iconMap: { [key: string]: any } = { // You should import your icons here
        'Architecture & Design': 'DraftingCompass',
        'Web3 & Development': 'CodeXml',
        'Writing & Community': 'Users'
    };

    records.forEach(record => {
        const category = record.fields.category;
        if (!skillMap[category]) {
            skillMap[category] = {
                category: category,
                icon: iconMap[category] || 'Users', // default icon
                items: []
            };
        }
        skillMap[category].items.push(record.fields.name);
    });

    return Object.values(skillMap);
}


const mapToCVItem = (record: any): CVItem => ({
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

export const fetchSkills = async (): Promise<SkillCategory[]> => {
    const records = await getRecords('Skills');
    return mapToSkillCategory(records);
};

export const fetchExperience = async (): Promise<CVItem[]> => {
    const records = await getRecords('CV_Experience');
    return records.map(mapToCVItem);
}

export const fetchEducation = async (): Promise<CVItem[]> => {
    const records = await getRecords('CV_Education');
    return records.map(mapToCVItem);
}

export const fetchSiteSettings = async (): Promise<any> => {
    const records = await getRecords('SiteSettings');
    // Assuming single record for site-wide settings
    const settings = records[0]?.fields;
    if (!settings) {
        console.warn("[Airtable] No record found in 'SiteSettings' table. Using fallback data.");
        return { hero: {}, footer: { socialLinks: [] } };
    }
    return {
        siteTitle: settings.siteTitle,
        hero: {
            headline: settings.heroHeadline,
            tagline: settings.heroTagline,
            intro: settings.heroIntro,
        },
        footer: {
            text: settings.footerText,
            socialLinks: [
                { name: 'Github', href: settings.socialGithub },
                { name: 'Twitter', href: settings.socialTwitter },
                { name: 'LinkedIn', href: settings.socialLinkedIn },
                { name: 'Substack', href: settings.socialSubstack },
                { name: 'Email', href: `mailto:${settings.socialEmail}` },
            ]
        }
    };
}


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
        fullText: content.fullText ? content.fullText.split('\\n') : [],
        highlights: [
            { title: 'Architecture', description: content.highlightArchitecture },
            { title: 'Web3 / Development', description: content.highlightWeb3 },
            { title: 'Writing', description: content.highlightWriting },
            { title: 'Community', description: content.highlightCommunity },
        ],
        profileImageId: content.profileImageId
    };
}

export const fetchContactContent = async (): Promise<any> => {
    const records = await getRecords('Contact');
    const content = records[0]?.fields; // Assuming one record
     if (!content) {
        console.warn("[Airtable] No record found in 'Contact' table. Using fallback data.");
        return {};
    }
    return {
        introText: content.introText,
        ctaLine: content.ctaLine,
    };
}
