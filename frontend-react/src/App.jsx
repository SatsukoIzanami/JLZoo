import { Navigate, Route, Routes } from 'react-router-dom';
import { buildInfo } from './build-info';
import SiteNav from './components/SiteNav.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import HomePage from './pages/HomePage.jsx';
import './App.css';

function App() {
  return (
    <>
      <header id="navbar">
        <SiteNav />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <div className="build-stamp" aria-label="Build version stamp">
        BUILD v{buildInfo.version} | {buildInfo.builtAt}
      </div>
    </>
  );
}

export default App;
