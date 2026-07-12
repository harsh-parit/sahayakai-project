import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import EligibilityPage from './pages/EligibilityPage';
import ResultPage from './pages/ResultPage';
import AssistantPage from './pages/AssistantPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import { ROUTES } from './constants';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME}        element={<HomePage />} />
          <Route path={ROUTES.ELIGIBILITY} element={<EligibilityPage />} />
          <Route path={ROUTES.RESULT}      element={<ResultPage />} />
          <Route path={ROUTES.ASSISTANT}   element={<AssistantPage />} />
          <Route path={ROUTES.DASHBOARD}   element={<DashboardPage />} />
          <Route path={ROUTES.ABOUT}       element={<AboutPage />} />
          <Route path="*"                  element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
