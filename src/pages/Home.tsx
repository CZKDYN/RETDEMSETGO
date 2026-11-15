import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Layers3,
  ListOrdered,
  MoveRight,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroArt from '../components/HeroArt';
import SkillCard from '../components/SkillCard';
import { skills } from '../content/skills';
import type { ProgressState } from '../lib/progress';

export default function Home({ state }: { state: ProgressState }) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <span className="eyebrow">A LITTLE LEARNING, EVERY DAY</span>
          <h1>
            Good things start with practice<span className="title-dot">.</span>
          </h1>
          <p>Your next step toward a more confident return demonstration.</p>
        </div>
        <span className="semester-tag">
          <GraduationHat />
          First-year nursing
        </span>
      </div>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <span />
            YOUR JOURNEY, ONE STEP AT A TIME
          </span>
          <h2 id="hero-title">
            Learn the steps.
            <br />
            Understand the <em>why.</em>
            <br />
            Prepare with confidence.
          </h2>
          <p>
            A thoughtful space to review, practice, and connect the dots in Fundamentals of Nursing
            Practice.
          </p>
          <div className="hero-buttons">
            <Link to="/modules" className="button primary">
              Start learning
              <ArrowRight size={17} />
            </Link>
            <Link to="/guide" className="button hero-secondary">
              <span className="play-circle">
                <Play size={12} fill="currentColor" />
              </span>
              How it works
            </Link>
          </div>
          <div className="hero-proof">
            <span>
              <Check size={14} />
              Learn at your pace
            </span>
            <span>
              <Check size={14} />
              Practice with purpose
            </span>
          </div>
        </div>
        <HeroArt />
      </section>
      <div className="value-strip">
        <div>
          <span className="value-icon">
            <BookOpen size={21} />
          </span>
          <span>
            <strong>Understand, don’t just memorize</strong>
            <small>Connect every step to its rationale.</small>
          </span>
        </div>
        <div>
          <span className="value-icon">
            <Target size={21} />
          </span>
          <span>
            <strong>Learn by doing</strong>
            <small>Put your understanding into practice.</small>
          </span>
        </div>
        <div>
          <span className="value-icon">
            <ShieldCheck size={21} />
          </span>
          <span>
            <strong>A safe space to grow</strong>
            <small>Review, retry, and build confidence.</small>
          </span>
        </div>
      </div>
      <section className="home-modules" aria-labelledby="modules-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR LEARNING PATH</span>
            <h2 id="modules-title">Small steps. Strong foundations.</h2>
            <p>Three skills. A guided path from understanding to practice.</p>
          </div>
          <Link to="/modules" className="quiet-link">
            View all modules
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="module-grid">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              saved={state.progress.bookmarks.includes(skill.id)}
              toggle={() => state.toggleBookmark(skill.id)}
            />
          ))}
        </div>
        <p className="content-note">
          <ShieldCheck size={15} />
          <span>
            Skills will be finalized after the needs assessment and clinical instructor review.
            Approved content will appear here when available.
          </span>
        </p>
      </section>
      <section className="practice-banner">
        <span className="practice-icon">
          <Sparkles size={25} />
        </span>
        <div>
          <span className="eyebrow">CURIOUS? TAKE A LOOK AROUND.</span>
          <h2>Meet your new way to practice.</h2>
          <p>Try the activities with a short, nonclinical interface demo.</p>
        </div>
        <Link className="button outlined" to="/demo/fnp-skill-1">
          Explore the demo
          <ArrowUpRight size={17} />
        </Link>
      </section>
      <section className="journey" aria-labelledby="journey-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A SIMPLE WAY FORWARD</span>
            <h2 id="journey-title">From “what’s next?” to “I’ve got this.”</h2>
          </div>
          <Link className="quiet-link" to="/guide">
            Your learning guide
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="journey-grid">
          {[
            {
              icon: BookOpen,
              title: 'Explore the skill',
              text: 'Start with the objectives and get the bigger picture.',
            },
            {
              icon: ListOrdered,
              title: 'Connect the why',
              text: 'Review each step, its rationale, and safety reminders.',
            },
            {
              icon: Layers3,
              title: 'Practice your way',
              text: 'Sequence, spot errors, and check your understanding.',
            },
            {
              icon: CheckCircle2,
              title: 'Reflect & grow',
              text: 'Read the feedback, revisit, and try again.',
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <div className="journey-step" key={title}>
              <div className="journey-step-top">
                <span>
                  <Icon size={22} />
                </span>
                <small>0{i + 1}</small>
                {i < 3 && <MoveRight className="journey-arrow" size={23} />}
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="educational-note">
        <span>
          <ShieldCheck size={21} />
        </span>
        <p>
          <strong>A companion to your clinical learning.</strong> RetDemSetGo! supports your
          preparation. It complements instructor demonstrations and supervised laboratory practice;
          it does not replace them.
        </p>
        <Link to="/about" aria-label="Read about our educational purpose">
          <ChevronRight size={21} />
        </Link>
      </div>
    </>
  );
}

function GraduationHat() {
  return <ArrowDown size={14} className="semester-arrow" />;
}
