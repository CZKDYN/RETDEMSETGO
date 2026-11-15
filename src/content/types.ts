export type ContentStatus = 'Draft' | 'For Expert Review' | 'Approved';
export type ActivityKind = 'sequence' | 'errors' | 'quiz';

export interface ProcedureStep {
  id: string;
  instruction: string;
  rationale: string;
  safety: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOption: string;
  explanation: string;
  safety: string;
}

export interface SkillContent {
  objectives: string[];
  introduction: string;
  materials: string[];
  steps: ProcedureStep[];
  demonstration?: { type: 'video' | 'image'; url: string; title: string; transcript: string };
  scenarios: Question[];
  questions: Question[];
  references: { title: string; citation: string; url?: string }[];
}

export interface Skill {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  color: 'teal' | 'blue' | 'violet';
  icon: 'heart' | 'shield' | 'clipboard';
  status: ContentStatus;
  revision: string;
  approval?: { reviewer: string; date: string };
  content?: SkillContent;
}
