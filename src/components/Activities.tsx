import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronRight,
  GripVertical,
  ListOrdered,
  RotateCcw,
  ShieldCheck,
  X,
  CircleHelp,
} from 'lucide-react';
import { activityNames } from '../content/activities';
import type { ActivityKind, ProcedureStep, Question, SkillContent } from '../content/types';
import { moveItem, scoreQuestions, shuffle } from '../lib/learning';
import type { Attempt } from '../lib/progress';

interface Review {
  id: string;
  prompt: string;
  answer: string;
  correctAnswer: string;
  correct: boolean;
  explanation: string;
  safety: string;
}

function Results({
  title,
  score,
  reviews,
  retry,
  back,
  demo,
}: {
  title: string;
  score: Attempt;
  reviews: Review[];
  retry: () => void;
  back: () => void;
  demo: boolean;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  return (
    <section className="results-view">
      <div className="result-summary">
        <span className="result-icon">
          <CheckCircle2 size={34} />
        </span>
        <span className="eyebrow">{demo ? 'INTERFACE DEMO RESULTS' : 'PRACTICE RESULTS'}</span>
        <h2 ref={heading} tabIndex={-1}>
          A little reflection goes a long way.
        </h2>
        <p>{title} · Every attempt is a chance to learn.</p>
        <div className="score-line">
          <strong>
            {score.percent}
            <span>%</span>
          </strong>
          <span>
            {score.correct} of {score.total}{' '}
            {title === activityNames.sequence
              ? 'steps in the correct position'
              : 'responses correct'}
          </span>
        </div>
        <p className="score-caption">
          {demo ? 'Nonclinical interface practice. ' : ''}A learning activity result, not an
          official competency grade.
        </p>
      </div>
      <div className="result-heading">
        <h3>Your answers, explained</h3>
        <span>{reviews.filter((r) => !r.correct).length} to revisit</span>
      </div>
      <div className="review-list">
        {reviews.map((r, i) => (
          <article key={r.id} className={`review-card ${r.correct ? 'correct' : 'incorrect'}`}>
            <div className="review-title">
              <span className="review-indicator">
                {r.correct ? <Check size={16} /> : <X size={16} />}
              </span>
              <h4>
                {i + 1}. {r.prompt}
              </h4>
              <span className="answer-tag">{r.correct ? 'Correct' : 'Revisit'}</span>
            </div>
            <div className="review-body">
              <p>
                <strong>Your response:</strong> {r.answer}
              </p>
              <p>
                <strong>Correct response:</strong> {r.correctAnswer}
              </p>
              <p>{r.explanation}</p>
              <p className="safety-text">
                <ShieldCheck size={15} />
                {r.safety}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="result-actions">
        <button className="button primary" onClick={retry}>
          <RotateCcw size={16} />
          Retry activity
        </button>
        <button className="button outlined" onClick={back}>
          Back to activities
        </button>
        <Link to="/modules" className="quiet-link">
          Return to dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function Sequencing({
  steps,
  onComplete,
  back,
  demo,
}: {
  steps: ProcedureStep[];
  onComplete: (a: Attempt) => void;
  back: () => void;
  demo: boolean;
}) {
  const [order, setOrder] = useState(() => initialOrder(steps));
  const [dragId, setDragId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<Attempt | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const rearrange = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from < 0) return;
    setOrder(moveItem(order, from, to));
    setMessage(`“${order[from].instruction}” moved to position ${to + 1} of ${order.length}.`);
  };
  const submit = () => {
    const correct = order.filter((s, i) => steps[i].id === s.id).length;
    const score = {
      correct,
      total: steps.length,
      percent: Math.round((correct / steps.length) * 100),
    };
    setResult(score);
    onComplete(score);
  };
  if (result)
    return (
      <Results
        title={activityNames.sequence}
        score={result}
        demo={demo}
        back={back}
        retry={() => {
          setOrder(initialOrder(steps));
          setResult(null);
          setMessage('Activity reset. Steps have been shuffled.');
          requestAnimationFrame(() => heading.current?.focus());
        }}
        reviews={order.map((s, i) => ({
          id: s.id,
          prompt: `Position ${i + 1}`,
          answer: s.instruction,
          correctAnswer: steps[i].instruction,
          correct: steps[i].id === s.id,
          explanation: `In the correct sequence: ${steps[i].rationale}`,
          safety: steps[i].safety,
        }))}
      />
    );
  return (
    <section className="activity-workspace">
      <div className="activity-intro">
        <span className="section-icon">
          <ListOrdered size={25} />
        </span>
        <div>
          <span className="eyebrow">ACTIVITY 01 · {demo ? 'NONCLINICAL DEMO' : 'PRACTICE'}</span>
          <h2 tabIndex={-1} ref={heading}>
            Put the steps in order.
          </h2>
          <p>
            {demo
              ? 'Arrange this platform-learning journey from start to finish.'
              : 'Arrange the procedural steps from first to last.'}
          </p>
        </div>
      </div>
      <div className="activity-instruction">
        <CircleHelp size={17} />
        <p>
          Drag the steps, or use the <strong>up and down buttons</strong>. Select Submit answer when
          you’re ready.
        </p>
      </div>
      <p className="sr-only" role="status">
        {message}
      </p>
      <ol className="sequence-list">
        {order.map((s, i) => (
          <li
            key={s.id}
            className={`sequence-row ${dragId === s.id ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => {
              setDragId(s.id);
              e.dataTransfer.setData('text/plain', s.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnd={() => setDragId(null)}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain');
              rearrange(
                order.findIndex((item) => item.id === id),
                i,
              );
              setDragId(null);
            }}
          >
            <GripVertical size={19} className="drag-grip" />
            <span className="position-number">{i + 1}</span>
            <span className="step-text">{s.instruction}</span>
            <span className="move-controls">
              <button
                disabled={i === 0}
                aria-label={`Move “${s.instruction}” up`}
                onClick={() => rearrange(i, i - 1)}
              >
                <ArrowUp size={17} />
              </button>
              <button
                disabled={i === order.length - 1}
                aria-label={`Move “${s.instruction}” down`}
                onClick={() => rearrange(i, i + 1)}
              >
                <ArrowDown size={17} />
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div className="activity-bottom">
        <span>{steps.length} steps · Unlimited retries</span>
        <button className="button primary" onClick={submit}>
          Submit answer
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

function initialOrder(steps: ProcedureStep[]) {
  const order = shuffle(steps);
  // Ensure a fresh activity actually requires arranging something.
  return order.every((s, i) => s.id === steps[i].id) ? moveItem(order, 0, order.length - 1) : order;
}

export function QuestionActivity({
  questions,
  kind,
  onComplete,
  back,
  demo,
}: {
  questions: Question[];
  kind: 'errors' | 'quiz';
  onComplete: (a: Attempt) => void;
  back: () => void;
  demo: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const q = questions[index];
  const done = questions.filter((item) => submitted[item.id]).length;
  const selected = answers[q.id];
  const answered = submitted[q.id];
  const correct = selected === q.correctOption;
  const changeQuestion = (i: number) => {
    setIndex(i);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const next = () => {
    if (index < questions.length - 1) changeQuestion(index + 1);
    else if (done === questions.length) {
      const score = scoreQuestions(questions, answers);
      onComplete(score);
      setResults(true);
    } else changeQuestion(questions.findIndex((item) => !submitted[item.id]));
  };
  if (results)
    return (
      <Results
        title={activityNames[kind]}
        demo={demo}
        score={scoreQuestions(questions, answers)}
        back={back}
        retry={() => {
          setAnswers({});
          setSubmitted({});
          setIndex(0);
          setResults(false);
          requestAnimationFrame(() => heading.current?.focus());
        }}
        reviews={questions.map((item) => ({
          id: item.id,
          prompt: item.prompt,
          answer: item.options.find((o) => o.id === answers[item.id])!.text,
          correctAnswer: item.options.find((o) => o.id === item.correctOption)!.text,
          correct: item.correctOption === answers[item.id],
          explanation: item.explanation,
          safety: item.safety,
        }))}
      />
    );
  return (
    <section className="activity-workspace">
      <div className="activity-intro">
        <span className="section-icon">
          {kind === 'errors' ? <ShieldCheck size={25} /> : <CircleHelp size={25} />}
        </span>
        <div>
          <span className="eyebrow">
            {kind === 'errors' ? 'ACTIVITY 02' : 'ACTIVITY 03'} ·{' '}
            {demo ? 'NONCLINICAL DEMO' : 'PRACTICE'}
          </span>
          <h2>
            {kind === 'errors'
              ? 'A closer look at the action.'
              : 'Check in with your understanding.'}
          </h2>
          <p>
            {kind === 'errors'
              ? 'Identify the action that needs to be reconsidered.'
              : 'Choose the best answer, then explore the explanation.'}
          </p>
        </div>
      </div>
      <div className="question-progress">
        <span>
          {done} of {questions.length} answered
        </span>
        <span>{Math.round((done / questions.length) * 100)}%</span>
        <progress max={questions.length} value={done} aria-label="Questions answered" />
      </div>
      <nav
        className="question-nav"
        aria-label={kind === 'errors' ? 'Scenario navigation' : 'Question navigation'}
      >
        {questions.map((item, i) => (
          <button
            key={item.id}
            className={`${i === index ? 'current' : ''} ${submitted[item.id] ? 'answered' : ''}`}
            aria-current={i === index ? 'step' : undefined}
            aria-label={`${kind === 'errors' ? 'Scenario' : 'Question'} ${i + 1}${submitted[item.id] ? ', answered' : ''}`}
            onClick={() => changeQuestion(i)}
          >
            {submitted[item.id] ? <Check size={14} /> : i + 1}
          </button>
        ))}
      </nav>
      <span className="eyebrow">
        {kind === 'errors' ? 'SCENARIO' : 'QUESTION'} {index + 1} OF {questions.length}
      </span>
      <fieldset className="question-fieldset" disabled={answered}>
        <legend>
          <h3 ref={heading} tabIndex={-1}>
            {q.prompt}
          </h3>
        </legend>
        <div className="answer-options">
          {q.options.map((o, i) => (
            <label
              key={o.id}
              className={`answer-option ${selected === o.id ? 'is-selected' : ''} ${answered && o.id === q.correctOption ? 'is-correct' : ''} ${answered && selected === o.id && !correct ? 'is-incorrect' : ''}`}
            >
              <input
                type="radio"
                name={`${kind}-${q.id}`}
                value={o.id}
                checked={selected === o.id}
                onChange={() => setAnswers({ ...answers, [q.id]: o.id })}
              />
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{o.text}</span>
              {answered && o.id === q.correctOption && <CheckCircle2 size={19} />}
            </label>
          ))}
        </div>
      </fieldset>
      {answered && (
        <div role="status" className={`answer-feedback ${correct ? 'correct' : 'incorrect'}`}>
          <span>{correct ? <CheckCircle2 size={22} /> : <CircleHelp size={22} />}</span>
          <div>
            <h4>{correct ? 'You’ve got it.' : 'Let’s take another look.'}</h4>
            {!correct && (
              <p>
                <strong>Correct response:</strong>{' '}
                {q.options.find((o) => o.id === q.correctOption)!.text}
              </p>
            )}
            <p>{q.explanation}</p>
            <p className="safety-text">
              <ShieldCheck size={15} />
              {q.safety}
            </p>
          </div>
        </div>
      )}
      <div className="activity-bottom">
        <button
          className="quiet-link"
          disabled={index === 0}
          onClick={() => changeQuestion(index - 1)}
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        {!answered ? (
          <button
            className="button primary"
            disabled={!selected}
            onClick={() => setSubmitted({ ...submitted, [q.id]: true })}
          >
            Submit answer
            <ArrowRight size={16} />
          </button>
        ) : (
          <button className="button primary" onClick={next}>
            {index === questions.length - 1
              ? done === questions.length
                ? 'View results'
                : 'Go to unanswered'
              : kind === 'errors'
                ? 'Next scenario'
                : 'Next question'}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </section>
  );
}

export function ActivityPicker({
  content,
  choose,
}: {
  content: SkillContent;
  choose: (kind: ActivityKind) => void;
}) {
  return (
    <div className="activity-picker">
      {(
        [
          {
            kind: 'sequence',
            icon: ListOrdered,
            label: 'Arrange the steps',
            text: 'Build the sequence and explore why the order matters.',
            count: `${content.steps.length} steps`,
          },
          {
            kind: 'errors',
            icon: ShieldCheck,
            label: 'Spot the error',
            text: 'Look at the scenario and recognize the action to reconsider.',
            count: `${content.scenarios.length} scenarios`,
          },
          {
            kind: 'quiz',
            icon: CircleHelp,
            label: 'Check your knowledge',
            text: 'Pause, reflect, and check in with your understanding.',
            count: `${content.questions.length} questions`,
          },
        ] as const
      ).map(({ kind, icon: Icon, label, text, count }, i) => (
        <article className="activity-choice" key={kind}>
          <div className="activity-choice-top">
            <span className="section-icon">
              <Icon size={25} />
            </span>
            <span className="eyebrow">0{i + 1}</span>
          </div>
          <h3>{label}</h3>
          <p>{text}</p>
          <span className="activity-count">{count} · At your own pace</span>
          <button className="button outlined" onClick={() => choose(kind)}>
            Start activity
            <ArrowRight size={16} />
          </button>
        </article>
      ))}
    </div>
  );
}
