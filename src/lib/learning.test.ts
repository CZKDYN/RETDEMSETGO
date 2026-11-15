import { describe, expect, it } from 'vitest';
import { demoContent, skills } from '../content/skills';
import type { Skill } from '../content/types';
import { isReleased, moveItem, releaseIssues, scoreQuestions, shuffle } from './learning';

const fixture = (): Skill => ({
  ...skills[0],
  status: 'Approved',
  approval: { reviewer: 'Test fixture only', date: '2026-11-15' },
  content: {
    ...structuredClone(demoContent),
    references: [
      {
        title: 'Nonclinical test fixture',
        citation: 'Test-only source; not a clinical reference.',
      },
    ],
  },
});

describe('clinical publication checks', () => {
  it('keeps every placeholder unpublished', () => {
    expect(skills.every((s) => !isReleased(s))).toBe(true);
  });
  it('requires status, approval metadata, content, references, and answer keys', () => {
    const skill = fixture();
    expect(releaseIssues(skill)).toEqual([]);
    skill.status = 'For Expert Review';
    expect(isReleased(skill)).toBe(false);
    skill.status = 'Approved';
    delete skill.approval;
    expect(isReleased(skill)).toBe(false);
    skill.approval = { reviewer: 'Test', date: 'not a date' };
    expect(isReleased(skill)).toBe(false);
    skill.approval.date = '2026-11-15';
    skill.content!.references = [];
    expect(isReleased(skill)).toBe(false);
    skill.content!.references = fixture().content!.references;
    skill.content!.questions[0].correctOption = 'nonexistent';
    expect(isReleased(skill)).toBe(false);
  });
  it('rejects duplicate identifiers, blank rationales, and unsafe media URLs', () => {
    const skill = fixture();
    skill.content!.steps[1].id = skill.content!.steps[0].id;
    expect(releaseIssues(skill)).toContain('The procedural guide is incomplete.');
    skill.content!.steps = structuredClone(demoContent.steps);
    skill.content!.steps[0].rationale = ' ';
    expect(isReleased(skill)).toBe(false);
    skill.content!.steps = structuredClone(demoContent.steps);
    skill.content!.demonstration = {
      type: 'video',
      url: 'javascript:alert(1)',
      title: 'Test',
      transcript: 'Test alternative',
    };
    expect(isReleased(skill)).toBe(false);
    skill.content!.demonstration.url = 'https://example.org/test.mp4';
    expect(isReleased(skill)).toBe(true);
  });
});

describe('activity scoring and accessible rearranging', () => {
  it('scores correct, incorrect, and missing answers by stable IDs', () => {
    const qs = demoContent.questions;
    expect(scoreQuestions(qs, {})).toEqual({ correct: 0, total: 3, percent: 0 });
    expect(
      scoreQuestions(qs, { purpose: 'supplement', controls: 'mouse', feedback: 'review' }),
    ).toEqual({ correct: 2, total: 3, percent: 67 });
    expect(scoreQuestions(qs, Object.fromEntries(qs.map((q) => [q.id, q.correctOption])))).toEqual({
      correct: 3,
      total: 3,
      percent: 100,
    });
    expect(scoreQuestions([], {})).toEqual({ correct: 0, total: 0, percent: 0 });
  });
  it('moves in both directions without mutating the original or accepting invalid positions', () => {
    const original = ['a', 'b', 'c'];
    expect(moveItem(original, 2, 0)).toEqual(['c', 'a', 'b']);
    expect(moveItem(original, 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveItem(original, -1, 0)).toEqual(original);
    expect(moveItem(original, 0, 3)).toEqual(original);
    expect(original).toEqual(['a', 'b', 'c']);
  });
  it('shuffles a complete copy without dropping or adding steps', () => {
    const original = ['a', 'b', 'c', 'd'];
    const shuffled = shuffle(original, () => 0);
    expect(shuffled).not.toEqual(original);
    expect([...shuffled].sort()).toEqual(original);
    expect(original).toEqual(['a', 'b', 'c', 'd']);
  });
});
