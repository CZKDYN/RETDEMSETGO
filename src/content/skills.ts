import type { Skill, SkillContent } from './types';

// Replace placeholders only after the needs assessment and suitability evaluation.
// Student routes publish content only after the release checks in lib/learning.ts pass.
export const skills: Skill[] = [
  {
    id: 'fnp-skill-1',
    number: '01',
    title: 'FNP Skill 1',
    subtitle: 'Build your foundation',
    description: 'Explore the steps, connect the rationales, and prepare at your own pace.',
    color: 'teal',
    icon: 'heart',
    status: 'Draft',
    revision: '1',
  },
  {
    id: 'fnp-skill-2',
    number: '02',
    title: 'FNP Skill 2',
    subtitle: 'Grow your understanding',
    description: 'Look closer at safe practice through guided review and interactive activities.',
    color: 'blue',
    icon: 'shield',
    status: 'Draft',
    revision: '1',
  },
  {
    id: 'fnp-skill-3',
    number: '03',
    title: 'FNP Skill 3',
    subtitle: 'Put learning into practice',
    description: 'Bring the pieces together with purposeful practice and helpful feedback.',
    color: 'violet',
    icon: 'clipboard',
    status: 'Draft',
    revision: '1',
  },
];

// Nonclinical interface examples. Never used as approved nursing instruction.
export const demoContent: SkillContent = {
  introduction:
    'Get to know your learning space with a short, nonclinical practice session. These examples explain how to use the platform; they do not teach a nursing procedure.',
  objectives: [
    'Find the learning objectives and guide.',
    'Use the activity controls and explanatory feedback.',
    'Recognize the difference between practice results and a competency grade.',
  ],
  materials: ['A phone, tablet, or computer', 'A few minutes to explore'],
  steps: [
    {
      id: 'overview',
      instruction: 'Read the learning objectives.',
      rationale: 'Objectives help you understand what the module is designed to support.',
      safety: 'Check that any clinical material is approved before using it for study.',
    },
    {
      id: 'guide',
      instruction: 'Review the guide and its explanations.',
      rationale: 'Reading the guide first provides context for the practice activities.',
      safety: 'A web guide supplements instructor-led learning.',
    },
    {
      id: 'practice',
      instruction: 'Complete a practice activity.',
      rationale: 'Activities let you check your understanding and receive immediate feedback.',
      safety: 'Practice scores do not certify clinical competency.',
    },
    {
      id: 'feedback',
      instruction: 'Read your feedback and revisit the guide.',
      rationale: 'Use explanations to identify what to review before another attempt.',
      safety: 'Ask your clinical instructor about any uncertainty in clinical learning.',
    },
  ],
  scenarios: [
    {
      id: 'status',
      prompt:
        'A student finds a clinical guide marked “Draft” in an authoring workspace. Which action needs to be reconsidered?',
      options: [
        { id: 'wait', text: 'Wait for reviewed and approved learning material.' },
        { id: 'use', text: 'Treat the draft as approved clinical instruction.' },
        { id: 'ask', text: 'Ask the instructor about suitable study resources.' },
      ],
      correctOption: 'use',
      explanation:
        'A draft has not been released as approved instructional content. Only content that has completed the approval process belongs in the student learning release.',
      safety: 'Do not use unvalidated material to guide patient care.',
    },
    {
      id: 'score',
      prompt:
        'After completing a practice quiz, a student reviews the score. Which interpretation is incorrect?',
      options: [
        { id: 'review', text: 'The feedback can help me choose what to review.' },
        { id: 'retry', text: 'I can revisit the learning material and try again.' },
        { id: 'grade', text: 'This score is my official return-demonstration grade.' },
      ],
      correctOption: 'grade',
      explanation:
        'These are formative practice results. A quiz does not replace a supervised return demonstration or an instructor’s competency assessment.',
      safety: 'Continue instructor-led demonstrations and supervised laboratory practice.',
    },
  ],
  questions: [
    {
      id: 'purpose',
      prompt: 'What is RetDemSetGo! designed to support?',
      options: [
        { id: 'supplement', text: 'Independent review alongside instructor-led learning.' },
        { id: 'replace', text: 'Replacing supervised laboratory activities.' },
        { id: 'certify', text: 'Certifying clinical competency online.' },
      ],
      correctOption: 'supplement',
      explanation:
        'The platform is a supplementary learning resource for reviewing concepts and practicing understanding alongside formal instruction.',
      safety: 'Supervised practice remains essential.',
    },
    {
      id: 'controls',
      prompt: 'How can you arrange steps without dragging them?',
      options: [
        { id: 'mouse', text: 'You must use a mouse.' },
        { id: 'arrows', text: 'Use the Move up and Move down buttons.' },
        { id: 'skip', text: 'Skip the activity.' },
      ],
      correctOption: 'arrows',
      explanation:
        'Each step includes move controls that work with touch, a mouse, and a keyboard. Dragging is an optional alternative.',
      safety: 'Choose the controls that work best for you.',
    },
    {
      id: 'feedback',
      prompt: 'What is a helpful next step after an incorrect practice answer?',
      options: [
        { id: 'ignore', text: 'Ignore the explanation and focus only on the score.' },
        { id: 'stop', text: 'Assume you cannot learn the material.' },
        { id: 'review', text: 'Read the explanation, revisit the guide, and retry.' },
      ],
      correctOption: 'review',
      explanation:
        'Feedback explains the reasoning behind an answer and helps you decide what to revisit. You can retry activities at your own pace.',
      safety: 'Discuss unresolved clinical questions with your instructor.',
    },
  ],
  references: [],
};
