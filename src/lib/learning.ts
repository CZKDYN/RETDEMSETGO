import type { Question, Skill } from '../content/types';

export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const result = [...items];
  if (from < 0 || from >= result.length || to < 0 || to >= result.length) return result;
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

export function scoreQuestions(questions: Question[], answers: Record<string, string>) {
  const correct = questions.filter((q) => answers[q.id] === q.correctOption).length;
  return {
    correct,
    total: questions.length,
    percent: questions.length ? Math.round((correct / questions.length) * 100) : 0,
  };
}

export function releaseIssues(skill: Skill): string[] {
  const issues: string[] = [];
  if (skill.status !== 'Approved') issues.push('Content is awaiting approval.');
  if (
    !skill.approval?.reviewer.trim() ||
    !skill.approval.date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(skill.approval.date) ||
    Number.isNaN(Date.parse(skill.approval.date))
  )
    issues.push('Approval metadata is incomplete.');
  const c = skill.content;
  if (!c) return [...issues, 'Instructional content has not been configured.'];
  if (
    !c.introduction.trim() ||
    !c.objectives.length ||
    c.objectives.some((x) => !x.trim()) ||
    !c.materials.length ||
    c.materials.some((x) => !x.trim())
  )
    issues.push('The overview is incomplete.');
  if (
    c.steps.length < 2 ||
    c.steps.some(
      (s) => !s.id || !s.instruction.trim() || !s.rationale.trim() || !s.safety.trim(),
    ) ||
    new Set(c.steps.map((s) => s.id)).size !== c.steps.length
  )
    issues.push('The procedural guide is incomplete.');
  if (
    !c.references.length ||
    c.references.some((r) => !r.title.trim() || !r.citation.trim() || (r.url && !isHttps(r.url)))
  )
    issues.push('Approved references are required.');
  for (const [name, questions] of [
    ['Scenarios', c.scenarios],
    ['Questions', c.questions],
  ] as const) {
    if (
      !questions.length ||
      new Set(questions.map((q) => q.id)).size !== questions.length ||
      questions.some(
        (q) =>
          !q.id ||
          !q.prompt.trim() ||
          !q.explanation.trim() ||
          !q.safety.trim() ||
          q.options.length < 2 ||
          new Set(q.options.map((o) => o.id)).size !== q.options.length ||
          q.options.some((o) => !o.id || !o.text.trim()) ||
          !q.options.some((o) => o.id === q.correctOption),
      )
    )
      issues.push(`${name} need complete answer keys and feedback.`);
  }
  if (
    c.demonstration &&
    (!isHttps(c.demonstration.url) ||
      !c.demonstration.title.trim() ||
      !c.demonstration.transcript.trim())
  )
    issues.push('Media requires an HTTPS URL, title, and text alternative.');
  return issues;
}

export function isReleased(skill: Skill) {
  return releaseIssues(skill).length === 0;
}

function isHttps(url: string) {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}
