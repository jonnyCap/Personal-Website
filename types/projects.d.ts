/**
 * Type definitions for projects data and synchronization configurations.
 */

export interface LanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface ProjectOverride {
  displayTitle?: string;
  subtitle?: string;
  customDescription?: string;
  tags?: string[];
  featured?: boolean;
}

export interface ProjectConfig {
  username: string;
  pinned: string[];
  hide: string[];
  overrides: Record<string, ProjectOverride>;
}

export interface Project {
  id: number;
  name: string;
  displayTitle: string;
  subtitle: string;
  description: string;
  customDescription: string;
  url: string;
  homepage: string;
  language: string;
  languageStats: LanguageStat[];
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
  rawUpdatedAt: string;
  tags: string[];
  featured: boolean;
  isArchived: boolean;
}

export interface ProjectsData {
  lastUpdated: string;
  totalCount: number;
  projects: Project[];
}

export interface GitHubApiRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  visibility?: string;
  topics?: string[];
}
