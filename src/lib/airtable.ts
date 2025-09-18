import Airtable, { type FieldSet, type Records } from 'airtable';
import type { Project, JournalPost, SkillCategory, CVItem, SiteSettings, AboutContent, ContactContent } from './data';

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Airtable API Key or Base ID is not defined in environment variables');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

const getRecords = async <T extends FieldSet>(tableName: string): Promise<Records<T>> => {
    return new Promise((resolve, reject) => {
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
              resolve([]); // Resolve with an empty array on error to prevent crashing
              return;
            }
            resolve(allRecords);
          }
        );
    });
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
    const skillMap: { [key: string]: SkillCategory } = {
      'Architecture & Design': { category: 'Architecture & Design', icon: 'DraftingCompass', items: [] },
      'Web3 & Development': { category: 'Web3 & Development', icon: 'CodeXml', items: [] },
      'Writing & Community': { category: 'Writing & Community', icon: 'Users', items: [] },
    };

    records.forEach(record => {
        const categoryArray = record.fields.Category || [];
        const skillName = record.fields['Skill Name'];
        categoryArray.forEach((category: string) => {
          if (skillMap[category]) {
              skillMap[category].items.push(skillName);
          }
        })
    });

    return Object.values(skillMap).filter(cat => cat.items.length > 0);
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
    // Assuming single record for site-wide settings
    const settings = records[0]?.fields;
    if (!settings) {
        console.warn("[Airtable] No record found in 'SiteSettings' table. Using fallback data.");
        return { hero: { headline: '', tagline: '', intro: '' }, footer: { socialLinks: [] } };
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
            ].filter(link => link.href)
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
