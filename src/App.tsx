import { Link, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Module from './pages/Module';
import { About, Guide } from './pages/Information';
import { useProgress, type ProgressState } from './lib/progress';

export default function App() {
  const state = useProgress();
  return (
    <Layout state={state}>
      <Routes>
        <Route path="/" element={<Home state={state} />} />
        <Route path="/modules" element={<Dashboard state={state} />} />
        <Route path="/saved" element={<Dashboard state={state} savedOnly />} />
        <Route path="/skill/:id" element={<ModuleRoute state={state} />} />
        <Route path="/demo/:id" element={<ModuleRoute state={state} demo />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/about" element={<About />} />
        <Route
          path="*"
          element={
            <div className="empty-state">
              <h1>Let’s get you back on your path.</h1>
              <p>This page doesn’t exist. Your learning space is a click away.</p>
              <Link className="button primary" to="/">
                Return home
              </Link>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}

function ModuleRoute({ state, demo = false }: { state: ProgressState; demo?: boolean }) {
  const { id } = useParams();
  return <Module key={`${demo}-${id}`} state={state} demo={demo} />;
}
