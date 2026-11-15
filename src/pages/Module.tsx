import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  Info,
  Layers3,
  LockKeyhole,
  Play,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { skills, demoContent } from '../content/skills';
import type { ActivityKind, SkillContent } from '../content/types';
import { activityNames } from '../content/activities';
import { isReleased } from '../lib/learning';
import type { ProgressState } from '../lib/progress';
import { SkillIcon } from '../components/SkillCard';
import { ActivityPicker, QuestionActivity, Sequencing } from '../components/Activities';

const sections = [
  { id: 'overview', title: 'Overview', icon: BookOpen },
  { id: 'guide', title: 'Procedural guide', icon: ClipboardList },
  { id: 'demonstration', title: 'Demonstration', icon: Play },
  { id: 'activities', title: 'Activities', icon: Layers3 },
  { id: 'results', title: 'My results', icon: FileCheck2 },
] as const;
type Section = (typeof sections)[number]['id'];

export default function Module({ state, demo = false }: { state: ProgressState; demo?: boolean }) {
  const { id } = useParams();
  const skill = skills.find((s) => s.id === id);
  const [section, setSection] = useState<Section>('overview');
  const [activity, setActivity] = useState<ActivityKind | null>(null);
  if (!skill)
    return (
      <div className="empty-state">
        <BookOpen size={34} />
        <h1>That module isn’t here.</h1>
        <p>Find your next step in your learning dashboard.</p>
        <Link to="/modules" className="button primary">
          Back to my learning
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  const released = isReleased(skill);
  const content = demo ? demoContent : released ? skill.content : undefined;
  const key = demo ? `demo:${skill.id}:v1` : `clinical:${skill.id}:${skill.revision}`;
  const attempts = state.progress.attempts[key] || {};
  const choose = (kind: ActivityKind) => {
    setSection('activities');
    setActivity(kind);
  };
  const navigate = (next: Section) => {
    setSection(next);
    setActivity(null);
  };
  const sectionIndex = sections.findIndex((s) => s.id === section);
  return (
    <>
      <div className="breadcrumbs">
        <Link to="/modules">My learning</Link>
        <ChevronRight size={14} />
        <span>{demo ? 'Interface demo' : skill.title}</span>
      </div>
      <div className={`module-heading ${skill.color}`}>
        <span className="module-heading-icon">
          <SkillIcon skill={skill} size={35} />
        </span>
        <div>
          <span className="eyebrow">
            {demo
              ? 'EXPLORE THE EXPERIENCE · NONCLINICAL'
              : `FUNDAMENTALS OF NURSING · MODULE ${skill.number}`}
          </span>
          <h1>{demo ? 'A practice run for your learning.' : skill.title}</h1>
          <p>
            {demo
              ? 'Get comfortable with the controls, one small activity at a time.'
              : skill.subtitle}
          </p>
        </div>
        <button
          className="button outlined save-module"
          aria-pressed={state.progress.bookmarks.includes(skill.id)}
          onClick={() => state.toggleBookmark(skill.id)}
        >
          <Bookmark
            size={16}
            fill={state.progress.bookmarks.includes(skill.id) ? 'currentColor' : 'none'}
          />
          {state.progress.bookmarks.includes(skill.id) ? 'Saved' : 'Save module'}
        </button>
      </div>
      {demo ? (
        <div className="demo-notice">
          <Sparkles size={20} />
          <p>
            <strong>You’re in the interface demo.</strong> These examples are about using the
            platform, not clinical procedures. Results here are separate from clinical learning.
          </p>
          <Link to={`/skill/${skill.id}`}>
            Exit demo
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : !released ? (
        <div className="notice content-notice">
          <ShieldCheck size={21} />
          <div>
            <strong>Good learning starts with validated content.</strong>
            <p>
              This skill is a placeholder. Clinical objectives, procedures, media, and answer keys
              will be released after review and approval.
            </p>
          </div>
        </div>
      ) : (
        <div className="approved-note">
          <CheckCircle2 size={17} />
          Approved content · Revision {skill.revision} · Reviewed {skill.approval?.date}
        </div>
      )}
      <nav className="module-tabs" aria-label="Module sections">
        {sections.map(({ id: tabId, title, icon: Icon }, i) => (
          <button
            key={tabId}
            onClick={() => navigate(tabId)}
            aria-current={section === tabId ? 'page' : undefined}
            className={section === tabId ? 'active' : ''}
          >
            <Icon size={17} />
            <span>{title}</span>
            <small aria-hidden="true">0{i + 1}</small>
          </button>
        ))}
      </nav>
      <div className="module-content" key={`${demo}-${skill.id}-${section}`}>
        {!content ? (
          <Unpublished section={section} id={skill.id} />
        ) : (
          <>
            {section === 'overview' && (
              <div className="module-overview">
                <section className="paper-panel">
                  <span className="eyebrow">START WITH THE BIG PICTURE</span>
                  <h2>{demo ? 'Welcome to your practice run.' : 'Get to know the skill.'}</h2>
                  <p>{content.introduction}</p>
                  <h3>Learning objectives</h3>
                  <ul className="objective-list">
                    {content.objectives.map((o) => (
                      <li key={o}>
                        <CheckCircle2 size={18} />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <h3>What you’ll need</h3>
                  <ul className="materials-list">
                    {content.materials.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </section>
                <aside className="module-side-panel">
                  <span className="section-icon">
                    <Layers3 size={25} />
                  </span>
                  <h3>Inside this {demo ? 'demo' : 'module'}</h3>
                  <ul>
                    <li>
                      <BookOpen size={16} />A guide with explanations
                    </li>
                    <li>
                      <Layers3 size={16} />
                      Three interactive activities
                    </li>
                    <li>
                      <FileCheck2 size={16} />
                      Personal practice feedback
                    </li>
                    <li>
                      <RotateIcon />
                      As many retries as you need
                    </li>
                  </ul>
                  <span className="small-badge">Learn at your own pace</span>
                  <p>
                    {demo
                      ? 'No clinical instruction or references are included in this demo.'
                      : 'Review the approved sources below the procedural guide.'}
                  </p>
                </aside>
              </div>
            )}
            {section === 'guide' && <ProcedureGuide content={content} demo={demo} />}
            {section === 'demonstration' && <Demonstration content={content} demo={demo} />}
            {section === 'activities' && (
              <>
                {activity ? (
                  <>
                    <button
                      className="quiet-link back-to-activities"
                      onClick={() => setActivity(null)}
                    >
                      <ArrowLeft size={16} />
                      All activities
                    </button>
                    {activity === 'sequence' ? (
                      <Sequencing
                        key={`${key}-sequence`}
                        steps={content.steps}
                        demo={demo}
                        back={() => setActivity(null)}
                        onComplete={(a) => state.saveAttempt(key, 'sequence', a)}
                      />
                    ) : (
                      <QuestionActivity
                        key={`${key}-${activity}`}
                        questions={activity === 'errors' ? content.scenarios : content.questions}
                        kind={activity}
                        demo={demo}
                        back={() => setActivity(null)}
                        onComplete={(a) => state.saveAttempt(key, activity, a)}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className="content-section-heading">
                      <span className="eyebrow">LEARNING THROUGH DOING</span>
                      <h2>Make a little room for practice.</h2>
                      <p>
                        {demo
                          ? 'Try the controls using nonclinical examples. Choose any activity to begin.'
                          : 'Choose an activity. Review the feedback and revisit the guide as often as you need.'}
                      </p>
                    </div>
                    <ActivityPicker content={content} choose={choose} />
                  </>
                )}
              </>
            )}
            {section === 'results' && (
              <>
                <div className="content-section-heading">
                  <span className="eyebrow">REFLECT. REVISIT. GROW.</span>
                  <h2>Your {demo ? 'demo ' : ''}practice, at a glance.</h2>
                  <p>
                    Latest completed attempts in this browser. These are learning results, not
                    official grades.
                  </p>
                </div>
                {Object.keys(attempts).length ? (
                  <div className="saved-results">
                    {(['sequence', 'errors', 'quiz'] as const)
                      .filter((kind) => attempts[kind])
                      .map((kind) => (
                        <article className="paper-panel" key={kind}>
                          <span className="small-badge">
                            {demo ? 'Interface demo' : 'Learning activity'}
                          </span>
                          <h3>{activityNames[kind]}</h3>
                          <strong className="saved-score">
                            {attempts[kind]!.percent}
                            <small>%</small>
                          </strong>
                          <p>
                            {attempts[kind]!.correct} of {attempts[kind]!.total} correct{' '}
                            {kind === 'sequence' ? 'positions' : 'responses'}
                          </p>
                          <button className="quiet-link" onClick={() => choose(kind)}>
                            Practice again
                            <ArrowRight size={16} />
                          </button>
                        </article>
                      ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="section-icon">
                      <FileCheck2 size={30} />
                    </span>
                    <h3>Your next step is a little practice.</h3>
                    <p>Complete an activity to see your latest results here.</p>
                    <button className="button primary" onClick={() => navigate('activities')}>
                      Explore activities
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
                <div className="educational-note">
                  <Info size={20} />
                  <p>
                    Full answer explanations appear after submitting each activity. You can retry
                    any activity to review its feedback again. No results are sent to an instructor
                    or research database.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {!(section === 'activities' && activity) && (
        <div className="module-bottom-nav">
          <button
            disabled={sectionIndex === 0}
            className="quiet-link"
            onClick={() => navigate(sections[sectionIndex - 1].id)}
          >
            <ArrowLeft size={16} />
            Previous section
          </button>
          {sectionIndex < sections.length - 1 ? (
            <button
              className="button primary"
              onClick={() => navigate(sections[sectionIndex + 1].id)}
            >
              Continue to {sections[sectionIndex + 1].title.toLowerCase()}
              <ArrowRight size={16} />
            </button>
          ) : (
            <Link to="/modules" className="button primary">
              Return to dashboard
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function RotateIcon() {
  return <CheckCircle2 size={16} />;
}

function Unpublished({ section, id }: { section: Section; id: string }) {
  const descriptions: Record<Section, { title: string; text: string; icon: typeof BookOpen }> = {
    overview: {
      title: 'A foundation worth getting right.',
      text: 'The selected skill, learning objectives, and required materials will appear here after the needs assessment, suitability evaluation, and clinical content approval.',
      icon: BookOpen,
    },
    guide: {
      title: 'Every step needs a sound rationale.',
      text: 'Approved procedural instructions, rationales, safety considerations, and references will be published here together. No unvalidated clinical procedure is shown.',
      icon: ClipboardList,
    },
    demonstration: {
      title: 'See the skill when it’s ready.',
      text: 'Approved instructional images or video, with accessible text alternatives, will be added when available. There is no demonstration to view yet.',
      icon: Play,
    },
    activities: {
      title: 'Practice starts with approved content.',
      text: 'Clinical sequencing, scenarios, and formative questions are awaiting validated answer keys. You can try all three activity types in the nonclinical interface demo.',
      icon: Layers3,
    },
    results: {
      title: 'Your clinical learning story starts here.',
      text: 'Clinical activity results will appear after approved learning content is available. Interface demo results are stored separately and are visible inside the demo.',
      icon: FileCheck2,
    },
  };
  const { title, text, icon: Icon } = descriptions[section];
  return (
    <section className="unpublished-panel">
      <span className="unpublished-icon">
        <Icon size={36} />
        <span>
          <LockKeyhole size={14} />
        </span>
      </span>
      <span className="small-badge">Awaiting clinical validation</span>
      <h2>{title}</h2>
      <p>{text}</p>
      <Link to={`/demo/${id}`} className="button primary">
        <Sparkles size={17} />
        Try the interface demo
        <ArrowRight size={16} />
      </Link>
      <Link to="/about#references" className="quiet-link">
        About content and references
        <ChevronRight size={15} />
      </Link>
    </section>
  );
}

function ProcedureGuide({ content, demo }: { content: SkillContent; demo: boolean }) {
  return (
    <section>
      <div className="content-section-heading">
        <span className="eyebrow">THE STEP AND THE WHY</span>
        <h2>{demo ? 'Your platform-learning journey.' : 'A step-by-step guide.'}</h2>
        <p>
          {demo
            ? 'An example journey for exploring this platform. This is not a nursing procedure.'
            : 'Expand each step to explore the rationale and safety considerations.'}
        </p>
      </div>
      <ol className="procedure-list">
        {content.steps.map((s, i) => (
          <li key={s.id}>
            <details open={i === 0}>
              <summary>
                <span className="position-number">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.instruction}</h3>
                <ChevronRight size={18} />
              </summary>
              <div className="procedure-explanation">
                <span className="eyebrow">WHY IT MATTERS</span>
                <p>{s.rationale}</p>
                <p className="safety-text">
                  <ShieldCheck size={16} />
                  {s.safety}
                </p>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <section className="paper-panel guide-references">
        <h3>References</h3>
        {content.references.length ? (
          <ul>
            {content.references.map((r) => (
              <li key={r.title}>
                <strong>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer">
                      {r.title} (opens in a new tab)
                    </a>
                  ) : (
                    r.title
                  )}
                </strong>
                <p>{r.citation}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No clinical references are used in this nonclinical interface demo. Approved sources
            will be attached to validated clinical content.
          </p>
        )}
      </section>
    </section>
  );
}

function Demonstration({ content, demo }: { content: SkillContent; demo: boolean }) {
  const media = content.demonstration;
  return (
    <section className="paper-panel media-panel">
      <span className="eyebrow">WATCH. NOTICE. UNDERSTAND.</span>
      <h2>{demo ? 'Space for an approved demonstration.' : 'Instructional demonstration'}</h2>
      {media ? (
        <>
          <h3>{media.title}</h3>
          {media.type === 'video' ? (
            <video controls preload="metadata" aria-label={media.title} src={media.url} />
          ) : (
            <img src={media.url} alt={media.title} loading="lazy" />
          )}
          <h3>{media.type === 'video' ? 'Descriptive transcript' : 'Image description'}</h3>
          <p className="media-transcript">{media.transcript}</p>
          <p className="safety-text">
            <ShieldCheck size={16} />
            Use approved media alongside supervised instruction.
          </p>
        </>
      ) : (
        <>
          <div className="media-placeholder">
            <span>
              <Play size={33} />
            </span>
            <h3>No demonstration has been added.</h3>
            <p>
              {demo
                ? 'The demo includes no clinical images or videos. Approved media can be configured with a descriptive transcript or text alternative.'
                : 'A demonstration will appear here once approved instructional media is available.'}
            </p>
          </div>
          <p className="safety-text">
            <ShieldCheck size={16} />
            Instructor demonstrations and supervised laboratory practice remain essential.
          </p>
        </>
      )}
    </section>
  );
}
