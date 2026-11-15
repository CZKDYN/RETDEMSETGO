import { useState } from 'react';
import { ArrowRight, Bookmark, CheckCircle2, LayoutGrid, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import { skills } from '../content/skills';
import { isReleased } from '../lib/learning';
import type { ProgressState } from '../lib/progress';

export default function Dashboard({
  state,
  savedOnly = false,
}: {
  state: ProgressState;
  savedOnly?: boolean;
}) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const source = savedOnly ? skills.filter((s) => state.progress.bookmarks.includes(s.id)) : skills;
  const filtered = source.filter(
    (s) =>
      `${s.title} ${s.subtitle} ${s.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()) &&
      (filter !== 'approved' || isReleased(s)),
  );
  const demoAttempts = Object.entries(state.progress.attempts)
    .filter(([key]) => key.startsWith('demo:'))
    .flatMap(([, value]) => Object.values(value));
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">YOUR LEARNING PATH</span>
        <h1>{savedOnly ? 'A little inspiration, saved.' : 'Make room for your next step.'}</h1>
        <p>
          {savedOnly
            ? 'Your bookmarked modules, all in one place. Saved only in this browser.'
            : 'Explore your modules, review the why, and practice at your own pace.'}
        </p>
      </div>
      {!savedOnly && (
        <div className="stats-grid">
          <div>
            <span className="stat-icon">
              <LayoutGrid size={22} />
            </span>
            <span>
              <strong>
                3<small>Learning modules</small>
              </strong>
              <p>Selected skills to be finalized</p>
            </span>
          </div>
          <div>
            <span className="stat-icon blue">
              <CheckCircle2 size={22} />
            </span>
            <span>
              <strong>
                {skills.filter(isReleased).length}
                <small>Approved modules</small>
              </strong>
              <p>Clinical validation comes first</p>
            </span>
          </div>
          <div>
            <span className="stat-icon violet">
              <Sparkles size={22} />
            </span>
            <span>
              <strong>
                {demoAttempts.length}
                <small>Demo activities tried</small>
              </strong>
              <p>Interface practice, not clinical grades</p>
            </span>
          </div>
        </div>
      )}
      <div className="module-toolbar">
        <div className="filter-tabs" aria-label="Filter modules">
          <button
            className={filter === 'all' ? 'selected' : ''}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All modules<span>{source.length}</span>
          </button>
          <button
            className={filter === 'approved' ? 'selected' : ''}
            aria-pressed={filter === 'approved'}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
        </div>
        <label className="module-search">
          <Search size={17} />
          <input
            aria-label="Filter modules by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a module…"
          />
        </label>
      </div>
      {filtered.length ? (
        <div className="module-grid">
          {filtered.map((skill) => (
            <SkillCard
              skill={skill}
              key={skill.id}
              saved={state.progress.bookmarks.includes(skill.id)}
              toggle={() => state.toggleBookmark(skill.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="section-icon">
            {savedOnly && !source.length ? <Bookmark size={29} /> : <Search size={29} />}
          </span>
          <h2>
            {savedOnly && !source.length
              ? 'Keep your next step close.'
              : 'No modules here just yet.'}
          </h2>
          <p>
            {savedOnly && !source.length
              ? 'Tap the bookmark on a module to save it for later.'
              : filter === 'approved'
                ? 'Clinical content is awaiting validation. You can explore the module structure or try the nonclinical demo.'
                : 'Try another search to find your module.'}
          </p>
          {savedOnly && !source.length ? (
            <Link to="/modules" className="button primary">
              Explore modules
              <ArrowRight size={16} />
            </Link>
          ) : (
            <button
              className="button outlined"
              onClick={() => {
                setFilter('all');
                setQuery('');
              }}
            >
              Show all modules
            </button>
          )}
        </div>
      )}
      <div className="notice content-notice">
        <CheckCircle2 size={20} />
        <div>
          <strong>Thoughtfully prepared. Carefully reviewed.</strong>
          <p>
            Only approved clinical content is released for study. The current module titles are
            configurable placeholders pending the needs assessment and suitability evaluation.
          </p>
        </div>
      </div>
      <section className="practice-banner">
        <span className="practice-icon">
          <Sparkles size={25} />
        </span>
        <div>
          <h2>Get comfortable with the activities.</h2>
          <p>Try sequencing, error recognition, and a knowledge check in the interface demo.</p>
        </div>
        <Link className="button outlined" to="/demo/fnp-skill-1">
          Try the demo
          <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}
