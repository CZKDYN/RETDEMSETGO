import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Heart,
  ListOrdered,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { skills } from '../content/skills';
import { isReleased } from '../lib/learning';

export function Guide() {
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">A SIMPLE WAY FORWARD</span>
        <h1>A little guidance. A confident start.</h1>
        <p>Get to know your learning space, one step at a time.</p>
      </div>
      <section className="guide-hero">
        <span className="section-icon">
          <BookOpen size={30} />
        </span>
        <div>
          <h2>Your learning, at your pace.</h2>
          <p>
            Start with the big picture, explore the reasoning, then put your understanding into
            practice. You can revisit any section whenever you need.
          </p>
        </div>
      </section>
      <div className="guide-grid">
        {[
          {
            icon: GraduationCap,
            title: 'Choose your skill',
            text: 'Open My learning and choose a module. Read the objectives and materials before starting. Until clinical content is approved, use the interface demo to explore the platform.',
          },
          {
            icon: BookOpen,
            title: 'Study the guide',
            text: 'Read each approved procedural step alongside its rationale and safety considerations. View the approved demonstration when one is available.',
          },
          {
            icon: ListOrdered,
            title: 'Practice the sequence',
            text: 'Drag steps into order or use the Move up and Move down buttons. Keyboard users can Tab to these controls and press Enter or Space. Submit to see positional feedback and the correct order.',
          },
          {
            icon: ShieldCheck,
            title: 'Spot the error',
            text: 'Read a scenario, select the action that needs reconsideration, and submit. Review the explanation and safety reminder before moving to the next scenario.',
          },
          {
            icon: ClipboardCheck,
            title: 'Check your understanding',
            text: 'Choose and submit an answer for each question. Use the question buttons to revisit your responses, then open your results. Unanswered questions must be completed first.',
          },
          {
            icon: MessageCircle,
            title: 'Reflect and retry',
            text: 'Your results include the correct responses and their explanations. Revisit the guide, ask your instructor about any uncertainty, and retry. These results are practice feedback, not official grades.',
          },
        ].map(({ icon: Icon, title, text }, i) => (
          <section className="guide-card" key={title}>
            <span className="guide-step">0{i + 1}</span>
            <span className="section-icon">
              <Icon size={23} />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <section className="info-panel">
        <LockKeyhole size={23} />
        <div>
          <h2>Your practice stays with you.</h2>
          <p>
            Bookmarks and activity results are stored only in this browser. There is no account,
            student identifier, or research submission. Shared device? Open Help & privacy in the
            header to clear local data when you finish.
          </p>
          <p>
            Browser storage can be cleared or unavailable. It is a convenience, not a permanent
            academic record.
          </p>
        </div>
      </section>
      <section className="practice-banner">
        <span className="practice-icon">
          <Sparkles size={25} />
        </span>
        <div>
          <h2>Ready for a quick tour?</h2>
          <p>Explore every activity with nonclinical examples.</p>
        </div>
        <Link to="/demo/fnp-skill-1" className="button primary">
          Start the interface demo
          <ArrowRight size={17} />
        </Link>
      </section>
    </>
  );
}

export function About() {
  const published = skills.filter(isReleased);
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">THE PURPOSE BEHIND THE PRACTICE</span>
        <h1>A thoughtful companion to your learning.</h1>
        <p>Designed around understanding, independent review, and growing confidence.</p>
      </div>
      <section className="about-intro">
        <span className="section-icon">
          <Heart size={29} />
        </span>
        <h2>Meet RetDemSetGo!</h2>
        <p>
          An interactive, web-based supplementary learning platform for selected Fundamentals of
          Nursing Practice skills among first-year nursing students at the University of Makati.
        </p>
        <p>
          Our goal is to help learners connect procedural steps with their rationales, recognize
          errors, and reflect on feedback at their own pace.
        </p>
        <span className="small-badge">Development & content validation stage</span>
      </section>
      <div className="two-columns">
        <section className="paper-panel">
          <span className="section-icon">
            <GraduationCap size={25} />
          </span>
          <h2>Grounded in a research purpose</h2>
          <p className="research-title">
            RetDemSetGo!: Development, Content Validation, and Preliminary Usability Evaluation of
            an Interactive Web-Based Learning Platform for Selected Fundamentals of Nursing Practice
            Skills Among First-Year Nursing Students.
          </p>
          <p>
            The platform supports evaluation of usefulness, ease of use, ease of learning, and
            satisfaction. Any USE Questionnaire administration takes place separately under the
            applicable research protocol.
          </p>
          <p>
            No institutional endorsement, expert validation finding, or study outcome is claimed by
            this prototype.
          </p>
        </section>
        <section className="paper-panel">
          <span className="section-icon">
            <ShieldCheck size={25} />
          </span>
          <h2>Learning support, with clear limits</h2>
          <p>
            RetDemSetGo! supplements clinical instructor demonstrations, supervised laboratory
            activities, and actual return demonstrations. It does not replace them.
          </p>
          <p>
            Activity scores are formative learning feedback, not official competency assessments,
            clinical authorizations, or return-demonstration grades.
          </p>
          <p>
            For clinical questions, consult your clinical instructor and approved curricular
            resources. This platform is not a patient-care decision tool.
          </p>
        </section>
      </div>
      <section className="paper-panel references-panel" id="references">
        <span className="eyebrow">APPROVED LEARNING SOURCES</span>
        <h2>References, without the guesswork.</h2>
        {published.length ? (
          published.map((s) => (
            <div key={s.id}>
              <h3>{s.title}</h3>
              <ul>
                {s.content!.references.map((r) => (
                  <li key={r.title}>
                    {r.url ? (
                      <a href={r.url} rel="noreferrer" target="_blank">
                        {r.title} (opens in a new tab)
                      </a>
                    ) : (
                      <strong>{r.title}</strong>
                    )}
                    <p>{r.citation}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="reference-empty">
            <BookOpen size={27} />
            <div>
              <h3>Approved references will appear here.</h3>
              <p>
                Clinical skills and sources are pending the needs assessment, suitability
                evaluation, and expert content review. No clinical references or expert findings
                have been invented for this prototype.
              </p>
            </div>
          </div>
        )}
      </section>
      <section className="info-panel">
        <CheckCircle2 size={23} />
        <div>
          <h2>Content follows a review pathway.</h2>
          <p>
            Draft → For Expert Review → Approved. Approval metadata, complete rationales, safety
            reminders, references, and valid answer keys are required before clinical content is
            shown on student routes. The interface demo is explicitly separate and uses nonclinical
            examples.
          </p>
        </div>
      </section>
      <Link to="/modules" className="button primary">
        Explore the learning space
        <ArrowRight size={17} />
      </Link>
    </>
  );
}
