
'use server';

import {
  automatedEntityEnrichment
} from '@/ai/flows/automated-entity-enrichment';
import {
  updateJobStatus,
  logToJob,
  getNextUrlFromQueue,
  updateUrlStatus,
  addUrlToQueue,
  storeEntities,
} from '@/lib/db';
import { scrapeWebPage } from './scraping-service';

interface JobOptions {
  cookies?: string;
  maxDepth?: number;
  maxLinks?: number;
}

/**
 * Executes a full bot job.
 * This function orchestrates the process of crawling, analyzing, and storing data.
 * @param jobId The ID of the job to run.
 * @param options Job execution options.
 */
export async function runJob(jobId: string, options: JobOptions = {}) {
  const { cookies, maxDepth = 2, maxLinks = 10 } = options;

  try {
    await updateJobStatus(jobId, 'RUNNING');
    await logToJob(jobId, 'INFO', `Job started. Max depth: ${maxDepth}, max links per page: ${maxLinks}.`);

    let nextUrlToProcess = await getNextUrlFromQueue(jobId);

    while (nextUrlToProcess) {
      const { id: urlId, url, depth } = nextUrlToProcess;

      if (depth >= maxDepth) {
        await logToJob(jobId, 'WARN', `Skipping URL due to max depth limit: ${url}`);
        await updateUrlStatus(urlId, 'PROCESSED');
        nextUrlToProcess = await getNextUrlFromQueue(jobId);
        continue;
      }
      
      try {
        await logToJob(jobId, 'INFO', `Processing URL: ${url} (Depth: ${depth})`);
        
        // 1. Scrape the web page
        await logToJob(jobId, 'INFO', `Scraping content from ${url}...`);
        const scrapedText = await scrapeWebPage(url, cookies);

        if (!scrapedText || scrapedText.length < 100) {
          throw new Error(`No meaningful content found or scraping failed. (Content length: ${scrapedText?.length || 0})`);
        }
        await logToJob(jobId, 'INFO', `Scraped ${scrapedText.length} characters.`);

        // 2. Analyze with Genkit AI
        await logToJob(jobId, 'INFO', 'Analyzing content for entities and links...');
        const enrichmentOutput = await automatedEntityEnrichment({ text: scrapedText });
        const { entities } = enrichmentOutput;
        await logToJob(jobId, 'INFO', `AI analysis complete. Found ${entities.length} entities.`);
        
        // 3. Store extracted entities
        if (entities.length > 0) {
            await storeEntities(jobId, entities, url);
            await logToJob(jobId, 'INFO', `Successfully stored ${entities.length} entities in the database.`);
        }

        // 4. Find new links and add to queue
        const allDiscoveredLinks = entities.flatMap(e => e.relatedLinks || []);
        const uniqueLinks = [...new Set(allDiscoveredLinks)];

        if(uniqueLinks.length > 0) {
            await logToJob(jobId, 'INFO', `Discovered ${uniqueLinks.length} potential new links to explore.`);
            let linksAdded = 0;
            for (const link of uniqueLinks) {
                if(linksAdded >= maxLinks) {
                    await logToJob(jobId, 'WARN', `Reached max link limit for this page. Not adding more URLs.`);
                    break;
                }
                // Basic validation of link
                if (link.startsWith('http')) {
                    await addUrlToQueue(jobId, link, depth + 1);
                    linksAdded++;
                }
            }
        }
        
        await updateUrlStatus(urlId, 'PROCESSED');

      } catch (error: any) {
        await logToJob(jobId, 'ERROR', `Failed to process URL ${url}: ${error.message}`);
        await updateUrlStatus(urlId, 'FAILED');
      }

      // Get the next URL to process from the queue
      nextUrlToProcess = await getNextUrlFromQueue(jobId);
    }

    await updateJobStatus(jobId, 'COMPLETED');
    await logToJob(jobId, 'INFO', 'Job completed: No more URLs in the queue.');
  } catch (error: any) {
    console.error(`[JOB_RUNNER_ERROR] Critical error in job ${jobId}:`, error);
    await logToJob(jobId, 'ERROR', `Critical job failure: ${error.message}`);
    await updateJobStatus(jobId, 'FAILED');
  }
}
