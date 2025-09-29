import Parser from 'rss-parser';
import { parse } from 'node-html-parser';

export type FeedItem = {
    title: string;
    link: string;
    pubDate?: string;
    content?: string;
    contentSnippet?: string;
    categories?: string[];
};

// Add a cache to avoid re-fetching the RSS feed on every request during development
let feedCache: FeedItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function fetchRSSFeed(feedUrl: string): Promise<FeedItem[]> {
    if (feedCache && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
        return feedCache;
    }

    if (!feedUrl || feedUrl.includes('your-substack-url.com')) {
        console.warn('SUBSTACK_URL is not defined or is a placeholder. Skipping RSS feed fetch.');
        return [];
    }
    
    try {
        const parser = new Parser({
            customFields: {
                item: ['category'],
            }
        });
        const feed = await parser.parseURL(feedUrl);
        
        const items = feed.items.map(item => {
            const root = parse(item['content:encoded'] || '');
            const textContent = root.structuredText;

            // Ensure categories are always an array of strings
            let categories: string[] = [];
            if (Array.isArray(item.category)) {
                categories = item.category.map(c => (typeof c === 'string' ? c : ''));
            } else if (typeof item.category === 'string') {
                categories = [item.category];
            }

            return {
                title: item.title || 'Untitled Post',
                link: item.link || '#',
                pubDate: item.pubDate,
                content: textContent,
                contentSnippet: item['content:encodedSnippet'] || item.contentSnippet,
                categories,
            };
        });
        
        feedCache = items;
        cacheTimestamp = Date.now();

        return items;

    } catch (error) {
        console.error('Failed to fetch or parse RSS feed:', error);
        return [];
    }
}
