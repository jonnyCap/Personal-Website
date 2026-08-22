#!/usr/bin/env node
/**
 * fetch-github-repos.js
 * Automatically fetches public GitHub repositories and language stats for jonnyCap,
 * merges with data/projectConfig.json, and writes data/projects.json.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'data', 'projectConfig.json');
const OUTPUT_PATH = path.join(ROOT_DIR, 'data', 'projects.json');

const DEFAULT_CONFIG = {
    username: 'jonnyCap',
    pinned: [
        'QueueGo',
        'Blink',
        'LLM-based-Assessment-of-Software-Project-Ideas',
        'AIR-Project',
        'BI---Data-Analytics',
        'Personal-Website',
        'Team-Creator'
    ],
    hide: [],
    overrides: {}
};

// Language color mapping for visual language bars
const LANGUAGE_COLORS = {
    'Go': '#00ADD8',
    'Python': '#3572A5',
    'Jupyter Notebook': '#DA5B0B',
    'JavaScript': '#F1E05A',
    'Java': '#B07219',
    'HTML': '#E34C26',
    'CSS': '#563D7C',
    'TypeScript': '#3178C6',
    'C++': '#F34B7D',
    'C': '#555555',
    'Rust': '#DEA584',
    'Shell': '#89E051'
};

async function fetchJson(url, headers = {}) {
    const defaultHeaders = {
        'User-Agent': 'Personal-Website-Repo-Fetcher',
        'Accept': 'application/vnd.github.v3+json'
    };
    if (process.env.GITHUB_TOKEN) {
        defaultHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers: { ...defaultHeaders, ...headers } });
    if (!response.ok) {
        throw new Error(`GitHub API error ${response.status}: ${response.statusText} (${url})`);
    }
    return response.json();
}

async function main() {
    console.log('--- Starting GitHub Repositories Fetch ---');

    let config = DEFAULT_CONFIG;
    if (fs.existsSync(CONFIG_PATH)) {
        try {
            const rawConfig = fs.readFileSync(CONFIG_PATH, 'utf8');
            config = { ...DEFAULT_CONFIG, ...JSON.parse(rawConfig) };
            console.log(`Loaded configuration from ${CONFIG_PATH}`);
        } catch (e) {
            console.warn(`Warning: Failed to parse ${CONFIG_PATH}, using defaults.`, e.message);
        }
    }

    const username = config.username || 'jonnyCap';
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;

    let rawRepos = [];
    try {
        console.log(`Fetching public repositories for ${username}...`);
        rawRepos = await fetchJson(reposUrl);
        console.log(`Successfully fetched ${rawRepos.length} repositories from GitHub.`);
    } catch (err) {
        console.error('Failed to fetch from GitHub API:', err.message);
        if (fs.existsSync(OUTPUT_PATH)) {
            console.log('Retaining existing projects.json due to API fetch failure.');
            process.exit(0);
        } else {
            console.error('No existing projects.json found. Exiting with error.');
            process.exit(1);
        }
    }

    const processedProjects = [];

    for (const repo of rawRepos) {
        // Skip hidden repos, forks, or disabled repos unless explicitly configured
        if (config.hide && config.hide.includes(repo.name)) continue;
        if (repo.fork && (!config.pinned || !config.pinned.includes(repo.name))) continue;

        const override = (config.overrides && config.overrides[repo.name]) || {};

        // Fetch language breakdown
        let languages = {};
        try {
            if (repo.languages_url) {
                languages = await fetchJson(repo.languages_url);
            }
        } catch (e) {
            console.warn(`Could not fetch languages for ${repo.name}: ${e.message}`);
        }

        // Calculate language percentages
        const totalBytes = Object.values(languages).reduce((sum, b) => sum + b, 0);
        const languageStats = Object.entries(languages).map(([lang, bytes]) => {
            const percentage = totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0;
            return {
                name: lang,
                bytes,
                percentage,
                color: LANGUAGE_COLORS[lang] || '#88badd'
            };
        }).filter(l => l.percentage >= 1.0); // Only keep languages with >= 1%

        // Format dates
        const updatedAt = repo.pushed_at || repo.updated_at;
        const formattedDate = updatedAt ? new Date(updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        }) : '';

        // Combine topics from GitHub and config overrides
        const topics = Array.from(new Set([
            ...(repo.topics || []),
            ...(override.tags || [])
        ]));

        processedProjects.push({
            id: repo.name,
            name: repo.name,
            title: override.displayTitle || repo.name.replace(/[-_]/g, ' '),
            subtitle: override.subtitle || repo.language || 'Software Project',
            description: override.customDescription || repo.description || 'Explore the source code on GitHub.',
            githubUrl: repo.html_url,
            homepageUrl: repo.homepage || null,
            primaryLanguage: repo.language || (languageStats[0] ? languageStats[0].name : 'Code'),
            primaryLanguageColor: LANGUAGE_COLORS[repo.language] || '#549bcf',
            languageStats: languageStats.length > 0 ? languageStats : (repo.language ? [{
                name: repo.language,
                percentage: 100,
                color: LANGUAGE_COLORS[repo.language] || '#549bcf'
            }] : []),
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            openIssues: repo.open_issues_count || 0,
            updatedAt: formattedDate,
            rawUpdatedAt: updatedAt,
            tags: topics.slice(0, 5),
            featured: override.featured || false,
            isArchived: repo.archived || false
        });
    }

    // Sort projects: Pinned list in exact specified order, followed by remainder sorted by updated date
    const pinnedOrder = config.pinned || [];
    processedProjects.sort((a, b) => {
        const pinA = pinnedOrder.indexOf(a.name);
        const pinB = pinnedOrder.indexOf(b.name);

        if (pinA !== -1 && pinB !== -1) return pinA - pinB;
        if (pinA !== -1) return -1;
        if (pinB !== -1) return 1;

        return new Date(b.rawUpdatedAt).getTime() - new Date(a.rawUpdatedAt).getTime();
    });

    const outputPayload = {
        lastUpdated: new Date().toISOString(),
        username: username,
        totalProjects: processedProjects.length,
        projects: processedProjects
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputPayload, null, 2), 'utf8');
    console.log(`Successfully generated ${OUTPUT_PATH} with ${processedProjects.length} projects.`);
    console.log('--- Fetch Complete ---');
}

main().catch(err => {
    console.error('Fatal error running fetchGitHubRepos:', err);
    process.exit(1);
});
