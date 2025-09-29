
import Airtable, { type FieldSet, type Records } from 'airtable';
import type { Project, CVItem, SiteSettings, AboutContent, ContactContent, Skill, SkillCategory } from './data';

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Airtable API Key or Base ID is not defined in environment variables');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

const getRecords = async <T extends FieldSet>(tableNameOrId: string): Promise<Records<T>> => {
    try {
        const records = await base(tableNameOrId).select().all();
        return records as Records<T>;
    } catch (err: any) {
        console.warn(`[Airtable] Warning: Could not fetch records from table "${tableNameOrId}". It might be missing, misnamed, or the API key may be invalid. The app will proceed with empty data for this section. Error: ${err.message}`);
        return []; // Resolve with an empty array on error to prevent crashing
    }
};

export const createRecord = async (tableNameOrId: string, fields: { [key: string]: any }) => {
    try {
        const createdRecords = await base(tableNameOrId).create([{ fields }]);
        return createdRecords[0];
    } catch (err: any) {
        console.error(`[Airtable] Error creating record in table "${tableNameOrId}": ${err.message}`);
        throw err;
    }
}

export const updateRecord = async (tableNameOrId: string, recordId: string, fields: { [key: string]: any }) => {
    try {
        // Airtable API expects comma-separated fields to be arrays, so we convert them back
        if (fields.technologies && Array.isArray(fields.technologies)) {
            fields.technologies = fields.technologies.join(',');
        }
       
        const updatedRecords = await base(tableNameOrId).update([{ id: recordId, fields }]);
        return updatedRecords[0];
    } catch (err: any) {
        console.error(`[Airtable] Error updating record in table "${tableNameOrId}": ${err.message}`);
        throw err;
    }
};

export const deleteRecord = async (tableNameOrId: string, recordId: string) => {
    try {
        await base(tableNameOrId).destroy([recordId]);
    } catch (err: any) {
        console.error(`[Airtable] Error deleting record in table "${tableNameOrId}": ${err.message}`);
        throw err;
    }
}


// Mapper Functions
const mapToProject = (record: any): Project => ({
  id: record.id,
  slug: record.fields['slug'],
  title: record.fields['title'],
  category: record.fields.category || 'Community',
  description: record.fields.description,
  imageId: record.fields.imageId?.[0]?.url || null,
  galleryImageIds: record.fields.galleryImageIds?.map((att: any) => att.url) || [],
  link: record.fields.link || '#',
  role: record.fields.role || 'N/A',
  duration: record.fields.duration || 'N/A',
  technologies: record.fields.technologies ? record.fields.technologies.split(',').map((s:string) => s.trim()) : [],
  overview: record.fields.overview,
  process: record.fields.process,
  outcomes: record.fields.outcomes,
  featured: record.fields.featured || false,
});

