import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  ChevronRight,
  CircleHelp,
  GraduationCap,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Brand } from './Brand';
import { skills } from '../content/skills';
import type { ProgressState } from '../lib/progress';

export default function Layout({
  children,
  state,
}: {
  children: React.ReactNode;
  state: ProgressState;
}) {
  const [menu, setMenu] = useState(false);
  const [help, setHelp] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const location = useLocation();
  useEffect(() => {
    if (help) dialog.current?.showModal();
    else dialog.current?.close();
  }, [help]);
  useEffect(() => {
    if (!menu) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    sidebar.current?.querySelector<HTMLButtonElement>('.mobile-close')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
      if (event.key !== 'Tab') return;
      const elements = [
        ...(sidebar.current?.querySelectorAll<HTMLElement>('a[href], button') || []),
      ].filter((el) => el.getClientRects().length > 0);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', handleKey);
      previous?.focus();
    };
  }, [menu]);
  useEffect(() => {
    if (location.hash)
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    else window.scrollTo(0, 0);
    const heading = document.querySelector<HTMLElement>('h1');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      document.title = `${heading.textContent} · RetDemSetGo!`;
    }
  }, [location.pathname, location.hash]);
  const results = [
    ...skills.map((s) => ({
      title: s.title,
      description: 'Learning module · content in preparation',
      path: `/skill/${s.id}`,
    })),
    {
      title: 'Interface demo',
      description: 'Try all three nonclinical practice activities',
      path: '/demo/fnp-skill-1',
    },
    { title: 'Learning guide', description: 'How to use your learning space', path: '/guide' },
    {
      title: 'About & references',
      description: 'Purpose, research, and content validation',
      path: '/about',
    },
  ].filter((r) => `${r.title} ${r.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  const closeNav = () => {
    setMenu(false);
    setQuery('');
    setSearchOpen(false);
  };
  const pageLabel =
    location.pathname === '/'
      ? 'Home'
      : location.pathname.startsWith('/skill')
        ? 'Learning module'
        : location.pathname.startsWith('/demo')
          ? 'Interface demo'
          : {
              '/modules': 'My learning',
              '/saved': 'Saved modules',
              '/guide': 'Learning guide',
              '/about': 'About & references',
            }[location.pathname] || 'Your learning space';
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {menu && (
        <button
          aria-label="Close navigation"
          className="sidebar-scrim"
          onClick={() => setMenu(false)}
        />
      )}
      <aside id="main-sidebar" ref={sidebar} className={`sidebar ${menu ? 'is-open' : ''}`}>
        <Link to="/" aria-label="RetDemSetGo! home" onClick={closeNav}>
          <Brand />
        </Link>
        <button
          className="mobile-close icon-button"
          onClick={() => setMenu(false)}
          aria-label="Close navigation"
        >
          <X size={22} />
        </button>
        <div className="workspace-label">YOUR LEARNING SPACE</div>
        <nav aria-label="Main navigation">
          <NavLink to="/" end onClick={closeNav}>
            <Home size={19} />
            Home
          </NavLink>
          <NavLink to="/modules" onClick={closeNav}>
            <LayoutGrid size={19} />
            My learning<span className="nav-count">3</span>
          </NavLink>
          <NavLink to="/saved" onClick={closeNav}>
            <Bookmark size={19} />
            Saved modules
            {state.progress.bookmarks.length > 0 && (
              <span className="nav-count">{state.progress.bookmarks.length}</span>
            )}
          </NavLink>
          <div className="nav-divider" />
          <NavLink to="/guide" onClick={closeNav}>
            <BookOpen size={19} />
            Learning guide
          </NavLink>
          <NavLink to="/about" onClick={closeNav}>
            <CircleHelp size={19} />
            About & references
          </NavLink>
        </nav>
        <div className="sidebar-tip">
          <span className="tip-icon">
            <GraduationCap size={25} />
          </span>
          <h3>Every step counts.</h3>
          <p>
            Take your time. Ask why.
            <br />
            Build your confidence.
          </p>
          <Link to="/guide" onClick={closeNav}>
            Make the most of learning
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="sidebar-bottom">
          <span className="university-icon">
            <GraduationCap size={22} />
          </span>
          <div>
            For first-year nursing students<small>University of Makati</small>
          </div>
        </div>
      </aside>
      <div className="workspace" inert={menu}>
        <header className="topbar">
          <div className="topbar-location">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-controls="main-sidebar"
              aria-expanded={menu}
              onClick={() => setMenu(true)}
            >
              <Menu size={22} />
            </button>
            <span className="topbar-brand">Student workspace</span>
            <ChevronRight size={14} />
            <span>{pageLabel}</span>
          </div>
          <div className="topbar-actions">
            <div className="search-wrap">
              <Search size={17} />
              <input
                ref={search}
                aria-label="Search learning resources"
                placeholder="Search your learning space…"
                value={query}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.parentElement?.contains(e.relatedTarget))
                    setSearchOpen(false);
                }}
              />
              {query && (
                <button
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('');
                    search.current?.focus();
                  }}
                >
                  <X size={14} />
                </button>
              )}
              {searchOpen && query.trim() && (
                <div className="search-results">
                  <span className="eyebrow">SEARCH RESULTS</span>
                  {results.length ? (
                    results.map((r) => (
                      <Link
                        key={r.path}
                        to={r.path}
                        onClick={closeNav}
                        onBlur={(e) => {
                          if (!e.currentTarget.closest('.search-wrap')?.contains(e.relatedTarget))
                            setSearchOpen(false);
                        }}
                      >
                        <span>
                          {r.title}
                          <small>{r.description}</small>
                        </span>
                        <ArrowRight size={16} />
                      </Link>
                    ))
                  ) : (
                    <p>No resources found. Try “skill” or “demo”.</p>
                  )}
                </div>
              )}
            </div>
            <button
              className="icon-button help-button"
              aria-label="Help and privacy"
              onClick={() => setHelp(true)}
            >
              <CircleHelp size={20} />
            </button>
            <span className="topbar-separator" />
            <span className="student-avatar" role="img" aria-label="Local student workspace">
              <GraduationCap size={21} />
            </span>
          </div>
        </header>
        <main id="main-content" className="main-content">
          {!state.storageAvailable && (
            <div role="status" className="notice">
              Your browser could not save progress. Activities still work in this session.
            </div>
          )}
          {children}
        </main>
        <footer className="footer">
          <span>
            <Heart size={13} /> Made for learning. Built for confidence.
          </span>
          <span>Supplementary learning · Not a competency assessment</span>
          <Link to="/about">
            About RetDemSetGo!
            <ArrowUpRight size={12} />
          </Link>
        </footer>
      </div>
      <dialog
        ref={dialog}
        className="help-dialog"
        aria-labelledby="help-title"
        onCancel={() => setHelp(false)}
        onClose={() => setHelp(false)}
      >
        <button
          className="dialog-close icon-button"
          aria-label="Close help"
          onClick={() => setHelp(false)}
        >
          <X size={21} />
        </button>
        <span className="section-icon">
          <ShieldCheck size={25} />
        </span>
        <h2 id="help-title">Your space to learn</h2>
        <p>
          No account is required. Saved modules and practice results stay in this browser. They are
          not sent to a research database or shared with an instructor.
        </p>
        <p>
          Clinical content is awaiting validation. The interface demo uses nonclinical examples and
          does not assess nursing competency.
        </p>
        <Link className="button primary" to="/guide" onClick={() => setHelp(false)}>
          Read the learning guide
          <ArrowRight size={16} />
        </Link>
        <button
          className="text-button danger"
          onClick={() => {
            if (
              window.confirm(
                'Clear all saved modules and local practice results from this browser?',
              )
            ) {
              state.clear();
              setHelp(false);
            }
          }}
        >
          Clear local learning data
        </button>
      </dialog>
    </div>
  );
}
