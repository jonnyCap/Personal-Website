/**
 * Type definitions for structured CV and resume data.
 */

export interface CvExperience {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  period: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  honors?: string;
  grade?: string;
}

export interface CvEducation {
  id: string;
  degree: string;
  field: string;
  institution: string;
  period: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  honors?: string;
  grade?: string;
}

export type CvItem = CvExperience | CvEducation;

export interface CvData {
  lastUpdated: string;
  experience: CvExperience[];
  education: CvEducation[];
}
