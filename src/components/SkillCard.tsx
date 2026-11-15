import { ArrowRight, Bookmark, ClipboardList, HeartPulse, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Skill } from '../content/types';
import { isReleased } from '../lib/learning';

export function SkillIcon({ skill, size = 26 }: { skill: Skill; size?: number }) {
  const Icon = { heart: HeartPulse, shield: ShieldCheck, clipboard: ClipboardList }[skill.icon];
  return <Icon size={size} strokeWidth={1.6} />;
}

export default function SkillCard({
  skill,
  saved,
  toggle,
}: {
  skill: Skill;
  saved: boolean;
  toggle: () => void;
}) {
  const released = isReleased(skill);
  return (
    <article className={`skill-card ${skill.color}`}>
      <div className="skill-card-art">
        <span className="skill-number">MODULE {skill.number}</span>
        <span className="skill-art-ring" />
        <span className="skill-art-ring ring-two" />
        <span className="skill-large-icon">
          <SkillIcon skill={skill} size={47} />
        </span>
        <button
          className="bookmark-button"
          aria-label={`${saved ? 'Unsave' : 'Save'} ${skill.title}`}
          aria-pressed={saved}
          onClick={toggle}
        >
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <span className="skill-art-label">FUNDAMENTALS OF NURSING</span>
      </div>
      <div className="skill-card-body">
        <span className={`status-label ${released ? 'approved' : ''}`}>
          <span />
          {released ? 'Approved learning content' : 'Content in preparation'}
        </span>
        <h3>
          <Link to={`/skill/${skill.id}`}>{skill.title}</Link>
        </h3>
        <p>{skill.description}</p>
        <div className="card-activity-list">
          <span>Step-by-step guide</span>
          <span>3 activities</span>
        </div>
        <Link className="card-link" to={`/skill/${skill.id}`}>
          {released ? 'Start learning' : 'Explore module'}
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