const mapToGroupedSkills = (records: any[]): SkillCategory[] => {
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

const mapToSkill = (record: any): Skill => ({
    id: record.id,
    name: record.fields['name'],
    category: record.fields.category,
});


const mapToCVItem = (record: any): CVItem => ({
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

export const fetchGroupedSkills = async (): Promise<any[]> => {
    const records = await getRecords('Skills');
    return mapToGroupedSkills(records);
};

export const fetchAllSkills = async (): Promise<Skill[]> => {
    const records = await getRecords('Skills');
    return records.map(mapToSkill);
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
    const records = await getRecords('tblMY4eE8OwgUlpgw'); // SiteSettings
    const settings = records[0];
    if (!settings) {
        console.warn("[Airtable] No record found in 'SiteSettings' table. Using fallback data.");
        return { id: null, hero: { headline: '', tagline: '', intro: '' }, footer: { socialLinks: [] } };
    }
    return {
        id: settings.id,
        siteTitle: settings.fields['fld5rZgC1vvA9lo0w'], // siteTitle
        hero: {
            headline: settings.fields['fldPNj1TaEjE1nnGs'], // heroHeadline
            tagline: settings.fields['fld7xiVvrh9IwQNjW'], // heroTagline
            intro: settings.fields['fldmflpNaA4s7xW3D'], // heroIntro
        },
        footer: {
            text: settings.fields['fldmUOtYEgXpXx57t'], // footerText
            socialLinks: [
                { name: 'Github', href: settings.fields['fldS42ps9Mbs6DK50'] }, // socialGithub
                { name: 'Twitter', href: settings.fields['fldaEJGRTBUvxdjZs'] }, // socialTwitter
                { name: 'LinkedIn', href: settings.fields['fldCNkLcgB26tE8IF'] }, // socialLinkedIn
                { name: 'Substack', href: settings.fields['fldT26ZTkfkbcqJ2d'] }, // socialSubstack
                { name: 'Email', href: settings.fields['fld3VghqIG5dAMJqM'] ? `mailto:${settings.fields['fld3VghqIG5dAMJqM']}` : '' }, // socialEmail
            ].filter(link => link.href)
        }
    };
}

export const updateSiteSettings = async (id: string, data: Partial<SiteSettings>) => {
    const fieldsToUpdate: { [key: string]: any } = {};

    if (data.siteTitle) fieldsToUpdate['fld5rZgC1vvA9lo0w'] = data.siteTitle;
    if (data.hero?.headline) fieldsToUpdate['fldPNj1TaEjE1nnGs'] = data.hero.headline;
    if (data.hero?.tagline) fieldsToUpdate['fld7xiVvrh9IwQNjW'] = data.hero.tagline;
    if (data.hero?.intro) fieldsToUpdate['fldmflpNaA4s7xW3D'] = data.hero.intro;
    if (data.footer?.text) fieldsToUpdate['fldmUOtYEgXpXx57t'] = data.footer.text;
    
    if (data.footer?.socialLinks) {
        data.footer.socialLinks.forEach(link => {
            if (link.name === 'Github') fieldsToUpdate['fldS42ps9Mbs6DK50'] = link.href;
            if (link.name === 'Twitter') fieldsToUpdate['fldaEJGRTBUvxdjZs'] = link.href;
            if (link.name === 'LinkedIn') fieldsToUpdate['fldCNkLcgB26tE8IF'] = link.href;
            if (link.name === 'Substack') fieldsToUpdate['fldT26ZTkfkbcqJ2d'] = link.href;
            if (link.name === 'Email') fieldsToUpdate['fld3VghqIG5dAMJqM'] = link.href.replace('mailto:', '');
        });
    }

    return await updateRecord('tblMY4eE8OwgUlpgw', id, fieldsToUpdate);
};


export const fetchAboutContent = async (): Promise<any> => {
    const records = await getRecords('tbl8205jtYCQ3bsxE'); // About
    const record = records[0];
     if (!record || !record.fields) {
        console.warn("[Airtable] No record found in 'About' table. Using fallback data.");
        return { id: null, fullText: [], highlights: [] };
    }
    const content = record.fields;
    return {
        id: record.id,
        headline: content['fldQsr8Ep4YtSb4la'], // headline
        shortText: content['fld6Qkpsfki8y52dV'], // shortText
        fullText: content['fldc3q6xSsQE6C1jp'] ? content['fldc3q6xSsQE6C1jp'].split('\\n') : [], // fullText
        highlights: [
            { title: 'Architecture', description: content['fldTOlj7X08mQgt6p'] }, // highlightArchitecture
            { title: 'Web3 / Development', description: content['fld4SaISRNGcf0iX9'] }, // highlightWeb3
            { title: 'Writing', description: content['fldPlm9g41TZSNunF'] }, // highlightWriting
            { title: 'Community', description: content['fldVbF6Jl3a0IeK8v'] }, // highlightCommunity
        ].filter(h => h.description),
        profileImageId: content.profileImageId
    };
}

export const updateAboutContent = async (id: string, data: Partial<AboutContent>) => {
    const fieldsToUpdate: { [key: string]: any } = {};
  
    if (data.headline) fieldsToUpdate['fldQsr8Ep4YtSb4la'] = data.headline;
    if (data.shortText) fieldsToUpdate['fld6Qkpsfki8y52dV'] = data.shortText;
    if (data.fullText) fieldsToUpdate['fldc3q6xSsQE6C1jp'] = data.fullText.join('\\n');
    if (data.profileImageId) fieldsToUpdate.profileImageId = data.profileImageId;
  
    if (data.highlights) {
      data.highlights.forEach(highlight => {
        if (highlight.title === 'Architecture') fieldsToUpdate['fldTOlj7X08mQgt6p'] = highlight.description;
        if (highlight.title === 'Web3 / Development') fieldsToUpdate['fld4SaISRNGcf0iX9'] = highlight.description;
        if (highlight.title === 'Writing') fieldsToUpdate['fldPlm9g41TZSNunF'] = highlight.description;
        if (highlight.title === 'Community') fieldsToUpdate['fldVbF6Jl3a0IeK8v'] = highlight.description;
      });
    }
  
    return await updateRecord('tbl8205jtYCQ3bsxE', id, fieldsToUpdate);
};

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

export const updateContactContent = async (id: string, data: Partial<ContactContent>) => {
    const fieldsToUpdate: { [key: string]: any } = {};
    if (data.introText) fieldsToUpdate.introText = data.introText;
    if (data.ctaLine) fieldsToUpdate.ctaLine = data.ctaLine;
    return await updateRecord('Contact', id, fieldsToUpdate);
};
