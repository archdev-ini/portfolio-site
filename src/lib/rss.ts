import Parser from 'rss-parser';
import { parse } from 'node-html-parser';

type FeedItem = {
    title: string;
    link: string;
    pubDate?: string;
    content?: string;
    contentSnippet?: string;
};

// Add a cache to avoid re-fetching the RSS feed on every request during development
let feedCache: FeedItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function fetchRSSFeed(feedUrl: string): Promise<FeedItem[]> {
    if (feedCache && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
        return feedCache;
    }

    if (!feedUrl) {
        console.warn('SUBSTACK_URL is not defined. Skipping RSS feed fetch.');
        return [];
    }
    
    try {
        const parser = new Parser();
        const feed = await parser.parseURL(feedUrl);
        
        const items = feed.items.map(item => {
            // Extract text from the HTML content to pass to the AI
            const root = parse(item['content:encoded'] || '');
            const textContent = root.structuredText;

            return {
                title: item.title || 'Untitled Post',
                link: item.link || '#',
                pubDate: item.pubDate,
                content: textContent,
                contentSnippet: item.contentSnippet,
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
